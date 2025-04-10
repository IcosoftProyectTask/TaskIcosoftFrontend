import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Tooltip } from '../../components/ui/Tooltip';
import { MessageSquare, Paperclip, Send } from 'lucide-react';
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";

const CommentSection = ({
  comments,
  userInfo,
  getFormattedDate,
  handleSubmitComment,
  handleLikeComment,
  handleDeleteComment,
  handleSubmitReply,
  handleDeleteReply,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isReplying, setIsReplying] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const commentInputRef = useRef(null);

  // Función para obtener las dos primeras letras del nombre
  const getInitials = (name) => {
    if (!name) return 'US'; // Devuelve 'US' como iniciales por defecto
    const names = name.split(' ');
    const initials = names
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase();
    return initials.slice(0, 2);
  };

  // Función para manejar el envío de un nuevo comentario
  const onSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      handleSubmitComment(newComment);
      setNewComment('');
    }
  };

  // Función para manejar el envío de una respuesta
  const onSubmitReply = (parentId, isReplyToReply, commentId) => {
    if (replyContent.trim()) {
      handleSubmitReply(parentId, isReplyToReply, replyContent, commentId);
      setReplyContent('');
      setIsReplying(null);
    }
  };

  // Función para asegurar que exista el usuario
  const ensureUserExists = (userObj) => {
    return userObj || { id: null, name: "Usuario", avatar: null };
  };

  // Función para verificar si el usuario actual es el creador del contenido
  // Asegura que la comparación sea compatible con diferentes tipos de ID
  const isCreator = (contentUserId) => {
    if (!userInfo || userInfo.id === undefined || contentUserId === undefined) {
      return false;
    }

    // Convertir ambos a string para una comparación consistente
    return String(userInfo.id) === String(contentUserId);
  };

  return (
    <Card className="shadow-md dark:bg-gray-900 border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium dark:text-white flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          <span>
            Comentarios ({comments.reduce((acc, comment) => acc + 1 + (comment.replies ? comment.replies.length : 0), 0)})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {comments.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No hay comentarios aún.</p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => {
              // Asegurar que el comentario tenga un objeto user
              const commentUser = ensureUserExists(comment.user);

              return (
                <div key={comment.id} className="space-y-4">
                  {/* Comentario principal */}
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                    <div className="flex gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={commentUser.avatar} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {getInitials(commentUser.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium dark:text-white">
                            {commentUser.name}
                          </span>
                          <Tooltip content={getFormattedDate(comment.createdAt)}>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {getFormattedDate(comment.createdAt)}
                            </span>
                          </Tooltip>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 mt-2">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsReplying({ type: 'comment', id: comment.id })}
                            className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Responder
                          </Button>

                          {isCreator(commentUser.id) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                SweetAlertEliminar(
                                  '¿Deseas eliminar este comentario?',
                                  () => handleDeleteComment(comment.id)
                                );
                              }}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                            >
                              🗑️ Eliminar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Formulario de respuesta */}
                    {isReplying?.type === 'comment' && isReplying.id === comment.id && (
                      <div className="mt-4 ml-12">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <Textarea
                              ref={commentInputRef}
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Escribe una respuesta..."
                              className="w-full resize-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              rows={2}
                            />
                            <div className="flex justify-end mt-2 gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsReplying(null)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => onSubmitReply(comment.id, false, comment.id)}
                                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Enviar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Respuestas al comentario */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-12 space-y-4">
                      {comment.replies.map((reply) => {
                        // Asegurar que la respuesta tenga un objeto user
                        const replyUser = ensureUserExists(reply.user);

                        return (
                          <div key={reply.id} className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                            <div className="flex gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={replyUser.avatar} />
                                <AvatarFallback className="bg-blue-600 text-white">
                                  {getInitials(replyUser.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium dark:text-white">
                                    {replyUser.name}
                                  </span>
                                  <Tooltip content={getFormattedDate(reply.createdAt)}>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      {getFormattedDate(reply.createdAt)}
                                    </span>
                                  </Tooltip>
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 mt-2">
                                  {reply.content}
                                </p>
                                <div className="flex items-center gap-4 mt-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsReplying({ type: 'reply', id: reply.id })}
                                    className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                  >
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    Responder
                                  </Button>

                                  {isCreator(replyUser.id) && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        SweetAlertEliminar(
                                          '¿Deseas eliminar esta respuesta?',
                                          () => handleDeleteReply(reply.id, comment.id)
                                        );
                                      }}
                                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                                    >
                                      🗑️ Eliminar
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Formulario de respuesta a una respuesta */}
                            {isReplying?.type === 'reply' && isReplying.id === reply.id && (
                              <div className="mt-4 ml-12">
                                <div className="flex gap-3">
                                  <div className="flex-1">
                                    <Textarea
                                      ref={commentInputRef}
                                      value={replyContent}
                                      onChange={(e) => setReplyContent(e.target.value)}
                                      placeholder="Escribe una respuesta..."
                                      className="w-full resize-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                      rows={2}
                                    />
                                    <div className="flex justify-end mt-2 gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsReplying(null)}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => onSubmitReply(reply.id, true, comment.id)}
                                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                                      >
                                        <Send className="w-3 h-3 mr-1" />
                                        Enviar
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
        <form onSubmit={onSubmitComment} className="w-full">
          <div className="flex gap-3">
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                className="w-full resize-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
              />
              <div className="flex justify-between mt-3">
                <div className="invisible">
                  {/* Este div mantiene el espacio pero es invisible */}
                </div>
                <Button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
};

export default CommentSection;