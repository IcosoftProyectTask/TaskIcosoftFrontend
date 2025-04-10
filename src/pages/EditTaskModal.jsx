import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/checkbox';
import { getCompanies } from '../service/Companys';
import { getCompanyEmployeesByCompanyId } from '../service/CompanyEmployee';
import { getPriorities } from '../service/Priority';
import { getStatusTasks } from '../service/Statustask';
import { getAll as getAllUsers } from '../service/UserAPI';
import { updateSupportTask } from '../service/SupportTask';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';

export const EditTaskModal = ({ isOpen, onClose, onTaskUpdated, task }) => {
  const [companies, setCompanies] = useState([]);
  const [companyEmployees, setCompanyEmployees] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statusTasks, setStatusTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [enableManualEndTask, setEnableManualEndTask] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    if (task) {
      setEditTask({
        ...task,
        idUser: task.user?.idUser || task.idUser,
        idCompany: task.idCompany,
        idPriority: task.priority?.idPriority || task.idPriority,
        idStatus: task.statusTask?.idStatus || task.idStatus,
      });
      
      // Si ya tiene fecha de finalización, habilitar la edición manual
      if (task.endTask) {
        setEnableManualEndTask(true);
      }
      
      // Establecer el valor de selectedCompany
      if (task.idCompany) {
        setSelectedCompany(task.idCompany);
      }
    }
  }, [task]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesData = await getCompanies();
        const prioritiesData = await getPriorities();
        const statusData = await getStatusTasks();
        const usersData = await getAllUsers();

        setCompanies(Array.isArray(companiesData.data) ? companiesData.data : []);
        setPriorities(Array.isArray(prioritiesData.data) ? prioritiesData.data : []);
        setStatusTasks(Array.isArray(statusData.data) ? statusData.data : []);

        if (usersData && usersData.success && Array.isArray(usersData.data)) {
          setUsers(usersData.data);
        } else {
          console.log('Estructura de datos de usuarios:', usersData);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error al cargar los datos.');
        setCompanies([]);
        setPriorities([]);
        setStatusTasks([]);
        setUsers([]);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedCompany) {
      const fetchCompanyEmployees = async () => {
        try {
          const employeesData = await getCompanyEmployeesByCompanyId(selectedCompany);

          // Verificar si es un solo empleado o un array
          if (employeesData && employeesData.success) {
            if (Array.isArray(employeesData.data)) {
              setCompanyEmployees(employeesData.data);
            } else if (employeesData.data && typeof employeesData.data === 'object') {
              // Si es un solo objeto empleado, lo ponemos en un array
              setCompanyEmployees([employeesData.data]);
            } else {
              setCompanyEmployees([]);
            }
          } else {
            setCompanyEmployees([]);
          }
        } catch (error) {
          console.error('Error fetching company employees:', error);
          toast.error('Error al cargar los empleados de la compañía.');
          setCompanyEmployees([]);
        }
      };

      fetchCompanyEmployees();
    } else {
      setCompanyEmployees([]);
    }
  }, [selectedCompany]);

  // Efecto para actualizar endTask cuando cambia el estado
  useEffect(() => {
    if (!editTask) return;
    
    // Si se selecciona el estado "Completado" (ID 3), actualizar la fecha de finalización
    // a menos que el usuario haya elegido establecerla manualmente
    if (editTask.idStatus === 3 && !enableManualEndTask) {
      setEditTask({ ...editTask, endTask: new Date().toISOString() });
    } 
    // Si no es "Completado" y no está habilitada la fecha manual, establecer como null
    else if (editTask.idStatus !== 3 && !enableManualEndTask) {
      setEditTask({ ...editTask, endTask: null });
    }
  }, [editTask?.idStatus, enableManualEndTask]);

  const handleUpdateTask = async () => {
    if (!editTask) return;
    
    if (!editTask.title || !editTask.description || !editTask.idCompany || !editTask.idPriority || !editTask.idStatus || !editTask.idUser) {
      toast.error('Por favor, complete todos los campos requeridos.');
      return;
    }

    const taskToUpdate = {
      ...editTask,
      // Si se estableció manualmente una fecha de finalización, usamos esa
      // Si el estado es "Completado" (ID 3), establecemos la fecha actual
      // De lo contrario, mantenemos endTask como null
      endTask: enableManualEndTask 
              ? editTask.endTask 
              : (editTask.idStatus === 3 ? new Date().toISOString() : null),
    };

    try {
      setIsSubmitting(true);
      const result = await updateSupportTask(editTask.idSupportTask, taskToUpdate);

      if (result && result.success) {
        toast.success('Tarea actualizada con éxito.');
        if (onTaskUpdated) {
          onTaskUpdated(result.data);
        }
        onClose();
      } else {
        toast.error(result?.message || 'Error al actualizar la tarea.');
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      } else {
        toast.error('Error inesperado al actualizar la tarea.');
      }
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!editTask) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Editar Tarea #{editTask.idSupportTask}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Primera columna */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Título</label>
              <Input
                placeholder="Título de la tarea"
                value={editTask.title || ''}
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Descripción</label>
              <Textarea
                placeholder="Descripción"
                value={editTask.description || ''}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                className="min-h-32 bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Solución</label>
              <Textarea
                placeholder="Solución"
                value={editTask.solution || ''}
                onChange={(e) => setEditTask({ ...editTask, solution: e.target.value })}
                className="min-h-24 bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
            </div>
          </div>

          {/* Segunda columna */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Categoría</label>
                <Select
                  value={editTask.category || 'Software'}
                  onValueChange={(value) => setEditTask({ ...editTask, category: value })}
                >
                  <SelectTrigger className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Hardware">Hardware</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Usuario</label>
                <Select
                  value={editTask.idUser?.toString() || ''}
                  onValueChange={(value) => setEditTask({ ...editTask, idUser: parseInt(value) })}
                >
                  <SelectTrigger className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    <SelectValue placeholder="Usuario" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    {Array.isArray(users) ? users.map((user) => (
                      <SelectItem key={user.idUser} value={user.idUser.toString()}>
                        {user.name} {user.firstSurname}
                      </SelectItem>
                    )) : <SelectItem value="">No hay usuarios disponibles</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Compañía</label>
                <Select
                  value={editTask.idCompany?.toString() || ''}
                  onValueChange={(value) => {
                    setSelectedCompany(parseInt(value));
                    setEditTask({ ...editTask, idCompany: parseInt(value) });
                  }}
                >
                  <SelectTrigger className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    <SelectValue placeholder="Compañía" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    {Array.isArray(companies) ? companies.map((company) => (
                      <SelectItem key={company.idCompany} value={company.idCompany.toString()}>
                        {company.companyComercialName}
                      </SelectItem>
                    )) : <SelectItem value="">No hay compañías disponibles</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Empleado</label>
                <Input
                  placeholder="Empleado de la empresa"
                  value={editTask.nameEmployeeCompany || ''}
                  onChange={(e) => setEditTask({ ...editTask, nameEmployeeCompany: e.target.value })}
                  className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Prioridad</label>
                <Select
                  value={editTask.idPriority?.toString() || ''}
                  onValueChange={(value) => setEditTask({ ...editTask, idPriority: parseInt(value) })}
                >
                  <SelectTrigger className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    {Array.isArray(priorities) ? priorities.map((priority) => (
                      <SelectItem key={priority.idPriority} value={priority.idPriority.toString()}>
                        {priority.name}
                      </SelectItem>
                    )) : <SelectItem value="">No hay prioridades disponibles</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Estado</label>
                <Select
                  value={editTask.idStatus?.toString() || ''}
                  onValueChange={(value) => setEditTask({ ...editTask, idStatus: parseInt(value) })}
                >
                  <SelectTrigger className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    {Array.isArray(statusTasks) ? statusTasks.map((status) => (
                      <SelectItem key={status.idStatus} value={status.idStatus.toString()}>
                        {status.name}
                      </SelectItem>
                    )) : <SelectItem value="">No hay estados disponibles</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="enableManualEndTask"
                checked={enableManualEndTask}
                onCheckedChange={(checked) => setEnableManualEndTask(checked)}
              />
              <label htmlFor="enableManualEndTask" className="text-sm font-medium leading-none text-gray-700 dark:text-white">
                Establecer fecha de finalización manual
              </label>
            </div>

            {enableManualEndTask && (
              <div>
                <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Fecha de finalización</label>
                <Input
                  type="datetime-local"
                  value={editTask.endTask || ''}
                  onChange={(e) => setEditTask({ ...editTask, endTask: e.target.value })}
                  className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
              </div>
            )}
        
          </div>
        </div>

        <DialogFooter className="mt-6">
          <div className="flex gap-2 w-full justify-end">
            <Button variant="outline" onClick={onClose} className="w-32 bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700" disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateTask}
              className="w-32"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};