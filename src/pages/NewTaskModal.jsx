import React, { useState, useEffect, useRef } from 'react';
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
import { createSupportTask } from '../service/SupportTask';
import { useUserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';

export const NewTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const { userInfo } = useUserContext();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [companyEmployees, setCompanyEmployees] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statusTasks, setStatusTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [enableManualEndTask, setEnableManualEndTask] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const companyDropdownRef = useRef(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'Software',
    idUser: userInfo.id,
    idCompany: null,
    nameEmployeeCompany: null,
    idPriority: null,
    idStatus: null,
    solution: '',
    startTask: null,
    endTask: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesData = await getCompanies();
        const prioritiesData = await getPriorities();
        const statusData = await getStatusTasks();
        const usersData = await getAllUsers();

        setCompanies(Array.isArray(companiesData.data) ? companiesData.data : []);
        setFilteredCompanies(Array.isArray(companiesData.data) ? companiesData.data : []);
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
        setFilteredCompanies([]);
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

          if (employeesData && employeesData.success) {
            if (Array.isArray(employeesData.data)) {
              setCompanyEmployees(employeesData.data);
            } else if (employeesData.data && typeof employeesData.data === 'object') {
              setCompanyEmployees([employeesData.data]);
            } else {
              setCompanyEmployees([]);
            }
          } else {
            setCompanyEmployees([]);
          }
        } catch (error) {
          console.error('Error fetching company employees:', error);
          setCompanyEmployees([]);
        }
      };

      fetchCompanyEmployees();
    } else {
      setCompanyEmployees([]);
    }
  }, [selectedCompany]);

  useEffect(() => {
    // Filtrar compañías según el término de búsqueda
    if (companySearchTerm) {
      const filtered = companies.filter(company => 
        company.companyComercialName.toLowerCase().includes(companySearchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companies);
    }
  }, [companySearchTerm, companies]);

  useEffect(() => {
    // Cerrar el dropdown al hacer clic fuera
    const handleClickOutside = (event) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target)) {
        setShowCompanyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.idCompany || !newTask.idPriority || !newTask.idStatus || !newTask.idUser) {
      toast.error('Por favor, complete todos los campos requeridos.');
      return;
    }
  
    let endTaskValue = null;
    const selectedStatus = statusTasks.find(status => status.idStatus === newTask.idStatus);
  
    if (selectedStatus) {
      if (selectedStatus.name.toLowerCase() === 'completada') {
        endTaskValue = new Date().toISOString();
      } else if (selectedStatus.name.toLowerCase() === 'pendiente') {
        endTaskValue = null;
      } else {
        endTaskValue = enableManualEndTask ? newTask.endTask : null;
      }
    }
  
    const taskToCreate = {
      ...newTask,
      startTask: null,
      endTask: endTaskValue,
    };
  
    try {
      setIsSubmitting(true);
      const result = await createSupportTask(taskToCreate);
  
      if (result && result.success) {
        toast.success('Tarea creada con éxito.');
        if (onTaskCreated) {
          onTaskCreated(result.data);
        }
        onClose();
        setNewTask({
          title: '',
          description: '',
          category: 'Software',
          idUser: userInfo.id,
          idCompany: null,
          nameEmployeeCompany: null,
          idPriority: null,
          idStatus: null,
          solution: '',
          startTask: null,
          endTask: new Date().toISOString(),
        });
      } else {
        toast.error(result?.message || 'Error al crear la tarea.');
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      } else {
        toast.error('Error inesperado al crear la tarea.');
      }
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company.idCompany);
    setNewTask({ ...newTask, idCompany: company.idCompany });
    setCompanySearchTerm(company.companyComercialName);
    setShowCompanyDropdown(false);
  };

  const handleCompanySearchChange = (e) => {
    setCompanySearchTerm(e.target.value);
    setShowCompanyDropdown(true);
    if (!e.target.value) {
      setNewTask({ ...newTask, idCompany: null });
      setSelectedCompany(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Crear Nueva Tarea</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Primera columna */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Título</label>
              <Input
                placeholder="Título de la tarea"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Descripción</label>
              <Textarea
                placeholder="Descripción"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="min-h-32 bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Solución</label>
              <Textarea
                placeholder="Solución"
                value={newTask.solution}
                onChange={(e) => setNewTask({ ...newTask, solution: e.target.value })}
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
                  value={newTask.category}
                  onValueChange={(value) => setNewTask({ ...newTask, category: value })}
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
                  value={newTask.idUser?.toString()}
                  onValueChange={(value) => setNewTask({ ...newTask, idUser: parseInt(value) })}
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
              <div className="relative" ref={companyDropdownRef}>
                <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Compañía</label>
                <Input
                  placeholder="Buscar compañía..."
                  value={companySearchTerm}
                  onChange={handleCompanySearchChange}
                  onFocus={() => setShowCompanyDropdown(true)}
                  className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
                {showCompanyDropdown && filteredCompanies.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredCompanies.map((company) => (
                      <div
                        key={company.idCompany}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleCompanySelect(company)}
                      >
                        {company.companyComercialName}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Empleado</label>
                <Input
                  placeholder="Empleado de la empresa"
                  value={newTask.nameEmployeeCompany}
                  onChange={(e) => setNewTask({ ...newTask, nameEmployeeCompany: e.target.value })}
                  className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Prioridad</label>
                <Select
                  value={newTask.idPriority?.toString()}
                  onValueChange={(value) => setNewTask({ ...newTask, idPriority: parseInt(value) })}
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
                  value={newTask.idStatus?.toString()}
                  onValueChange={(value) => setNewTask({ ...newTask, idStatus: parseInt(value) })}
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
                  value={newTask.endTask}
                  onChange={(e) => setNewTask({ ...newTask, endTask: e.target.value })}
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
              onClick={handleCreateTask}
              className="w-32"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear Tarea'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};