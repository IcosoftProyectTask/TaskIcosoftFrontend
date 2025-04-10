// src/components/dashboard/DashboardHeader.jsx
import React from 'react';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { Dialog, DialogTrigger } from '../../components/ui/dialog';
import { NewTaskModal } from '../../pages/NewTaskModal';

const DashboardHeader = () => {
  const { isNewTaskModalOpen, setIsNewTaskModalOpen, handleCreateTask } = useTaskContext();

  return (
    <div className="sm:flex sm:justify-between sm:items-center mb-8">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-2xl md:text-3xl dark:text-blue-400 text-gray-500 font-bold">
          Dashboard
        </h1>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={() => setIsNewTaskModalOpen(true)}
          >
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
  );
};

export default DashboardHeader;