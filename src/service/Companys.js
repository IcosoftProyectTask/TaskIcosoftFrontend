import { isAxiosError } from "axios";
import api from "../lib/axios";

// Función para limpiar los datos y dejar solo los campos que el backend espera
const cleanCompanyData = (companyData) => {
  // Solo incluye los campos que el backend espera
  return {
    companyFiscalName: companyData.companyFiscalName,
    companyComercialName: companyData.companyComercialName,
    email: companyData.email,
    companyAddress: companyData.companyAddress,
    idCart: companyData.idCart,
    companyPhone: companyData.companyPhone,
    status: companyData.status,
  };
};

// Función para obtener todas las compañías
export const getCompanies = async () => {
  try {
    const response = await api.get('/Company');
    console.log('Respuesta getCompanies:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error fetching companies:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener las compañías');
    } else {
      console.error('Unexpected error fetching companies:', error);
      throw new Error('Error inesperado al obtener las compañías');
    }
  }
};

// Función para crear una compañía
export const createCompany = async (companyData) => {
  try {
    // Limpiamos los datos para enviar solo lo que el backend espera
    const cleanedData = cleanCompanyData(companyData);
    console.log('Datos enviados al crear compañía:', cleanedData);
    
    const response = await api.post('/Company', cleanedData);
    console.log('Respuesta al crear compañía:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error creating company:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear la compañía');
    } else {
      console.error('Unexpected error creating company:', error);
      throw new Error('Error inesperado al crear la compañía');
    }
  }
};

// Función para actualizar una compañía
export const updateCompany = async (id, companyData) => {
  try {
    // Aseguramos que el ID sea un valor válido
    if (id === undefined || id === null) {
      throw new Error('ID de compañía no válido');
    }
    
    // Limpiamos los datos para enviar solo lo que el backend espera
    const cleanedData = cleanCompanyData(companyData);
    console.log(`Datos enviados al actualizar compañía ${id}:`, cleanedData);
    
    const response = await api.put(`/Company/${id}`, cleanedData);
    console.log('Respuesta al actualizar compañía:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error updating company:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al actualizar la compañía');
    } else {
      console.error('Unexpected error updating company:', error);
      throw new Error('Error inesperado al actualizar la compañía');
    }
  }
};

// Función para eliminar una compañía
export const deleteCompany = async (id) => {
  try {
    // Aseguramos que el ID sea un valor válido
    if (id === undefined || id === null) {
      throw new Error('ID de compañía no válido');
    }
    
    console.log(`Eliminando compañía con ID: ${id}`);
    const response = await api.delete(`/Company/${id}`);
    console.log('Respuesta al eliminar compañía:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error deleting company:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al eliminar la compañía');
    } else {
      console.error('Unexpected error deleting company:', error);
      throw new Error('Error inesperado al eliminar la compañía');
    }
  }
};