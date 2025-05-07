// components/TasksTable.jsx
import React, { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Calendar } from 'lucide-react';
import { getHoursDifference, getStatusColor, getPriorityColor, formatTimeForDisplay } from '../../components/Productivity/utils';
import { format, parseISO } from 'date-fns';

const TasksTable = ({ tasks, onViewDetails }) => {
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyDateFilter = () => {
    setShowDatePicker(false);
  };

  const resetDateFilter = () => {
    setDateFilter({
      startDate: '',
      endDate: ''
    });
    setShowDatePicker(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (!dateFilter.startDate && !dateFilter.endDate) return true;
    
    const taskDate = task.StartTask ? new Date(task.StartTask) : null;
    if (!taskDate) return false;
  
    const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
    const endDate = dateFilter.endDate ? new Date(dateFilter.endDate + 'T23:59:59') : null; // Añadimos hora final del día
  
    if (startDate && endDate) {
      return taskDate >= startDate && taskDate <= endDate;
    } else if (startDate) {
      return taskDate >= startDate;
    } else if (endDate) {
      return taskDate <= endDate;
    }
    return true;
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-800 dark:text-white">Listado de tareas</h3>
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
          >
            <Calendar className="mr-1" size={16} />
            Filtrar por fecha
          </button>
        </div>
        
        {showDatePicker && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha inicial</label>
                <input
                  type="date"
                  name="startDate"
                  value={dateFilter.startDate}
                  onChange={handleDateChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha final</label>
                <input
                  type="date"
                  name="endDate"
                  value={dateFilter.endDate}
                  onChange={handleDateChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white text-sm"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={applyDateFilter}
                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Aplicar filtro
              </button>
              <button
                onClick={resetDateFilter}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Limpiar filtro
              </button>
            </div>
          </div>
        )}
        
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No se encontraron tareas con los filtros aplicados.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow overflow-hidden">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">Listado de tareas</h3>
        <button 
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="flex items-center text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
        >
          <Calendar className="mr-1" size={16} />
          Filtrar por fecha
        </button>
      </div>
      
      {showDatePicker && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha inicial</label>
              <input
                type="date"
                name="startDate"
                value={dateFilter.startDate}
                onChange={handleDateChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha final</label>
              <input
                type="date"
                name="endDate"
                value={dateFilter.endDate}
                onChange={handleDateChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white text-sm"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={applyDateFilter}
              className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Aplicar filtro
            </button>
            <button
              onClick={resetDateFilter}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Limpiar filtro
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Título</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Categoría</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prioridad</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Asignado a</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duración</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTasks.map((task) => {
              const resolutionTime = getHoursDifference(task.StartTask, task.EndTask);
              const formattedTime = resolutionTime ? formatTimeForDisplay(resolutionTime) : '-';
              
              return (
                <tr key={task.IdSupportTask} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-3 text-gray-800 dark:text-gray-200 text-sm">{task.IdSupportTask}</td>
                  <td className="py-3 px-3 text-gray-800 dark:text-gray-200 text-sm">{task.Title}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {task.Category}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <PriorityBadge priority={task.PriorityName} />
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={task.Status} />
                  </td>
                  <td className="py-3 px-3 text-gray-800 dark:text-gray-200 text-sm">{task.NameEmployeeCompany}</td>
                  <td className="py-3 px-3">
                    {resolutionTime ? 
                      <span className="flex items-center text-gray-800 dark:text-gray-200 text-sm">
                        {parseFloat(resolutionTime) < 2 
                          ? <ArrowDownRight className="text-green-500 mr-1" size={14} /> 
                          : <ArrowUpRight className="text-red-500 mr-1" size={14} />
                        }
                        {formattedTime}
                      </span> : 
                      <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                    }
                  </td>
                  <td className="py-3 px-3">
                    <button 
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium"
                      onClick={() => onViewDetails(task)}
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// Componentes auxiliares para la tabla
const PriorityBadge = ({ priority }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let darkBgColor = "dark:bg-gray-700";
  let darkTextColor = "dark:text-gray-200";

  if (priority === 'ALTA') {
    bgColor = "bg-red-100";
    textColor = "text-red-800";
    darkBgColor = "dark:bg-red-900";
    darkTextColor = "dark:text-red-200";
  } else if (priority === 'MEDIA') {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-800";
    darkBgColor = "dark:bg-yellow-900";
    darkTextColor = "dark:text-yellow-200";
  } else if (priority === 'BAJA') {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
    darkBgColor = "dark:bg-green-900";
    darkTextColor = "dark:text-green-200";
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bgColor} ${textColor} ${darkBgColor} ${darkTextColor}`}>
      {priority}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let darkBgColor = "dark:bg-gray-700";
  let darkTextColor = "dark:text-gray-200";

  if (status === 'Completado') {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
    darkBgColor = "dark:bg-green-900";
    darkTextColor = "dark:text-green-200";
  } else if (status === 'En proceso') {
    bgColor = "bg-blue-100";
    textColor = "text-blue-800";
    darkBgColor = "dark:bg-blue-900";
    darkTextColor = "dark:text-blue-200";
  } else if (status === 'Pendiente') {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-800";
    darkBgColor = "dark:bg-yellow-900";
    darkTextColor = "dark:text-yellow-200";
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bgColor} ${textColor} ${darkBgColor} ${darkTextColor}`}>
      {status}
    </span>
  );
};

export default TasksTable;