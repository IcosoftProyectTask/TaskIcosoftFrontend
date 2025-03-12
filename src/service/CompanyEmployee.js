import { isAxiosError } from "axios";
import api from "../lib/axios";

// Función para crear un nuevo empleado de compañía
export const createCompanyEmployee = async (employeeData) => {
  try {
    const response = await api.post('/CompanyEmployee', employeeData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error creating company employee:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error creating company employee:', error);
    }
    throw error;
  }
};

// Función para obtener todos los empleados de compañía
export const getCompanyEmployees = async () => {
  try {
    const response = await api.get('/CompanyEmployee');
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error fetching company employees:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error fetching company employees:', error);
    }
    throw error;
  }
};

// Función para obtener un empleado de compañía por su ID
export const getCompanyEmployeeById = async (id) => {
  try {
    const response = await api.get(`/CompanyEmployee/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error fetching company employee with ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error fetching company employee with ID ${id}:`, error);
    }
    throw error;
  }
};

// Función para actualizar un empleado de compañía existente
export const updateCompanyEmployee = async (id, employeeData) => {
  try {
    const response = await api.put(`/CompanyEmployee/${id}`, employeeData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error updating company employee with ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error updating company employee with ID ${id}:`, error);
    }
    throw error;
  }
};

// Función para eliminar un empleado de compañía por su ID
export const deleteCompanyEmployee = async (id) => {
  try {
    const response = await api.delete(`/CompanyEmployee/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error deleting company employee with ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error deleting company employee with ID ${id}:`, error);
    }
    throw error;
  }
};

// Función para obtener empleados de compañía por el ID de la compañía
export const getCompanyEmployeesByCompanyId = async (idCompany) => {
  try {
    const response = await api.get(`/CompanyEmployee/company/${idCompany}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error fetching company employees for company ID ${idCompany}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error fetching company employees for company ID ${idCompany}:`, error);
    }
    throw error;
  }
};