// Archivo principal del dashboard
import React, { useState, useEffect, useMemo } from 'react';
import { Loader, AlertTriangle, Filter } from 'lucide-react';
import { getSupportTasks } from '../../service/SupportTask';
import { getStatusTasks } from '../../service/Statustask';
import { getAll as getUsers } from '../../service/UserAPI';

// Componentes
import MetricCard from '../../components/Productivity/MetricCard';
import CategoryChart from '../../components/Productivity/CategoryChart';
import PriorityChart from '../../components/Productivity/PriorityChart';
import TasksTable from '../../components/Productivity/TasksTable';
import TaskDetailModal from '../../components/Productivity/TaskDetailModal';
import LoadingState from '../../components/Productivity/LoadingState';
import ErrorState from '../../components/Productivity/ErrorState';

// Utilidades
import {
  getHoursDifference,
  normalizeTaskData,
  calculateMetrics,
  formatTimeForDisplay
} from '../../components/Productivity/utils';

const ProductivityDashboard = () => {
  // Estados
  const [filters, setFilters] = useState({
    employee: '',
    category: ''
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [supportTasks, setSupportTasks] = useState([]);
  const [statusTasks, setStatusTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Recuperar datos simultáneamente para mejor rendimiento
        const [tasksData, statusData, usersData] = await Promise.all([
          getSupportTasks(),
          getStatusTasks(),
          getUsers()
        ]);

        const statusList = Array.isArray(statusData.data) ? statusData.data : [];
        const usersList = usersData?.data || [];

        // Normalizar datos
        const normalizedTasks = Array.isArray(tasksData)
          ? tasksData.map(task => normalizeTaskData(task))
          : [];

        setSupportTasks(normalizedTasks);
        setStatusTasks(statusList);
        setUsers(usersList);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Actualizar filtros
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filtrar datos según selecciones
  const filteredData = useMemo(() => {
    return supportTasks.filter(task => {
      const matchesEmployee = !filters.employee || task.NameEmployeeCompany.includes(filters.employee);
      const matchesCategory = !filters.category || task.Category === filters.category;
      return matchesEmployee && matchesCategory;
    });
  }, [supportTasks, filters.employee, filters.category]);

  // Calcular métricas
  const metrics = useMemo(() => calculateMetrics(filteredData), [filteredData]);

  // Mostrar detalle de tarea
  const handleTaskDetail = (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  // Extraer listas de filtros
  const categories = useMemo(() => [...new Set(supportTasks.map(task => task.Category))], [supportTasks]);
  const employees = useMemo(() => [...new Set(supportTasks.map(task => task.NameEmployeeCompany))], [supportTasks]);

  // Renderizar estados de carga y error
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Dashboard de Métricas de Productividad</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Análisis de desempeño en resolución de tareas de soporte</p>
        </header>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
              <Filter className="mr-2 text-gray-500 dark:text-gray-400" size={18} />
              <span className="font-medium text-gray-800 dark:text-white">Filtros:</span>
            </div>

            <div className="flex-1 w-full">
              <select
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
                value={filters.employee}
                onChange={(e) => handleFilterChange('employee', e.target.value)}
              >
                <option value="">Todos los empleados</option>
                {employees.filter(Boolean).map((emp, index) => (
                  <option key={index} value={emp}>{emp}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 w-full">
              <select
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.filter(Boolean).map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <MetricCard 
            title="Tareas completadas"
            value={metrics.completedTasks}
            total={metrics.totalTasks}
            icon="CheckSquare"
            color="green"
            showProgress
          />
          
          <MetricCard 
            title="Tiempo prom. de resolución"
            value={metrics.formattedAvgResolutionTime || '0 min'}
            subtitle="Solo tareas completadas"
            icon="Clock"
            color="blue"
          />
          
          <MetricCard 
            title="Tiempo respuesta inicial"
            value={metrics.formattedAvgResponseTime || '0 min'}
            subtitle="De creación a inicio"
            icon="Activity"
            color="indigo"
          />
          
          <MetricCard 
            title="Tareas pendientes"
            value={metrics.pendingTasks + metrics.inProgressTasks}
            badges={[
              { text: `${metrics.pendingTasks} pendientes`, color: 'yellow' },
              { text: `${metrics.inProgressTasks} en proceso`, color: 'blue' }
            ]}
            icon="AlertTriangle"
            color="yellow"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <CategoryChart data={metrics.categoryDistribution} />
          <PriorityChart data={filteredData} />
        </div>

        {/* Tabla de tareas */}
        <TasksTable
          tasks={filteredData}
          onViewDetails={handleTaskDetail}
        />

        {/* Modal de detalles */}
        {showDetailModal && selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            onClose={() => setShowDetailModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductivityDashboard;