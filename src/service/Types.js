import { isAxiosError } from "axios";
import api from "../lib/axios";


export async function getActiveTypes() {
    try {
      const { data } = await api.get("/types/active");
      console.log("RESPONSE COMPLETO:", data); // Usamos data directamente
      return data; // Retorna la data directamente, no data.data
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error al obtener los tipos activos');
      }
      throw new Error('Error de conexión al obtener los tipos activos');
    }
  }

export async function getTypeById(id) {
  try {
    const { data } = await api.get(`/types/${id}`);
    return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al obtener el tipo');
    }
    throw new Error('Error de conexión al obtener el tipo');
  }
}

export async function createType(typeData) {
  try {
    const { data } = await api.post("/types", typeData);
    return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al crear el tipo');
    }
    throw new Error('Error de conexión al crear el tipo');
  }
}

export async function updateType({ id, typeData }) {
  try {
    const { data } = await api.put(`/types/${id}`, typeData);
    return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al actualizar el tipo');
    }
    throw new Error('Error de conexión al actualizar el tipo');
  }
}

export async function deleteType(id) {
  try {
    const { data } = await api.delete(`/types/${id}`);
    return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al eliminar el tipo');
    }
    throw new Error('Error de conexión al eliminar el tipo');
  }
}
