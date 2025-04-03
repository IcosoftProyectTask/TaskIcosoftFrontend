import { isAxiosError } from "axios";
import api from "../lib/axios";

// Función para crear un nuevo comentario
export const createComment = async (commentData) => {
  try {
    const response = await api.post('/commentsTask', commentData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error creating comment:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error creating comment:', error);
    }
    throw error;
  }
};

// Función para obtener un comentario por su ID
export const getCommentById = async (id) => {
  try {
    const response = await api.get(`/commentsTask/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error fetching comment with ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error fetching comment with ID ${id}:`, error);
    }
    throw error;
  }
};

// Función para obtener todos los comentarios de una tarea específica
export const getCommentsByTaskId = async (taskId) => {
  try {
    const response = await api.get(`/commentsTask/task/${taskId}`);
    return response.data.data; // Accede al array de comentarios dentro de la propiedad "data"
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error fetching comments for task with ID ${taskId}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error fetching comments for task with ID ${taskId}:`, error);
    }
    throw error;
  }
};

// Función para actualizar un comentario existente
export const updateComment = async (id, content) => {
  try {
    const response = await api.put(`/commentsTask/${id}`, { content });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error updating comment with ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error updating comment with ID ${id}:`, error);
    }
    throw error;
  }
};

// Función para eliminar un comentario por su ID
export const deleteComment = async (id) => {
  try {
    const response = await api.delete(`/commentsTask/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error deleting comment with ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error deleting comment with ID ${id}:`, error);
    }
    throw error;
  }
};