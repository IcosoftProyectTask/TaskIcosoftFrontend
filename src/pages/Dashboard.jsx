import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { NewTaskModal } from './NewTaskModal';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Search,
  Filter,
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

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [statusTasks, setStatusTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'media',
    status: 'pendiente',
    assignedTo: '',
    category: 'software',
    deadline: ''
  });
  const [editTask, setEditTask] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [refreshKey, setRefreshKey] = useState(0);

  // Conexión a SignalR
  const [connection, setConnection] = useState(null);

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
            console.log('Nueva tarea creada:', task);
            // Agregar la nueva tarea a la lista sin recargar todo
            setTasks(prevTasks => [...prevTasks, task]);
            toast.info(`Nueva tarea creada: ${task.title}`);
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
      setTasks(tasksData);
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

        setTasks(tasksData);
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

      // Ya no necesitamos actualizar el estado aquí, lo haremos cuando recibamos
      // la notificación desde SignalR, para asegurar que todos los clientes
      // tienen la misma información

      toast.success('Tarea creada exitosamente.');
      setIsNewTaskModalOpen(false);
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      toast.error('Error al crear la tarea.');
    }
  };

  // Colores para prioridades y estados
  const getPriorityColor = (priority) => {
    const colors = {
      alta: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
      media: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
      baja: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
    };
    return colors[priority.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  };

  const getStatusColor = (status) => {
    const colors = {
      pendiente: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      en_progreso: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      completado: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
    };
    return colors[status.toLowerCase().replace(' ', '_')] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  };

  const getIdColor = (idSupportTask) => {
    return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
  };


  // Función de adición de tarea (ya no la necesitamos porque usamos el modal)
  const handleAddTask = async () => {
    if (newTask.title && newTask.description) {
      if (newTask.deadline && new Date(newTask.deadline) < new Date()) {
        toast.error('La fecha límite no puede ser anterior a la fecha actual.');
        return;
      }

      try {
        await createSupportTask(newTask);
        setNewTask({
          title: '',
          description: '',
          priority: 'media',
          status: 'pendiente',
          assignedTo: '',
          category: 'software',
          deadline: ''
        });
        // No actualizamos las tareas porque SignalR lo hará
      } catch (error) {
        console.error('Error al crear la tarea:', error);
        toast.error('Error al crear la tarea.');
      }
    } else {
      toast.error('Por favor, complete todos los campos requeridos.');
    }
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

  // Actualizar una tarea
  const handleUpdateTask = async () => {
    if (editTask.title && editTask.description) {
      if (editTask.deadline && new Date(editTask.deadline) < new Date()) {
        toast.error('La fecha límite no puede ser anterior a la fecha actual.');
        return;
      }

      try {
        await updateSupportTask(editTask.idSupportTask, editTask);
        // No necesitamos actualizar el estado, SignalR lo hará
        setEditTask(null);
        toast.success('Tarea actualizada exitosamente.');
      } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        toast.error('Error al actualizar la tarea.');
      }
    } else {
      toast.error('Por favor, complete todos los campos requeridos.');
    }
  };

  // Eliminar una tarea
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteSupportTask(taskId);
      // No necesitamos actualizar el estado, SignalR lo hará
      toast.success('Tarea eliminada exitosamente.');
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      toast.error('Error al eliminar la tarea.');
    }
  };

  const handleStatusChange = async (taskId, newStatusId) => {
    try {
      const statusIdInt = parseInt(newStatusId);
      await updateSupportTaskStatus(taskId, {
        idStatus: statusIdInt
      });

      // No necesitamos actualizar el estado, SignalR lo hará
      toast.success('Estado de la tarea actualizado.');
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      toast.error('Error al actualizar el estado de la tarea.');
    }
  };

  // Filtrar y ordenar tareas
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'todos' ||
      (task.priority && task.priority.name.toLowerCase() === filterPriority);
    const matchesStatus = filterStatus === 'todos' ||
      (task.statusTask && task.statusTask.name.toLowerCase().replace(' ', '_') === filterStatus);
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortBy === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'priority') {
      const priorityOrder = { alta: 3, media: 2, baja: 1 };
      return priorityOrder[b.priority.name.toLowerCase()] - priorityOrder[a.priority.name.toLowerCase()];
    } else if (sortBy === 'status') {
      const statusOrder = { pendiente: 3, en_progreso: 2, completado: 1 };
      return statusOrder[b.statusTask.name.toLowerCase().replace(' ', '_')] - statusOrder[a.statusTask.name.toLowerCase().replace(' ', '_')];
    }
    return 0;
  });

  // Formatear fechas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

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
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] dark:bg-gray-800 dark:text-white">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-white">
                  <SelectItem value="createdAt">Fecha de Creación</SelectItem>
                  <SelectItem value="priority">Prioridad</SelectItem>
                  <SelectItem value="status">Estado</SelectItem>
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
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold dark:text-white">{task.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(task.priority.name)}>
                      {task.priority.name.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(task.statusTask.name)}>
                      {task.statusTask.name.toUpperCase()}
                    </Badge>
                    <Badge className={getIdColor(task.idSupportTask)}>
                      {'#' + task.idSupportTask}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2">
                    <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        <span>{task.user.name} {task.user.firstSurname}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>Creado: {formatDate(task.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle size={16} />
                        <span>Vence: {formatDate(task.endTask)}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {/* Campo para reasignar tarea */}
                      <Select
                        value={task.user.idUser.toString()}
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
                      {/* Campo para cambiar estado - Ahora usando statusTasks del API */}
                      <Select
                        value={task.statusTask.idStatus.toString()}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que el clic en el botón propague el evento a la tarjeta
                          setEditTask(task);
                        }}
                        className="dark:bg-gray-800 dark:text-white"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 dark:bg-gray-800 dark:text-red-400"
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que el clic en el botón propague el evento a la tarjeta
                          handleDeleteTask(task.idSupportTask);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Diálogo de Edición */}
        {editTask && (
          <Dialog open={!!editTask} onOpenChange={() => setEditTask(null)}>
            <DialogContent className="sm:max-w-[425px] dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle className="dark:text-white">Editar Tarea</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Título de la tarea"
                  value={editTask.title}
                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                  className="dark:bg-gray-800 dark:text-white"
                />
                <Textarea
                  placeholder="Descripción"
                  value={editTask.description}
                  onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                  className="dark:bg-gray-800 dark:text-white"
                />
                <Select
                  value={editTask.priority.name}
                  onValueChange={(value) => setEditTask({ ...editTask, priority: { name: value } })}
                >
                  <SelectTrigger className="dark:bg-gray-800 dark:text-white">
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:text-white">
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={editTask.user.idUser.toString()}
                  onValueChange={(value) => setEditTask({
                    ...editTask,
                    user: { ...editTask.user, idUser: parseInt(value) }
                  })}
                >
                  <SelectTrigger className="dark:bg-gray-800 dark:text-white">
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
                {/* Agregamos la selección de estado a la ventana de edición también */}
                <Select
                  value={editTask.statusTask.idStatus.toString()}
                  onValueChange={(value) => {
                    const selectedStatus = statusTasks.find(status => status.idStatus === parseInt(value));
                    setEditTask({
                      ...editTask,
                      statusTask: {
                        idStatus: parseInt(value),
                        name: selectedStatus ? selectedStatus.name : editTask.statusTask.name
                      }
                    });
                  }}
                >
                  <SelectTrigger className="dark:bg-gray-800 dark:text-white">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:text-white">
                    {Array.isArray(statusTasks) && statusTasks.map((status) => (
                      <SelectItem key={status.idStatus} value={status.idStatus.toString()}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="datetime-local"
                  value={editTask.endTask}
                  onChange={(e) => setEditTask({ ...editTask, endTask: e.target.value })}
                  className="dark:bg-gray-800 dark:text-white"
                />
                <DialogFooter>
                  <Button onClick={handleUpdateTask} className="w-full">
                    Actualizar Tarea
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Toast Container para notificaciones */}

      </div>
    </>
  );
}

export default Dashboard;