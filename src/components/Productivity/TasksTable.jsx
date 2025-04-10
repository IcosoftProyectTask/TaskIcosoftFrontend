// Componentes para manejo de tareas

// components/TasksTable.jsx
import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { getHoursDifference, getStatusColor, getPriorityColor } from '../../components/Productivity/utils';

const TasksTable = ({ tasks, onViewDetails }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="font-medium mb-4 text-gray-800 dark:text-white">Listado de tareas</h3>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No se encontraron tareas con los filtros aplicados.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow overflow-hidden">
      <h3 className="font-medium mb-3 sm:mb-4 text-gray-800 dark:text-white text-sm sm:text-base">Listado de tareas</h3>
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
            {tasks.map((task) => {
              const resolutionTime = getHoursDifference(task.StartTask, task.EndTask);
              
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
                        {resolutionTime} hrs
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
