// components/TaskDetailModal.jsx
import React from 'react';
import { formatDate, getTimeDisplay } from '../../components/Productivity/utils';
import { PriorityBadge, StatusBadge } from '../../components/Productivity/Badges';

const TaskDetailModal = ({ task, onClose }) => {
  // Asegurar que el modal ocupa una proporción razonable en móviles
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-xl max-h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Detalles de la tarea #{task.IdSupportTask}</h3>
          <button 
            className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        
        {/* Contenido con scroll */}
        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Título</h4>
              <p className="text-base text-gray-800 dark:text-gray-200">{task.Title}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Categoría</h4>
              <p className="text-base text-gray-800 dark:text-gray-200">{task.Category}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prioridad</h4>
              <p className="text-base text-gray-800 dark:text-gray-200">
                <PriorityBadge priority={task.PriorityName} />
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado</h4>
              <p className="text-base text-gray-800 dark:text-gray-200">
                <StatusBadge status={task.Status} />
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Asignado a</h4>
              <p className="text-base text-gray-800 dark:text-gray-200">{task.NameEmployeeCompany}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Empresa</h4>
              <p className="text-base text-gray-800 dark:text-gray-200">{task.CompanyName}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Descripción</h4>
            <p className="text-base text-gray-800 dark:text-gray-200 whitespace-pre-line">{task.Description}</p>
          </div>
          
          {task.Solution && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Solución</h4>
              <p className="text-base text-gray-800 dark:text-gray-200 whitespace-pre-line">{task.Solution}</p>
            </div>
          )}
          
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Métricas de tiempo</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TimeMetricItem 
                label="Creación" 
                value={formatDate(task.CreatedAt)} 
              />
              
              <TimeMetricItem 
                label="Inicio de atención" 
                value={formatDate(task.StartTask)} 
              />
              
              <TimeMetricItem 
                label="Finalización" 
                value={formatDate(task.EndTask)} 
              />
              
              <TimeMetricItem 
                label="Tiempo de respuesta inicial" 
                value={getTimeDisplay(task.CreatedAt, task.StartTask) || '-'} 
                highlight
              />
              
              <TimeMetricItem 
                label="Tiempo de resolución" 
                value={getTimeDisplay(task.StartTask, task.EndTask) || '-'} 
                highlight
              />
              
              <TimeMetricItem 
                label="Tiempo total" 
                value={getTimeDisplay(task.CreatedAt, task.EndTask) || '-'} 
                highlight
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700 text-right">
          <button 
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para métricas de tiempo
const TimeMetricItem = ({ label, value, highlight = false }) => (
  <div>
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className={`text-sm ${highlight ? 'font-medium' : ''} text-gray-800 dark:text-gray-200`}>
      {value}
    </p>
  </div>
);

export default TaskDetailModal;