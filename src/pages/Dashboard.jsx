import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
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

function Dashboard() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Error en impresora HP",
      description: "Usuario reporta que la impresora no responde",
      priority: "alta",
      status: "pendiente",
      assignedTo: "Carlos Técnico",
      createdAt: "2024-02-22 10:30",
      deadline: "2024-02-23 10:30",
      category: "hardware"
    },
    {
      id: 2,
      title: "Configuración de correo",
      description: "Nuevo empleado necesita configuración de correo corporativo",
      priority: "media",
      status: "en_progreso",
      assignedTo: "Ana Soporte",
      createdAt: "2024-02-22 09:15",
      deadline: "2024-02-22 17:00",
      category: "software"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
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

  const getTaskStats = () => {
    return {
      total: tasks.length,
      pendientes: tasks.filter(t => t.status === 'pendiente').length,
      enProgreso: tasks.filter(t => t.status === 'en_progreso').length,
      completadas: tasks.filter(t => t.status === 'completado').length
    };
  };

  const stats = getTaskStats();

  const getPriorityColor = (priority) => {
    const colors = {
      alta: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
      media: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
      baja: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
    };
    return colors[priority] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  };

  const getStatusColor = (status) => {
    const colors = {
      pendiente: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      en_progreso: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      completado: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
    };
    return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.description) {
      if (newTask.deadline && new Date(newTask.deadline) < new Date()) {
        toast.error('La fecha límite no puede ser anterior a la fecha actual.');
        return;
      }
      const task = {
        ...newTask,
        id: tasks.length + 1,
        createdAt: new Date().toLocaleString()
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        description: '',
        priority: 'media',
        status: 'pendiente',
        assignedTo: '',
        category: 'software',
        deadline: ''
      });
      toast.success('Tarea creada exitosamente.');
    } else {
      toast.error('Por favor, complete todos los campos requeridos.');
    }
  };

  const handleEditTask = (task) => {
    setEditTask(task);
  };

  const handleUpdateTask = () => {
    if (editTask.title && editTask.description) {
      if (editTask.deadline && new Date(editTask.deadline) < new Date()) {
        toast.error('La fecha límite no puede ser anterior a la fecha actual.');
        return;
      }
      setTasks(tasks.map(t => t.id === editTask.id ? editTask : t));
      setEditTask(null);
      toast.success('Tarea actualizada exitosamente.');
    } else {
      toast.error('Por favor, complete todos los campos requeridos.');
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success('Tarea eliminada exitosamente.');
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    toast.success('Estado de la tarea actualizado.');
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'todos' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'todos' || task.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortBy === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'priority') {
      const priorityOrder = { alta: 3, media: 2, baja: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    } else if (sortBy === 'status') {
      const statusOrder = { pendiente: 3, en_progreso: 2, completado: 1 };
      return statusOrder[b.status] - statusOrder[a.status];
    }
    return 0;
  });

  return (
    <>
      <ToastContainer />
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl dark:text-blue-400 text-gray-500 font-bold">
            Dashboard
          </h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Crear Nueva Tarea</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Título de la tarea"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="dark:bg-gray-800 dark:text-white"
              />
              <Textarea
                placeholder="Descripción"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="dark:bg-gray-800 dark:text-white"
              />
              <Select
                value={newTask.priority}
                onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
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
              <Input
                placeholder="Asignar a"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="dark:bg-gray-800 dark:text-white"
              />
              <Input
                type="datetime-local"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                className="dark:bg-gray-800 dark:text-white"
              />
              <DialogFooter>
                <Button onClick={handleAddTask} className="w-full">
                  Crear Tarea
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
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
              <Card key={task.id} className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold dark:text-white">{task.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2">
                    <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        <span>{task.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>Creado: {task.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle size={16} />
                        <span>Vence: {task.deadline}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {/* Campo para reasignar tarea */}
                      <Select
                        value={task.assignedTo}
                        onValueChange={(value) => {
                          setTasks(tasks.map(t =>
                            t.id === task.id ? { ...t, assignedTo: value } : t
                          ));
                        }}
                      >
                        <SelectTrigger className="w-[200px] dark:bg-gray-800 dark:text-white">
                          <SelectValue placeholder="Asignar a..." />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:text-white">
                          <SelectItem value="Carlos Técnico">Carlos Técnico</SelectItem>
                          <SelectItem value="Ana Soporte">Ana Soporte</SelectItem>
                          <SelectItem value="Juan Administrador">Juan Administrador</SelectItem>
                          {/* Añadir más opciones según los trabajadores disponibles */}
                        </SelectContent>
                      </Select>
                      <Select
                        value={task.status}
                        onValueChange={(value) => handleStatusChange(task.id, value)}
                      >
                        <SelectTrigger className="w-[200px] dark:bg-gray-800 dark:text-white">
                          <SelectValue placeholder="Cambiar estado" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:text-white">
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="en_progreso">En Progreso</SelectItem>
                          <SelectItem value="completado">Completado</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTask(task)}
                        className="dark:bg-gray-800 dark:text-white"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 dark:bg-gray-800 dark:text-red-400"
                        onClick={() => handleDeleteTask(task.id)}
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
                  value={editTask.priority}
                  onValueChange={(value) => setEditTask({ ...editTask, priority: value })}
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
                <Input
                  placeholder="Asignar a"
                  value={editTask.assignedTo}
                  onChange={(e) => setEditTask({ ...editTask, assignedTo: e.target.value })}
                  className="dark:bg-gray-800 dark:text-white"
                />
                <Input
                  type="datetime-local"
                  value={editTask.deadline}
                  onChange={(e) => setEditTask({ ...editTask, deadline: e.target.value })}
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
      </div>
    </>
  );
}

export default Dashboard;