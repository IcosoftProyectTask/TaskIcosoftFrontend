import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/Button';
import { decodeToken } from "../utils/Utils";
import { Input } from '../components/ui/Input';
import Swal from 'sweetalert2';
import { getUserById } from "../service/UserAPI";
import { SweetAlertQuestion, SweetAlertEliminar } from "../assets/js/SweetAlert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Search,
  Plus,
  Edit2,
  Trash2,
  BarChart2,
  CircleSlash,
  CheckCircle2,
  Timer
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  createSupportTask,
  getSupportTasks,
  updateSupportTask,
  deleteSupportTask,
  updateSupportTaskStatus,
  updateSupportTaskAsigment,
} from '../service/SupportTask';
import { getStatusTasks } from '../service/Statustask';
import { getAll as getUsers } from '../service/UserAPI';
import { HubConnectionBuilder } from '@microsoft/signalr';
import LoadingState from '../components/common/LoadingState';
import { useNavigate } from 'react-router-dom';
import { NewTaskModal } from './NewTaskModal';
import { EditTaskModal } from './EditTaskModal'; // Importar el nuevo componente
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';

function Dashboard() {

  const [userRole, setUserRole] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [statusTasks, setStatusTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false); // Nuevo estado para controlar el modal de edición
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  // Mapeo de IDs a nombres para prioridades
  const priorityNamesMap = {
    1: "Alta",
    2: "Media",
    3: "Baja"
  };

  // Mapeo de IDs a nombres para estados
  const statusNamesMap = {
    1: "Pendiente",
    2: "En Progreso",
    3: "Completado"
  };

  // Estado para la tarea que se está editando
  const [editTask, setEditTask] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [refreshKey, setRefreshKey] = useState(0);

  // Función para asegurar que la tarea tenga la estructura correcta
  const ensureTaskStructure = (task) => {
    if (!task) return null;

    return {
      ...task,
      // Asegurar que priority exista
      priority: task.priority || {
        idPriority: task.idPriority || 1,
        name: task.idPriority ? priorityNamesMap[task.idPriority] || "Media" : "Media"
      },
      // Asegurar que statusTask exista
      statusTask: task.statusTask || {
        idStatus: task.idStatus || 1,
        name: task.idStatus ? statusNamesMap[task.idStatus] || "Pendiente" : "Pendiente"
      },
      // Asegurar que user exista
      user: task.user || {
        idUser: task.idUser || 1,
        name: "Usuario",
        firstSurname: ""
      }
    };
  };

  // Conexión a SignalR
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const user = decodeToken();
    if (user) {
      const fetchUserData = async () => {
        try {
          const userData = await getUserById(user);
          console.log(userData);
          setUserRole(userData.idRole);
        } catch (error) {
          console.error('Error al obtener la información del usuario:', error);
        }
      };
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    // Crear la conexión al Hub de SignalR
    const newConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5272/taskHub')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      // Iniciar la conexión
      connection.start()
        .then(() => {
          console.log('Conectado al Hub de SignalR');

          // Escuchar evento de creación de tareas
          connection.on('TaskCreated', (task) => {
            console.log('Nueva tarea creada (original):', task);

            // Transformar la tarea para asegurar que tenga la estructura correcta
            const transformedTask = ensureTaskStructure(task);
            console.log('Nueva tarea transformada:', transformedTask);

            // Agregar la tarea transformada al estado
            setTasks(prevTasks => [...prevTasks, transformedTask]);
          });

          // Escuchar eventos de actualización de tareas
          connection.on('TaskUpdated', (taskId) => {
            console.log(`Tarea ${taskId} fue actualizada`);
            // Actualizar la lista de tareas
            fetchTasks();
          });

          // Escuchar eventos de reasignación de tareas
          connection.on('TaskReassigned', (taskId) => {
            console.log(`Tarea ${taskId} fue reasignada`);
            // Actualizar la lista de tareas
            fetchTasks();
          });

          // Escuchar eventos de eliminación de tareas
          connection.on('TaskDeleted', (taskId) => {
            console.log(`Tarea ${taskId} fue eliminada`);
            // Eliminar la tarea de la lista sin recargar todo
            setTasks(prevTasks => prevTasks.filter(task => task.idSupportTask !== taskId));
          });

          // Escuchar eventos de cambio de estado de tareas
          connection.on('TaskStatusChanged', (taskId, newStatus) => {
            console.log(`Estado de la tarea ${taskId} cambió a ${newStatus.name}`);
            // Actualizar el estado de la tarea específica en la lista
            setTasks(prevTasks => prevTasks.map(task => {
              if (task.idSupportTask === taskId) {
                return { ...task, statusTask: newStatus };
              }
              return task;
            }));
          });
        })
        .catch(err => {
          console.error('Error al conectar al Hub:', err);
        });

      // Limpiar la conexión al desmontar el componente
      return () => {
        connection.stop();
      };
    }
  }, [connection]);

  // Función para obtener las tareas desde la API
  const fetchTasks = async () => {
    try {
      const tasksData = await getSupportTasks();
      // Aplicar ensureTaskStructure a cada tarea
      const safeTasksData = tasksData.map(task => ensureTaskStructure(task));
      setTasks(safeTasksData);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tasksData = await getSupportTasks();
        const usersData = await getUsers();
        const statusData = await getStatusTasks();

        // Aplicar ensureTaskStructure a cada tarea
        const safeTasksData = tasksData.map(task => ensureTaskStructure(task));
        setTasks(safeTasksData);

        setUsers(usersData.data);
        setStatusTasks(statusData.data);
        setError(null);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setError('No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  const getTaskStats = () => {
    if (!Array.isArray(tasks)) {
      console.error('Tasks is not an array:', tasks);
      return {
        total: 0,
        pendientes: 0,
        enProgreso: 0,
        completadas: 0
      };
    }

    return {
      total: tasks.length,
      pendientes: tasks.filter(t => t.statusTask && t.statusTask.name === 'Pendiente').length,
      enProgreso: tasks.filter(t => t.statusTask && t.statusTask.name === 'En Progreso').length,
      completadas: tasks.filter(t => t.statusTask && t.statusTask.name === 'Completado').length
    };
  };

  const stats = getTaskStats();

  // Crear una nueva tarea
  const handleCreateTask = async (task) => {
    try {
      const createdTask = await createSupportTask(task);
      toast.success('Tarea creada exitosamente.');
      setIsNewTaskModalOpen(false);
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      toast.error('Error al crear la tarea.');
    }
  };

  // Actualizar una tarea (con el nuevo componente)
  const handleTaskUpdated = () => {
    // No necesitamos hacer nada aquí porque SignalR actualizará la lista
    // toast.success('Tarea actualizada exitosamente.');
    setIsEditTaskModalOpen(false);
    setEditTask(null);
  };

  // Colores para prioridades y estados
  const getPriorityColor = (priority) => {
    const colors = {
      alta: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
      media: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
      baja: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
    };
    return colors[priority?.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  };

  const getStatusColor = (status) => {
    const colors = {
      pendiente: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      en_progreso: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      completado: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
    };
    return colors[status?.toLowerCase()?.replace(' ', '_')] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  };

  const getIdColor = (idSupportTask) => {
    return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
  };

  // Reasignar una tarea
  const handleReassignTask = async (taskId, newUserId) => {
    try {
      await updateSupportTaskAsigment(taskId, {
        idUser: newUserId,
      });

      // No es necesario actualizar manualmente, SignalR enviará una notificación
      toast.success('Tarea reasignada exitosamente.');
    } catch (error) {
      console.error('Error al reasignar la tarea:', error);
      toast.error('Error al reasignar la tarea.');
    }
  };

  // Eliminar una tarea
  const handleDeleteTask = (taskId) => {
    SweetAlertEliminar(
      '¿Estás seguro de eliminar esta tarea? Esta acción no se puede deshacer.',
      async () => {
        try {
          await deleteSupportTask(taskId);
          SweetAlertSuccess('Tarea eliminada exitosamente.');
        } catch (error) {
          console.error('Error al eliminar la tarea:', error);
          SweetAlertError('Error al eliminar la tarea.');
        }
      }
    );
  };

  // Cambiar estado de tarea con validación de secuencia y confirmación
  const handleStatusChange = async (taskId, newStatusId) => {
    try {
      // Encontrar la tarea actual
      const task = tasks.find(t => t.idSupportTask === taskId);
      if (!task) {
        await Swal.fire('Error', 'Tarea no encontrada', 'error');
        return;
      }

      // Obtener el estado actual
      const currentStatusId = task.statusTask?.idStatus || 1;
      const newStatusIdInt = parseInt(newStatusId);

      // Validar el flujo de estados
      if (newStatusIdInt === 2 && currentStatusId !== 1) {
        await Swal.fire('Error', 'Solo puedes cambiar a "En Progreso" desde "Pendiente"', 'error');
        return;
      }

      if (newStatusIdInt === 3 && currentStatusId !== 2) {
        await Swal.fire('Error', 'Solo puedes cambiar a "Completado" desde "En Progreso"', 'error');
        return;
      }

      if (newStatusIdInt < currentStatusId) {
        await Swal.fire('Error', 'No puedes retroceder el estado de la tarea', 'error');
        return;
      }

      // Si la validación pasa, pedir confirmación antes de actualizar
      const confirmResult = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas cambiar el estado de la tarea a "${statusNamesMap[newStatusIdInt]}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
      });

      // Si el usuario confirma, entonces actualizar
      if (confirmResult.isConfirmed) {
        await updateSupportTaskStatus(taskId, {
          idStatus: newStatusIdInt
        });
        await Swal.fire('Éxito', 'Estado de la tarea actualizado', 'success');
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      await Swal.fire('Error', 'Error al actualizar el estado de la tarea', 'error');
    }
  };

  // Filtrar y ordenar tareas con manejo seguro de propiedades
  const filteredTasks = tasks.filter(task => {
    if (!task) return false;

    // Filtro por estado (mostrar solo Pendiente/En Progreso a menos que se seleccione Completado)
    const currentStatus = task.statusTask?.name?.toLowerCase().replace(' ', '_') || '';
    if (filterStatus !== 'completado' && currentStatus === 'completado') {
      return false;
    }

    // Verificar si el término de búsqueda comienza con # para búsqueda exclusiva por ID
    if (searchTerm.startsWith('#')) {
      const idToSearch = searchTerm.substring(1);
      return String(task.idSupportTask || "").includes(idToSearch);
    }

    // Búsqueda normal en título, descripción e ID
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      (task.title?.toLowerCase() || "").includes(searchTermLower) ||
      (task.description?.toLowerCase() || "").includes(searchTermLower) ||
      String(task.idSupportTask || "").includes(searchTermLower);

    const matchesPriority =
      filterPriority === 'todos' ||
      (task.priority?.name?.toLowerCase() || "") === filterPriority;

    const matchesStatus =
      filterStatus === 'todos' ||
      currentStatus === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (!a || !b) return 0;

    if (sortBy === 'createdAt') {
      return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
    } else if (sortBy === 'priority') {
      const priorityOrder = { alta: 3, media: 2, baja: 1 };
      const aPriorityName = (a.priority?.name || "media").toLowerCase();
      const bPriorityName = (b.priority?.name || "media").toLowerCase();
      return priorityOrder[bPriorityName] - priorityOrder[aPriorityName];
    } else if (sortBy === 'status') {
      const statusOrder = { pendiente: 3, en_progreso: 2, completado: 1 };
      const aStatusName = (a.statusTask?.name || "pendiente").toLowerCase().replace(' ', '_');
      const bStatusName = (b.statusTask?.name || "pendiente").toLowerCase().replace(' ', '_');
      return statusOrder[bStatusName] - statusOrder[aStatusName];
    }
    return 0;
  });

  // Formatear fechas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const isValidDate = (date) => {
    const parsed = new Date(date);
    return parsed instanceof Date && !isNaN(parsed.getTime());
  };


  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl dark:text-blue-400 text-gray-500 font-bold">
            Dashboard
          </h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsNewTaskModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <NewTaskModal
            isOpen={isNewTaskModalOpen}
            onClose={() => setIsNewTaskModalOpen(false)}
            onCreateTask={handleCreateTask}
          />
        </Dialog>

        {/* Modal de edición de tarea (separado del Dialog) */}
        <EditTaskModal
          isOpen={isEditTaskModalOpen}
          onClose={() => {
            setIsEditTaskModalOpen(false);
            setEditTask(null);
          }}
          task={editTask}
          onTaskUpdated={handleTaskUpdated}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Estadísticas */}
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <Card className="dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Total Tareas</CardTitle>
              <BarChart2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{stats.total}</div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <Card className="dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Pendientes</CardTitle>
              <CircleSlash className="h-4 w-4 text-red-600 dark:text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{stats.pendientes}</div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <Card className="dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">En Progreso</CardTitle>
              <Timer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{stats.enProgreso}</div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <Card className="dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Completadas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{stats.completadas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="col-span-12">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 dark:bg-gray-800 dark:text-white"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[150px] dark:bg-gray-800 dark:text-white">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-white">
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px] dark:bg-gray-800 dark:text-white">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-white">
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_progreso">En Progreso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Lista de Tareas */}
        <div className="col-span-12">
          <div className="grid grid-cols-1 gap-4">
            {sortedTasks.map((task) => (
              <Card
                key={`${task.idSupportTask}-${task.updatedAt || task.createdAt}`}
                className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900 cursor-pointer"
                onClick={() => handleTaskClick(task.idSupportTask)}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg sm:text-xl font-bold dark:text-white truncate pr-2">
                    {task.title}
                  </CardTitle>
                  <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                    <Badge
                      className={`${getPriorityColor(task.priority?.name)} text-xs sm:text-sm px-2 py-0.5 truncate max-w-[4rem] sm:max-w-none`}
                    >
                      {(task.priority?.name || "Media").toUpperCase()}
                    </Badge>
                    <Badge
                      className={`${getStatusColor(task.statusTask?.name)} text-xs sm:text-sm px-2 py-0.5 truncate max-w-[4.5rem] sm:max-w-none`}
                    >
                      {(task.statusTask?.name || "Pendiente").toUpperCase()}
                    </Badge>
                    <Badge
                      className={`${getIdColor(task.idSupportTask)} text-xs sm:text-sm px-2 py-0.5 min-w-[2.8rem]`}
                    >
                      #{task.idSupportTask}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2">
                    <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        <span>{task.user?.name || "Usuario"} {task.user?.firstSurname || ""}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>Creado: {formatDate(task.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle size={16} />
                        <span>Vence: {isValidDate(task.endTask) ? formatDate(task.endTask) : 'Sin definir'}</span>
                      </div>

                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {/* Campo para reasignar tarea */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={task.user?.idUser?.toString() || ""}
                          onValueChange={(value) => handleReassignTask(task.idSupportTask, parseInt(value))}
                        >
                          <SelectTrigger className="w-[200px] dark:bg-gray-800 dark:text-white">
                            <SelectValue placeholder="Asignar a..." />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:text-white">
                            {Array.isArray(users) && users.map((user) => (
                              <SelectItem key={user.idUser} value={user.idUser.toString()}>
                                {user.name} {user.firstSurname}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Campo para cambiar estado - Ahora usando statusTasks del API */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={task.statusTask?.idStatus?.toString() || ""}
                          onValueChange={(value) => handleStatusChange(task.idSupportTask, value)}
                        >
                          <SelectTrigger className="w-[200px] dark:bg-gray-800 dark:text-white">
                            <SelectValue placeholder="Cambiar estado" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:text-white">
                            {Array.isArray(statusTasks) && statusTasks.map((status) => (
                              <SelectItem key={status.idStatus} value={status.idStatus.toString()}>
                                {status.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que el clic en el botón propague el evento a la tarjeta
                          setEditTask(task);
                          setIsEditTaskModalOpen(true);
                        }}
                        className="dark:bg-gray-800 dark:text-white"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      {userRole == 2 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 dark:bg-gray-800 dark:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.idSupportTask);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* El modal de edición ahora está separado como un componente independiente */}

        {/* Toast Container para notificaciones */}

      </div>
    </>
  );
}

export default Dashboard;