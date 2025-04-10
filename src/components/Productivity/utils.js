// utils.js - Funciones de utilidad para el dashboard

// Calcular diferencia en horas entre dos fechas
export const getHoursDifference = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return ((end - start) / (1000 * 60 * 60)).toFixed(2);
  };
  
  // Normalizar datos de tareas para formato uniforme
  export const normalizeTaskData = (task) => ({
    IdSupportTask: task.idSupportTask,
    Title: task.title,
    Description: task.description,
    Category: task.category || 'Sin categoría',
    IdUser: task.idUser,
    IdCompany: task.idCompany,
    CompanyName: task.company?.companyComercialName || `Empresa #${task.idCompany}`,
    Solution: task.solution || '',
    IdPriority: task.idPriority,
    PriorityName: task.priority?.name || 'Sin prioridad',
    IdStatus: task.idStatus,
    Status: task.statusTask?.name || 'Sin estado',
    StartTask: task.startTask,
    EndTask: task.endTask,
    CreatedAt: task.createdAt,
    UpdatedAt: task.updatedAt,
    NameEmployeeCompany: 
      (task.user ? `${task.user.name} ${task.user.firstSurname}` : 'Sin asignar')
  });
  
  // Calcular métricas de productividad
  export const calculateMetrics = (tasks) => {
    const completedTasks = tasks.filter(t => t.Status === "Completado");
    const inProgressTasks = tasks.filter(t => t.Status === "En proceso");
    const pendingTasks = tasks.filter(t => t.Status === "Pendiente");
    
    // Tiempo promedio de resolución (solo tareas completadas)
    const avgResolutionTime = completedTasks.length > 0 
      ? completedTasks.reduce((sum, task) => {
          const hours = getHoursDifference(task.StartTask, task.EndTask);
          return sum + (hours ? parseFloat(hours) : 0);
        }, 0) / completedTasks.length
      : 0;
    
    // Tiempo promedio de respuesta inicial
    const avgResponseTime = tasks
      .filter(t => t.StartTask)
      .reduce((sum, task) => {
        const hours = getHoursDifference(task.CreatedAt, task.StartTask);
        return sum + (hours ? parseFloat(hours) : 0);
      }, 0) / (tasks.filter(t => t.StartTask).length || 1);
    
    // Distribución por categoría
    const categoryDistribution = {};
    tasks.forEach(task => {
      categoryDistribution[task.Category] = (categoryDistribution[task.Category] || 0) + 1;
    });
    
    // Distribución por prioridad
    const priorityDistribution = {
      'ALTA': tasks.filter(t => t.PriorityName === 'ALTA').length,
      'MEDIA': tasks.filter(t => t.PriorityName === 'MEDIA').length,
      'BAJA': tasks.filter(t => t.PriorityName === 'BAJA').length
    };
    
    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      inProgressTasks: inProgressTasks.length,
      pendingTasks: pendingTasks.length,
      avgResolutionTime,
      avgResponseTime,
      categoryDistribution,
      priorityDistribution
    };
  };
  
  // Obtener color de estado
  export const getStatusColor = (status) => {
    switch (status) {
      case 'Completado': return 'green';
      case 'En proceso': return 'blue';
      case 'Pendiente': return 'yellow';
      default: return 'gray';
    }
  };
  
  // Obtener color de prioridad
  export const getPriorityColor = (priority) => {
    switch (priority) {
      case 'ALTA': return 'red';
      case 'MEDIA': return 'yellow';
      case 'BAJA': return 'green';
      default: return 'gray';
    }
  };
  
  // Formatear fecha
  export const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };
  
  // Crear datos para gráficos
  export const createChartData = (distribution) => {
    return Object.keys(distribution || {}).map(key => ({
      name: key,
      value: distribution[key]
    }));
  };
  
  // Colores para gráficos
  export const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];