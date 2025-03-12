import { isAxiosError } from "axios";
import api from "../lib/axios";

// Función para crear una nueva prioridad

export const createPriority = async (priorityData) => {
  try {
    const response = await api.post('/Priority', priorityData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error creating priority:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error creating priority:', error);
    }
    throw error;
  }
};

// Función para obtener todas las prioridades
export const getPriorities = async () => {
  try {
    const response = await api.get('/Priority');
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error fetching priorities:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error fetching priorities:', error);
    }
    throw error;
  }
};

// Función para obtener una prioridad por su ID
export const getPriorityById = async (id) => {
  try {
    const response = await api.get(`/Priority/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error fetching priority with ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error fetching priority with ID ${id}:`, error);
    }
    throw error;
  }
};

// Función para actualizar una prioridad existente

export const updatePriority = async (id, priorityData) => {
    try {
        const response = await api.put(`/Priority/${id}`, priorityData);
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
        console.error(`Error updating priority with ID ${id}:`, error.response?.data || error.message);
        } else {
        console.error(`Unexpected error updating priority with ID ${id}:`, error);
        }
        throw error;
    }
    };

// Función para eliminar una prioridad por su ID
export const deletePriority = async (id) => {
    try {
        const response = await api.delete(`/Priority/${id}`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
        console.error(`Error deleting priority with ID ${id}:`, error.response?.data || error.message);
        } else {
        console.error(`Unexpected error deleting priority with ID ${id}:`, error);
        }
        throw error;
    }
    };
    