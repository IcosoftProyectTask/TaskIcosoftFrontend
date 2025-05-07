// utils.js - Funciones de utilidad para el dashboard

// Calcular diferencia en horas entre dos fechas
export const getHoursDifference = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (end - start) / (1000 * 60 * 60); // Retorna un número, no un string
};

  export const getTimeDisplay = (startDate, endDate) => {
    if (!startDate || !endDate) return "-";
    
    // Convertir a objetos Date si son strings
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    // Calcular la diferencia en segundos
    const diffInSeconds = Math.abs((end - start) / 1000);
    
    // Diferentes formatos según la duración
    if (diffInSeconds < 60) {
      // Menos de un minuto: mostrar en segundos
      return `${Math.round(diffInSeconds)} segundos`;
    } else if (diffInSeconds < 3600) {
      // Menos de una hora: mostrar en minutos y segundos
      const minutes = Math.floor(diffInSeconds / 60);
      const seconds = Math.round(diffInSeconds % 60);
      return `${minutes} min ${seconds} seg`;
    } else {
      // Más de una hora: mostrar en horas y minutos
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.round((diffInSeconds % 3600) / 60);
      return `${hours} h ${minutes} min`;
    }
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
  
  export const calculateMetrics = (tasks) => {
    // Contar tareas por estado
    const completedTasks = tasks.filter(task => task.Status === 'Completado').length;
    const pendingTasks = tasks.filter(task => task.Status === 'Pendiente').length;
    const inProgressTasks = tasks.filter(task => task.Status === 'En proceso').length;
    
    // Calcular tiempos promedios
    let totalResponseTime = 0;
    let totalResolutionTime = 0;
    let responseCount = 0;
    let resolutionCount = 0;
    
    tasks.forEach(task => {
      // Tiempo de respuesta inicial: desde creación hasta inicio de atención
      if (task.CreatedAt && task.StartTask) {
        const responseTime = getHoursDifference(task.CreatedAt, task.StartTask);
        if (responseTime !== null) {
          totalResponseTime += responseTime;
          responseCount++;
        }
      }
      
      // Tiempo de resolución: desde inicio hasta finalización (solo para tareas completadas)
      if (task.Status === 'Completado' && task.StartTask && task.EndTask) {
        const resolutionTime = getHoursDifference(task.StartTask, task.EndTask);
        if (resolutionTime !== null) {
          totalResolutionTime += resolutionTime;
          resolutionCount++;
        }
      }
    });
    
    // Calcular promedios
    const avgResponseTime = responseCount > 0 ? totalResponseTime / responseCount : 0;
    const avgResolutionTime = resolutionCount > 0 ? totalResolutionTime / resolutionCount : 0;
    
    // Convertir a formatos más amigables para mostrar
    const formattedAvgResponseTime = formatTimeForDisplay(avgResponseTime);
    const formattedAvgResolutionTime = formatTimeForDisplay(avgResolutionTime);
    
    // Calcular distribución por categoría
    const categoryDistribution = tasks.reduce((acc, task) => {
      const category = task.Category || 'Sin categoría';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      avgResponseTime,
      avgResolutionTime,
      formattedAvgResponseTime,
      formattedAvgResolutionTime,
      categoryDistribution
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

  export const formatTimeForDisplay = (hours) => {
    if (hours === 0) return '0 min';
    
    // Convertir horas a segundos para usar la misma lógica de formateo
    const totalSeconds = hours * 3600;
    
    if (totalSeconds < 60) {
      return `${Math.round(totalSeconds)} seg`;
    } else if (totalSeconds < 3600) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.round(totalSeconds % 60);
      return seconds > 0 ? `${minutes} min ${seconds} seg` : `${minutes} min`;
    } else {
      const hrs = Math.floor(hours);
      const minutes = Math.round((hours - hrs) * 60);
      return minutes > 0 ? `${hrs} h ${minutes} min` : `${hrs} h`;
    }
  };
  
  // Colores para gráficos
  export const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];