import { isAxiosError } from "axios";
import api from "../lib/axios";

// Función para obtener todas las licencias
export const getLicenses = async () => {
  try {
    const response = await api.get('/License');
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error al obtener las licencias');
    }
    throw new Error('Error inesperado al obtener las licencias');
  }
};

// Función para obtener una licencia por ID
export const getLicenseById = async (id) => {
  try {
    if (!id) {
      throw new Error('ID de licencia no válido');
    }
    
    const response = await api.get(`/License/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error al obtener la licencia');
    }
    throw new Error('Error inesperado al obtener la licencia');
  }
};

// Función para crear una licencia
export const createLicense = async (licenseData) => {
  try {
    const response = await api.post('/License', licenseData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error al crear la licencia');
    }
    throw new Error('Error inesperado al crear la licencia');
  }
};



// Función para obtener registros remotos por ID de cliente
export const getLicenseByCustomerId = async (customerId) => {
  try {
    if (!customerId) {
      throw new Error('ID de cliente no válido');
    }

    const response = await api.get(`/License/ByCustomer/${customerId}`);
    console.log(`Respuesta getRemotesByCustomerId (${customerId}):`, response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      // Si el error es 404 (not found), interpretamos que no hay registros
      if (error.response && error.response.status === 404) {
        console.log(`No se encontraron registros para el cliente ${customerId} (Esto es normal)`);
        // Devolvemos un objeto con data como array vacío en lugar de lanzar error
        return {
          data: [],
          message: "No hay registros para este cliente",
          status: "success"
        };
      }

      console.error('Error obteniendo remotos por cliente:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener los registros remotos del cliente');
    } else {
      console.error('Error inesperado:', error);
      throw new Error('Error inesperado al obtener los registros remotos del cliente');
    }
  }
};

// Función para actualizar una licencia
export const updateLicense = async (id, licenseData) => {
  try {
    if (!id) {
      throw new Error('ID de licencia no válido');
    }
    
    const response = await api.put(`/License/${id}`, licenseData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error al actualizar la licencia');
    }
    throw new Error('Error inesperado al actualizar la licencia');
  }
};

// Función para eliminar una licencia
export const deleteLicense = async (id) => {
  try {
    if (!id) {
      throw new Error('ID de licencia no válido');
    }
    
    const response = await api.delete(`/License/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error al eliminar la licencia');
    }
    throw new Error('Error inesperado al eliminar la licencia');
  }
};