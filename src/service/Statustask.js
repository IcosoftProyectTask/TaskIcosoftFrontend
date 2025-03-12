import { isAxiosError } from "axios";
import api from "../lib/axios";

// Función para crear un nuevo estado de tarea

export const createStatusTask = async (statusTaskData) => {
    try {
        const response = await api.post('/StatusTask', statusTaskData);
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
        console.error('Error creating status task:', error.response?.data || error.message);
        } else {
        console.error('Unexpected error creating status task:', error);
        }
        throw error;
    }
    };

// Función para obtener todos los estados de tarea
export const getStatusTasks = async () => {
    try {
        const response = await api.get('/StatusTask');
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
        console.error('Error fetching status tasks:', error.response?.data || error.message);
        } else {
        console.error('Unexpected error fetching status tasks:', error);
        }
        throw error;
    }
    };

// Función para obtener un estado de tarea por su ID
export const getStatusTaskById = async (id) => {
    try {
        const response = await api.get(`/StatusTask/${id}`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
        console.error(`Error fetching status task with ID ${id}:`, error.response?.data || error.message);
        } else {
        console.error(`Unexpected error fetching status task with ID ${id}:`, error);
        }
        throw error;
    }
    };

// Función para actualizar un estado de tarea existente
 
export const updateStatusTask = async (id, statusTaskData) => {
    try {
        const response = await api.put(`/StatusTask/${id}`, statusTaskData);
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
        console.error(`Error updating status task with ID ${id}:`, error.response?.data || error.message);
        } else {
        console.error(`Unexpected error updating status task with ID ${id}:`, error);
        }
        throw error;
    }

    };

// Función para eliminar un estado de tarea por su ID

export const deleteStatusTask = async (id) => {
    try {
        const response = await api.delete(`/StatusTask/${id}`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
        console.error(`Error deleting status task with ID ${id}:`, error.response?.data || error.message);
        } else {
        console.error(`Unexpected error deleting status task with ID ${id}:`, error);
        }
        throw error;
    }
    };