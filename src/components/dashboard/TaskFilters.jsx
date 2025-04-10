// src/components/dashboard/TaskFilters.jsx
import React from 'react';
import { Input } from '../../components/ui/Input';
import { Search } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { useTaskContext } from '../../context/TaskContext';

const TaskFilters = () => {
  const { 
    searchTerm,
    setSearchTerm,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy
  } = useTaskContext();

  return (
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
  );
};

export default TaskFilters;