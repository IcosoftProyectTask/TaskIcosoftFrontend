import { isAxiosError } from "axios";
import api from "../lib/axios";

// Función para crear una nueva tarea de soporte
export const createSupportTask = async (taskData) => {
  try {
    const response = await api.post('/SupportTask', taskData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error creating support task:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error creating support task:', error);
    }
    throw error;
  }
};

// Función para obtener todas las tareas de soporte
export const getSupportTasks = async () => {
    try {
      const response = await api.get('/SupportTask');
      return response.data.data; // Accede al array de tareas dentro de la propiedad "data"
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('Error fetching support tasks:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error fetching support tasks:', error);
      }
      throw error;
    }
  };

// Función para obtener una tarea de soporte por su ID
export const getSupportTaskById = async (id) => {
  try {
    const response = await api.get(`/SupportTask/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error fetching support task with ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error fetching support task with ID ${id}:`, error);
    }
    throw error;
  }
};

// Función para actualizar una tarea de soporte existente
export const updateSupportTask = async (id, taskData) => {
  try {
    const response = await api.put(`/SupportTask/${id}`, taskData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error updating support task with ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error updating support task with ID ${id}:`, error);
    }
    throw error;
  }
};

// Función para actualizar el estado de una tarea de soporte
export const updateSupportTaskStatus = async (id, statusData) => {
    try {
        console.log(statusData);
      const response = await api.put(`/SupportTask/update-status/${id}`, statusData);
      console.log(response.data);
      return response.data;
     
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(`Error updating status of support task with ID ${id}:`, error.response?.data || error.message);
      } else {
        console.error(`Unexpected error updating status of support task with ID ${id}:`, error);
      }
      throw error;
    }
  };

  export const updateSupportTaskAsigment = async (id, AsigmentUserData) => {
    try {
      const response = await api.put(`/SupportTask/update-user-asigment/${id}`, AsigmentUserData);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(`Error updating asigment user of support task with ID ${id}:`, error.response?.data || error.message);
      } else {
        console.error(`Unexpected error updating asigment user of support task with ID ${id}:`, error);
      }
      throw error;
    }
  };

  
// Función para eliminar una tarea de soporte por su ID
export const deleteSupportTask = async (id) => {
  try {
    const response = await api.delete(`/SupportTask/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error deleting support task with ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error deleting support task with ID ${id}:`, error);
    }
    throw error;
  }
};