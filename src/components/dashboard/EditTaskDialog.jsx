// src/components/dashboard/EditTaskDialog.jsx
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { useTaskContext } from '../../context/TaskContext';

const EditTaskDialog = () => {
  const { 
    editTask, 
    setEditTask, 
    handleUpdateTask,
    users,
    statusTasks
  } = useTaskContext();

  if (!editTask) return null;

  return (
    <Dialog open={!!editTask} onOpenChange={() => setEditTask(null)}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Editar Tarea</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Título de la tarea"
            value={editTask.title || ''}
            onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
            className="dark:bg-gray-800 dark:text-white"
          />
          <Textarea
            placeholder="Descripción"
            value={editTask.description || ''}
            onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
            className="dark:bg-gray-800 dark:text-white"
          />
          
          {/* Selección de usuario asignado */}
          <Select
            value={editTask.user?.idUser?.toString() || ""}
            onValueChange={(value) => {
              const selectedUser = users.find(user => user.idUser === parseInt(value));
              setEditTask({
                ...editTask,
                user: {
                  idUser: parseInt(value),
                  name: selectedUser ? selectedUser.name : "",
                  firstSurname: selectedUser ? selectedUser.firstSurname : ""
                }
              });
            }}
          >
            <SelectTrigger className="dark:bg-gray-800 dark:text-white">
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
          
          {/* Selección de estado */}
          <Select
            value={editTask.statusTask?.idStatus?.toString() || ""}
            onValueChange={(value) => {
              const selectedStatus = statusTasks.find(status => status.idStatus === parseInt(value));
              setEditTask({
                ...editTask,
                statusTask: {
                  idStatus: parseInt(value),
                  name: selectedStatus ? selectedStatus.name : (editTask.statusTask?.name || "Pendiente")
                }
              });
            }}
          >
            <SelectTrigger className="dark:bg-gray-800 dark:text-white">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-white">
              {Array.isArray(statusTasks) && statusTasks.map((status) => (
                <SelectItem key={status.idStatus} value={status.idStatus.toString()}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Selección de prioridad */}
          <Select
            value={(editTask.priority?.name || "").toLowerCase()}
            onValueChange={(value) => {
              setEditTask({
                ...editTask,
                priority: {
                  ...editTask.priority,
                  name: value.charAt(0).toUpperCase() + value.slice(1) // Capitalizar
                }
              });
            }}
          >
            <SelectTrigger className="dark:bg-gray-800 dark:text-white">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-white">
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Campo de fecha límite */}
          <Input
            type="datetime-local"
            value={editTask.endTask || ''}
            onChange={(e) => setEditTask({ ...editTask, endTask: e.target.value })}
            className="dark:bg-gray-800 dark:text-white"
          />
          
          <DialogFooter>
            <Button 
              onClick={() => handleUpdateTask(editTask)} 
              className="w-full"
            >
              Actualizar Tarea
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;