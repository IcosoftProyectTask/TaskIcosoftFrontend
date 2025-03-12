import { isAxiosError } from "axios";
import api from "../lib/axios";

// Función para crear una nueva compañía
export const createCompany = async (companyData) => {
  try {
    const response = await api.post('/Company', companyData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error creating company:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error creating company:', error);
    }
    throw error;
  }
};

// Función para obtener todas las compañías
export const getCompanies = async () => {
  try {
    const response = await api.get('/Company');
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error fetching companies:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error fetching companies:', error);
    }
    throw error;
  }
};

// Función para obtener una compañía por su ID
export const getCompanyById = async (id) => {
  try {
    const response = await api.get(`/Company/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error fetching company with ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error fetching company with ID ${id}:`, error);
    }
    throw error;
  }
};

// Función para actualizar una compañía existente
export const updateCompany = async (id, companyData) => {
  try {
    const response = await api.put(`/Company/${id}`, companyData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error updating company with ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error updating company with ID ${id}:`, error);
    }
    throw error;
  }
};

// Función para eliminar una compañía por su ID
export const deleteCompany = async (id) => {
  try {
    const response = await api.delete(`/Company/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error deleting company with ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error deleting company with ID ${id}:`, error);
    }
    throw error;
  }
};