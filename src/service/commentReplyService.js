import { isAxiosError } from "axios";
import api from "../lib/axios";

// Función para crear una nueva respuesta a un comentario
export const createReply = async (replyData) => {
  try {
    // Asegurarnos de que parentReplyId sea 0 y no null cuando no hay respuesta padre
    const formattedData = {
      ...replyData,
      parentReplyId: replyData.parentReplyId === null ? 0 : replyData.parentReplyId
    };
    
    console.log("Enviando datos formateados:", formattedData);
    const response = await api.post('/commentReplaysTask', formattedData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error creating reply:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error creating reply:', error);
    }
    return { success: false, message: "Error al crear la respuesta al comentario." };
  }
};

// Función para obtener una respuesta por su ID
export const getReplyById = async (id) => {
  try {
    const response = await api.get(`/commentReplaysTask/${id}`);

    if (response.data?.success) {
      return response.data.data; // Devuelve solo la parte relevante
    } else {
      throw new Error(response.data?.message || "Error desconocido al obtener la respuesta.");
    }
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error al obtener la respuesta con ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Error inesperado al obtener la respuesta con ID ${id}:`, error);
    }
    throw error;
  }
};

// Función para actualizar una respuesta existente
export const updateReply = async (id, content) => {
  try {
    const response = await api.put(`/commentReplaysTask/${id}`, { content });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error updating reply with ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error updating reply with ID ${id}:`, error);
    }
    throw error;
  }
};

// Función para eliminar una respuesta por su ID
export const deleteReply = async (id) => {
  try {
    const response = await api.delete(`/commentReplaysTask/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error deleting reply with ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error deleting reply with ID ${id}:`, error);
    }
    throw error;
  }
};