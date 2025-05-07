// src/context/TaskContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  getSupportTasks,
  createSupportTask,
  updateSupportTask,
  deleteSupportTask,
  updateSupportTaskStatus,
  updateSupportTaskAsigment,
} from '../service/SupportTask';
import { getStatusTasks } from '../service/Statustask';
import { getAll as getUsers } from '../service/UserAPI';

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

// Crear el contexto
const TaskContext = createContext();

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

// Hook personalizado para usar el contexto
export const useTaskContext = () => useContext(TaskContext);

// Proveedor del contexto
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [statusTasks, setStatusTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Filtros y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [sortBy, setSortBy] = useState('createdAt');
  
  // Modales
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Obtener datos
  const fetchData = useCallback(async () => {
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
  }, []);

  // Volver a cargar datos
  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  // Calcular estadísticas
  const getTaskStats = useCallback(() => {
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
  }, [tasks]);

  // Filtrar y ordenar tareas
  const getFilteredAndSortedTasks = useCallback(() => {
    // Primero filtramos las tareas
    const filtered = tasks.filter(task => {
      if (!task) return false;
    
      // Verificar si el término de búsqueda comienza con # para búsqueda exclusiva por ID
      if (searchTerm.startsWith('#')) {
        // Extraer el número después de #
        const idToSearch = searchTerm.substring(1);
        // Comparar solo con el ID de la tarea
        return String(task.idSupportTask || "").includes(idToSearch);
      }
    
      // Búsqueda normal en título, descripción e ID
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (task.title?.toLowerCase() || "").includes(searchTermLower) ||
        (task.description?.toLowerCase() || "").includes(searchTermLower) ||
        String(task.idSupportTask || "").includes(searchTermLower);
      
      // El resto de la lógica de filtrado se mantiene igual
      const matchesPriority = 
        filterPriority === 'todos' ||
        (task.priority?.name?.toLowerCase() || "") === filterPriority;
      
      const matchesStatus = 
        filterStatus === 'todos' ||
        (task.statusTask?.name?.toLowerCase().replace(' ', '_') || "") === filterStatus;
      
      return matchesSearch && matchesPriority && matchesStatus;
    });

    // Luego ordenamos las tareas filtradas
    return filtered.sort((a, b) => {
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
  }, [tasks, searchTerm, filterPriority, filterStatus, sortBy]);

  // Crear tarea
  const handleCreateTask = async (taskData) => {
    try {
      await createSupportTask(taskData);
      toast.success('Tarea creada exitosamente.');
      setIsNewTaskModalOpen(false);
      // No refrescamos porque SignalR lo hará
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      toast.error('Error al crear la tarea.');
    }
  };

  // Actualizar tarea
  const handleUpdateTask = async (taskData) => {
    if (!taskData.title || !taskData.description) {
      toast.error('Por favor, complete todos los campos requeridos.');
      return;
    }

    if (taskData.deadline && new Date(taskData.deadline) < new Date()) {
      toast.error('La fecha límite no puede ser anterior a la fecha actual.');
      return;
    }

    try {
      await updateSupportTask(taskData.idSupportTask, taskData);
      setEditTask(null);
      toast.success('Tarea actualizada exitosamente.');
      // No refrescamos porque SignalR lo hará
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      toast.error('Error al actualizar la tarea.');
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteSupportTask(taskId);
      toast.success('Tarea eliminada exitosamente.');
      // No refrescamos porque SignalR lo hará
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      toast.error('Error al eliminar la tarea.');
    }
  };

  // Cambiar estado de tarea con validación de secuencia
  const handleStatusChange = async (taskId, newStatusId) => {
    try {
      // Convertir a entero
      const statusIdInt = parseInt(newStatusId);
      
      // Encontrar la tarea actual
      const currentTask = tasks.find(task => task.idSupportTask === taskId);
      if (!currentTask) {
        toast.error('No se pudo encontrar la tarea.');
        return;
      }
      
      // Obtener el estado actual
      const currentStatusId = currentTask.statusTask?.idStatus || 1;
      
      // Validar la secuencia de estados
      if (statusIdInt === currentStatusId) {
        // No hay cambio, no hacer nada
        return;
      } else if (statusIdInt < currentStatusId) {
        // No permitir retroceder en el flujo
        toast.error('No se puede retroceder en el flujo de estados.');
        return;
      } else if (statusIdInt > currentStatusId + 1) {
        // No permitir saltar estados (debe seguir la secuencia)
        toast.error(`Para cambiar a "${statusNamesMap[statusIdInt]}", primero debe estar en "${statusNamesMap[currentStatusId + 1]}".`);
        return;
      }
      
      // Si todo está bien, actualizar el estado
      await updateSupportTaskStatus(taskId, {
        idStatus: statusIdInt
      });
      toast.success(`Estado de la tarea actualizado a "${statusNamesMap[statusIdInt]}".`);
      // No refrescamos porque SignalR lo hará
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      toast.error('Error al actualizar el estado de la tarea.');
    }
  };

  // Reasignar tarea
  const handleReassignTask = async (taskId, newUserId) => {
    try {
      await updateSupportTaskAsigment(taskId, {
        idUser: newUserId,
      });
      toast.success('Tarea reasignada exitosamente.');
      // No refrescamos porque SignalR lo hará
    } catch (error) {
      console.error('Error al reasignar la tarea:', error);
      toast.error('Error al reasignar la tarea.');
    }
  };

  // Funciones para ayudantes de UI
  const getStatusColor = (status) => {
    const colors = {
      pendiente: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      en_progreso: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      completado: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
    };
    return colors[status?.toLowerCase()?.replace(' ', '_')] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      alta: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
      media: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
      baja: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
    };
    return colors[priority?.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  };

  const getIdColor = () => {
    return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
  };

  // Formatear fechas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Obtener opciones de estado válidas para una tarea
  const getValidStatusOptions = (task) => {
    if (!task || !task.statusTask || !task.statusTask.idStatus) {
      return statusTasks; // Si no hay tarea o estado definido, mostrar todos
    }
    
    const currentStatusId = task.statusTask.idStatus;
    
    // Filtrar solo el estado actual y el siguiente permitido
    return statusTasks.filter(status => {
      const statusId = status.idStatus;
      return statusId === currentStatusId || statusId === currentStatusId + 1;
    });
  };

  // Valor del contexto
  const value = {
    // Estado
    tasks,
    users,
    statusTasks,
    loading,
    error,
    editTask,
    isNewTaskModalOpen,
    searchTerm,
    filterPriority,
    filterStatus,
    sortBy,
    
    // Setters
    setEditTask,
    setIsNewTaskModalOpen,
    setSearchTerm,
    setFilterPriority,
    setFilterStatus,
    setSortBy,
    
    // Acciones
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleStatusChange,
    handleReassignTask,
    
    // Ayudantes
    getFilteredAndSortedTasks,
    getTaskStats,
    getPriorityColor,
    getStatusColor,
    getIdColor,
    formatDate,
    refreshData,
    getValidStatusOptions
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export default TaskContext;