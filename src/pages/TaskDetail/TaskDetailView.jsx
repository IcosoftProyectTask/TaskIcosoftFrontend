import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Paperclip, Check, Eye } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';
import TaskHeader from './TaskHeader';
import CommentSection from './CommentSection';
import TaskDetails from './TaskDetails';
import { getSupportTaskById } from '../../service/SupportTask';
import { getCommentsByTaskId, createComment, deleteComment } from '../../service/CommentService';
import { createReply, deleteReply } from '../../service/commentReplyService';
import { toast } from 'react-toastify';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import signalRService from '../../service/signalRService';

const TaskDetailView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isReplying, setIsReplying] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [comments, setComments] = useState([]);
  const commentInputRef = useRef(null);
  const { userInfo } = useUserContext();
  const [recentlyCreatedIds, setRecentlyCreatedIds] = useState([]);

  // Función para cargar la tarea y los comentarios
  useEffect(() => {
    const fetchTaskAndComments = async () => {
      try {
        setLoading(true);
        const taskResponse = await getSupportTaskById(id);
        if (!taskResponse.success) throw new Error('No se pudo cargar la tarea');
        setTask(taskResponse.data);

        const commentsData = await getCommentsByTaskId(id);
        setComments(commentsData);
      } catch (err) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTaskAndComments();
  }, [id]);

  // Configuración de SignalR
  useEffect(() => {
    // Obtener token de autenticación
    const accessToken = localStorage.getItem('token');

    // Iniciar conexión SignalR y pasar el ID de la tarea
    // para que se una al grupo automáticamente cuando se conecte
    if (id) {
      signalRService.startConnection(accessToken, parseInt(id));
    }

    // Registrar manejadores de eventos
    signalRService.onReceiveNewComment(handleSignalRNewComment);
    signalRService.onReceiveNewReply(handleSignalRNewReply);
    signalRService.onReceiveCommentUpdate(handleSignalRCommentUpdate);
    signalRService.onReceiveReplyUpdate(handleSignalRReplyUpdate);
    signalRService.onReceiveCommentDeletion(handleSignalRCommentDeletion);
    signalRService.onReceiveReplyDeletion(handleSignalRReplyDeletion);

    // Log para depuración
    console.log(`Configurando SignalR para la tarea ${id}`);

    // Limpiar al desmontar
    return () => {
      if (id) {
        console.log(`Saliendo del grupo de la tarea ${id}`);
        signalRService.leaveTaskGroup(parseInt(id));
      }
      signalRService.stopConnection();
    };
  }, [id]);

  // Manejadores de eventos de SignalR
  const handleSignalRNewComment = (comment) => {
    console.log("Recibido comentario via SignalR:", comment);

    // Verificar si este comentario fue creado por nosotros recientemente
    if (recentlyCreatedIds.includes(comment.id)) {
      console.log("Ignorando comentario que acabamos de crear:", comment.id);
      return;
    }

    // Verificar si ya existe este comentario en nuestra lista
    if (comments.some(c => c.id === comment.id)) {
      console.log("Ignorando comentario duplicado:", comment.id);
      return;
    }

    // Si es un comentario nuevo de otro usuario, lo agregamos
    const enhancedComment = {
      ...comment,
      user: comment.user || {
        id: comment.userId,
        name: "Usuario",
        avatar: null
      },
      replies: comment.replies || []
    };

    setComments(prevComments => [enhancedComment, ...prevComments]);
   // toast.info("Nuevo comentario recibido");
  };

  const handleSignalRNewReply = (reply) => {
    console.log("Recibida respuesta via SignalR:", reply);

    // Verificar si ya fue procesada o es nuestra propia respuesta
    if (recentlyCreatedIds.includes(reply.id)) {
      console.log("Ignorando respuesta que acabamos de crear:", reply.id);
      return;
    }

    // Verificar si ya existe
    const replyExists = comments.some(comment =>
      comment.replies && comment.replies.some(r => r.id === reply.id)
    );

    if (replyExists) {
      console.log("Ignorando respuesta duplicada:", reply.id);
      return;
    }

    // Si no hay commentId, tenemos que buscar manualmente a qué comentario pertenece
    // Esta es una solución temporal mientras se arregla el backend
    if (!reply.commentId) {
      console.warn("La respuesta no incluye commentId. Intentando buscarla mediante el API...");

      // Opción 1: Cargar la respuesta completa del servidor
      getReplyById(reply.id)
        .then(fullReply => {
          if (fullReply && fullReply.commentId) {
            console.log("Obtenida respuesta completa:", fullReply);
            // Ahora tenemos el commentId, podemos agregarla
            addReplyToComment(fullReply);
          } else {
            console.error("No se pudo obtener el commentId de la respuesta");
          }
        })
        .catch(err => {
          console.error("Error al obtener la respuesta completa:", err);
        });

      return;
    }

    // Si tenemos commentId, agregamos la respuesta normalmente
    addReplyToComment(reply);
  };

  // Función auxiliar para agregar la respuesta al comentario correspondiente
  const addReplyToComment = (reply) => {
    const enhancedReply = {
      ...reply,
      user: reply.user || {
        id: reply.userId,
        name: "Usuario",
        avatar: null
      },
      parentReplyId: reply.parentReplyId || 0
    };

    setComments(prevComments =>
      prevComments.map(comment => {
        if (comment.id === reply.commentId) {
          console.log(`Agregando respuesta al comentario ${comment.id}:`, enhancedReply);
          return {
            ...comment,
            replies: comment.replies ? [...comment.replies, enhancedReply] : [enhancedReply]
          };
        }
        return comment;
      })
    );

  //  toast.info("Nueva respuesta recibida");
  };

  const handleSignalRCommentUpdate = (updatedComment) => {
    console.log("Actualización de comentario recibida:", updatedComment);

    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === updatedComment.id ?
          {
            ...updatedComment,
            // Preservar las repuestas en caso de que no vengan incluidas en el updatedComment
            replies: updatedComment.replies || comment.replies
          } : comment
      )
    );
  };

  const handleSignalRReplyUpdate = (updatedReply) => {
    console.log("Actualización de respuesta recibida:", updatedReply);

    setComments(prevComments =>
      prevComments.map(comment => {
        if (comment.id === updatedReply.commentId) {
          return {
            ...comment,
            replies: comment.replies?.map(reply =>
              reply.id === updatedReply.id ? updatedReply : reply
            )
          };
        }
        return comment;
      })
    );
  };

  const handleSignalRCommentDeletion = (commentId) => {
    console.log("Eliminación de comentario recibida:", commentId);

    setComments(prevComments => {
      // Verificar si el comentario existe para evitar cambios innecesarios
      if (prevComments.some(comment => comment.id === commentId)) {
        return prevComments.filter(comment => comment.id !== commentId);
      }
      return prevComments;
    });
  };

  const handleSignalRReplyDeletion = (replyId) => {
    console.log("Eliminación de respuesta recibida:", replyId);

    // Verificar si algún comentario contiene esta respuesta
    const hasReply = comments.some(comment =>
      comment.replies && comment.replies.some(reply => reply.id === replyId)
    );

    if (hasReply) {
      setComments(prevComments =>
        prevComments.map(comment => ({
          ...comment,
          replies: comment.replies?.filter(reply => reply.id !== replyId)
        }))
      );
    }
  };

  // Función para formatear la fecha
  const getFormattedDate = (dateString) =>
    isValidDate(dateString) ? format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es }) : 'Fecha inválida';

  // Función para obtener el color según la prioridad
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'alta': return 'bg-red-500 text-white';
      case 'media': return 'bg-yellow-500 text-black';
      case 'baja': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Función para obtener el color según el estado
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente': return 'bg-yellow-500';
      case 'en progreso': return 'bg-blue-500';
      case 'completada': return 'bg-green-500';
      case 'cancelada': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Función para obtener el tiempo relativo
  const getRelativeTime = (dateString) =>
    isValidDate(dateString) ? formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es }) : 'Fecha inválida';

  // Función para validar una fecha
  const isValidDate = (dateString) =>
    !isNaN(new Date(dateString).getTime());

  // Función para enviar un nuevo comentario
  const handleSubmitComment = async (commentContent) => {
    if (!commentContent.trim()) return;

    try {
      const commentData = {
        content: commentContent,
        taskId: parseInt(id),
        userId: userInfo.id,
      };

      console.log("Enviando comentario:", commentData);

      // ID temporal para rastreo local
      const tempId = `temp-${Date.now()}`;

      // Primero agregamos localmente para una mejor experiencia de usuario
      const tempComment = {
        id: tempId,
        content: commentContent,
        createdAt: new Date().toISOString(),
        user: {
          id: userInfo.id,
          name: userInfo.name,
          avatar: userInfo.avatar,
        },
        likes: 0,
        replies: [],
        taskId: parseInt(id),
        isTemp: true
      };

      setComments(prevComments => [tempComment, ...prevComments]);

      // Enviar al servidor
      const response = await createComment(commentData);

      if (response && (response.id || (response.data && response.data.id))) {
        const serverId = response.id || response.data.id;

        // Eliminar el comentario temporal
        setComments(prevComments =>
          prevComments.filter(comment => comment.id !== tempId)
        );

        // Importante: Añadir este ID a la lista de IDs recién creados
        // para que sepamos ignorar notificaciones SignalR para este comentario
        setRecentlyCreatedIds(prev => [...prev, serverId]);

        // Limpiar el ID recién creado después de un tiempo razonable
        setTimeout(() => {
          setRecentlyCreatedIds(prev => prev.filter(id => id !== serverId));
        }, 5000); // 5 segundos deberían ser suficientes

        console.log("Comentario creado exitosamente:", serverId);
        toast.success('Comentario añadido correctamente');
      }
    } catch (error) {
      console.error('Error al crear el comentario:', error);
      toast.error('Error al crear el comentario');

      // Eliminar el comentario temporal en caso de error
      setComments(prevComments =>
        prevComments.filter(comment => !comment.isTemp)
      );
    }
  };

  // Función para enviar una respuesta
  const handleSubmitReply = async (parentId, isReplyToReply, replyContent, commentId) => {
    if (!replyContent.trim()) return;

    try {
      const replyData = {
        content: replyContent,
        commentId: parseInt(commentId),
        // IMPORTANTE: Siempre usar 0 en lugar de null cuando no es una respuesta a otra respuesta
        parentReplyId: isReplyToReply ? parseInt(parentId) : 0,
        userId: userInfo.id,
      };

      console.log('Enviando respuesta:', replyData);

      // ID temporal para rastreo local
      const tempId = `temp-${Date.now()}`;

      // Crear una respuesta temporal con ID único para mejor UX
      const tempReply = {
        id: tempId,
        content: replyContent,
        createdAt: new Date().toISOString(),
        commentId: parseInt(commentId),
        parentReplyId: isReplyToReply ? parseInt(parentId) : 0, // También usar 0 aquí
        user: {
          id: userInfo.id,
          name: userInfo.name,
          avatar: userInfo.avatar,
        },
        isTemp: true // Flag para identificar respuestas temporales
      };

      // Agregar la respuesta temporal al comentario
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === parseInt(commentId)) {
            return {
              ...comment,
              replies: comment.replies
                ? [...comment.replies, tempReply]
                : [tempReply],
            };
          }
          return comment;
        })
      );

      // Enviar la respuesta al servidor
      const createdReply = await createReply(replyData);

      if (createdReply && createdReply.data) {
        const serverId = createdReply.data.id;

        // Eliminar la respuesta temporal
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment.id === parseInt(commentId)) {
              return {
                ...comment,
                replies: comment.replies
                  ? comment.replies.filter(reply => reply.id !== tempId)
                  : [],
              };
            }
            return comment;
          })
        );

        // Añadir este ID a la lista de recién creados
        setRecentlyCreatedIds(prev => [...prev, serverId]);

        // Limpiar el ID recién creado después de un tiempo razonable
        setTimeout(() => {
          setRecentlyCreatedIds(prev => prev.filter(id => id !== serverId));
        }, 5000);

        console.log("Respuesta creada exitosamente:", serverId);
        toast.success('Respuesta añadida correctamente');
      }

      setReplyContent('');
      setIsReplying(null);
    } catch (error) {
      console.error('Error al crear la respuesta:', error);
      toast.error('Error al crear la respuesta');

      // Eliminar la respuesta temporal en caso de error
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === parseInt(commentId)) {
            return {
              ...comment,
              replies: comment.replies
                ? comment.replies.filter(reply => !reply.isTemp)
                : [],
            };
          }
          return comment;
        })
      );
    }
  };
// Función para eliminar un comentario
const handleDeleteComment = async (commentId) => {
  try {
    // Buscar el comentario en el estado actual
    const commentToDelete = comments.find(comment => comment.id === commentId);
    
    if (!commentToDelete) {
      toast.error('No se encontró el comentario');
      return;
    }

    // Verificar si el comentario tiene un objeto user y si tiene un id
    if (!commentToDelete.user || commentToDelete.user.id === undefined) {
      toast.error('No se puede identificar al autor del comentario');
      return;
    }

    // Verificar si el usuario actual es el autor del comentario
    // Convertir ambos a string para una comparación más flexible
    if (String(commentToDelete.user.id) !== String(userInfo.id)) {
      console.log(`Comparación de IDs fallida: ${commentToDelete.user.id} (${typeof commentToDelete.user.id}) vs ${userInfo.id} (${typeof userInfo.id})`);
      toast.error('No tienes permiso para eliminar este comentario');
      return;
    }

    // Optimistic update: eliminar localmente primero
    setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));

    // Luego enviar al servidor
    const result = await deleteComment(commentId);

    if (!result.success) {
      // Restaurar el comentario si hubo un error
      setComments(prev => [commentToDelete, ...prev]);
      toast.error('Error al eliminar el comentario');
      return;
    }

    // Añadir a la lista de IDs recién manejados para evitar duplicados
    setRecentlyCreatedIds(prev => [...prev, commentId]);
    setTimeout(() => {
      setRecentlyCreatedIds(prev => prev.filter(id => id !== commentId));
    }, 5000);

    console.log("Comentario eliminado exitosamente:", commentId);
    toast.success('Comentario eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar el comentario:', error);
    toast.error('Error al eliminar el comentario');
  }
};

// Función para eliminar una respuesta
const handleDeleteReply = async (replyId, parentCommentId) => {
  try {
    // Buscar el comentario padre en el estado actual
    const parentComment = comments.find(comment => comment.id === parentCommentId);
    
    if (!parentComment || !parentComment.replies) {
      toast.error('No se encontró el comentario padre');
      return;
    }

    // Buscar la respuesta en el comentario padre
    const replyToDelete = parentComment.replies.find(reply => reply.id === replyId);
    
    if (!replyToDelete) {
      toast.error('No se encontró la respuesta');
      return;
    }

    // Verificar si la respuesta tiene un objeto user y si tiene un id
    if (!replyToDelete.user || replyToDelete.user.id === undefined) {
      toast.error('No se puede identificar al autor de la respuesta');
      return;
    }

    // Verificar si el usuario actual es el autor de la respuesta
    // Convertir ambos a string para una comparación más flexible
    if (String(replyToDelete.user.id) !== String(userInfo.id)) {
      console.log(`Comparación de IDs fallida: ${replyToDelete.user.id} (${typeof replyToDelete.user.id}) vs ${userInfo.id} (${typeof userInfo.id})`);
      toast.error('No tienes permiso para eliminar esta respuesta');
      return;
    }

    // Optimistic update: eliminar localmente primero
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === parentCommentId
          ? {
            ...comment,
            replies: comment.replies ? comment.replies.filter((reply) => reply.id !== replyId) : [],
          }
          : comment
      )
    );

    // Luego enviar al servidor
    const result = await deleteReply(replyId);

    if (!result.success) {
      // Restaurar la respuesta si hubo un error
      setComments(prev =>
        prev.map(comment =>
          comment.id === parentCommentId
            ? {
              ...comment,
              replies: comment.replies
                ? [...comment.replies, replyToDelete]
                : [replyToDelete]
            }
            : comment
        )
      );
      toast.error('Error al eliminar la respuesta');
      return;
    }

    // Añadir a la lista de IDs recién manejados para evitar duplicados
    setRecentlyCreatedIds(prev => [...prev, replyId]);
    setTimeout(() => {
      setRecentlyCreatedIds(prev => prev.filter(id => id !== replyId));
    }, 5000);

    console.log("Respuesta eliminada exitosamente:", replyId);
    toast.success('Respuesta eliminada correctamente');
  } catch (error) {
    console.error('Error al eliminar la respuesta:', error);
    toast.error('Error al eliminar la respuesta');
  }
};
 
  // Mostrar estado de carga
  if (loading) return <div className="text-center py-6">Cargando detalles de la tarea...</div>;

  // Mostrar estado de error
  if (error || !task) return (
    <div className="text-center py-6">
      <p className="text-red-500">{error || 'No se pudo cargar la tarea'}</p>
      <Button onClick={() => navigate('/dashboard')}>Volver al dashboard</Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Paperclip className="w-4 h-4 mr-2" /> Adjuntar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Eye className="w-4 h-4 mr-2" /> Visualizar Metrica
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TaskHeader
            task={task}
            getFormattedDate={getFormattedDate}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
          />
          <CommentSection
            comments={comments}
            userInfo={userInfo}
            newComment={newComment}
            setNewComment={setNewComment}
            isReplying={isReplying}
            setIsReplying={setIsReplying}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            getFormattedDate={getFormattedDate}
            handleSubmitComment={handleSubmitComment}
            handleSubmitReply={handleSubmitReply}
            handleDeleteComment={handleDeleteComment}
            handleDeleteReply={handleDeleteReply}
          />
        </div>
        <TaskDetails task={task} getFormattedDate={getFormattedDate} />
      </div>
    </div>
  );
};

export default TaskDetailView;