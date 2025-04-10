// src/components/dashboard/TaskCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/Button';
import { User, Clock, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { useTaskContext } from '../../context/TaskContext';

const TaskCard = ({ task }) => {
  const navigate = useNavigate();
  const { 
    getPriorityColor, 
    getStatusColor, 
    getIdColor, 
    formatDate,
    handleStatusChange,
    handleReassignTask,
    handleDeleteTask,
    setEditTask,
    users,
    statusTasks
  } = useTaskContext();

  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  // Para detener la propagación de eventos en los botones
  const handleStopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <Card
      className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900 cursor-pointer"
      onClick={() => handleTaskClick(task.idSupportTask)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold dark:text-white">{task.title}</CardTitle>
        <div className="flex gap-2">
          <Badge className={getPriorityColor(task.priority?.name)}>
            {(task.priority?.name || "Media").toUpperCase()}
          </Badge>
          <Badge className={getStatusColor(task.statusTask?.name)}>
            {(task.statusTask?.name || "Pendiente").toUpperCase()}
          </Badge>
          <Badge className={getIdColor(task.idSupportTask)}>
            {'#' + task.idSupportTask}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>{task.user?.name || "Usuario"} {task.user?.firstSurname || ""}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>Creado: {formatDate(task.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle size={16} />
              <span>Vence: {formatDate(task.endTask)}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {/* Campo para reasignar tarea */}
            <Select
              value={task.user?.idUser?.toString() || ""}
              onValueChange={(value) => handleReassignTask(task.idSupportTask, parseInt(value))}
              onOpenChange={handleStopPropagation}
            >
              <SelectTrigger 
                className="w-[200px] dark:bg-gray-800 dark:text-white"
                onClick={handleStopPropagation}
              >
                <SelectValue placeholder="Asignar a..." />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-white">
                {Array.isArray(users) && users.map((user) => (
                  <SelectItem key={user.idUser} value={user.idUser.toString()}>
                    {user.name} {user.firstSurname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Campo para cambiar estado */}
            <Select
              value={task.statusTask?.idStatus?.toString() || ""}
              onValueChange={(value) => handleStatusChange(task.idSupportTask, value)}
              onOpenChange={handleStopPropagation}
            >
              <SelectTrigger 
                className="w-[200px] dark:bg-gray-800 dark:text-white"
                onClick={handleStopPropagation}
              >
                <SelectValue placeholder="Cambiar estado" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-white">
                {Array.isArray(statusTasks) && statusTasks.map((status) => (
                  <SelectItem key={status.idStatus} value={status.idStatus.toString()}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Botón de editar */}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                handleStopPropagation(e);
                setEditTask(task);
              }}
              className="dark:bg-gray-800 dark:text-white"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
            
            {/* Botón de eliminar */}
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 dark:bg-gray-800 dark:text-red-400"
              onClick={(e) => {
                handleStopPropagation(e);
                handleDeleteTask(task.idSupportTask);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;