// src/components/dashboard/TaskList.jsx
import React from 'react';
import { useTaskContext } from '../../context/TaskContext';
import TaskCard from './TaskCard';

const TaskList = () => {
  const { getFilteredAndSortedTasks } = useTaskContext();
  const sortedTasks = getFilteredAndSortedTasks();

  if (sortedTasks.length === 0) {
    return (
      <div className="col-span-12 py-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No se encontraron tareas que coincidan con los criterios de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="col-span-12">
      <div className="grid grid-cols-1 gap-4">
        {sortedTasks.map((task) => (
          <TaskCard 
            key={`${task.idSupportTask}-${task.updatedAt || task.createdAt}`} 
            task={task} 
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;