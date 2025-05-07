import { isAxiosError } from "axios";
import api from "../lib/axios";


function parseExcelDate(dateString) {
  if (!dateString) return null;

  // Detecta si es formato "DD/MM/YYYY"
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    
    // Importante: Asegurarse que los números estén bien
    const dayNumber = parseInt(day, 10);
    const monthNumber = parseInt(month, 10);
    const yearNumber = parseInt(year, 10);
    
    // Validar que los números sean válidos
    if (isNaN(dayNumber) || isNaN(monthNumber) || isNaN(yearNumber)) {
      console.error('Fecha inválida:', dateString);
      return null;
    }
    
    // Crear fecha correctamente usando Date constructor estándar
    // El mes en JavaScript es 0-based (enero es 0)
    const date = new Date(yearNumber, monthNumber - 1, dayNumber);
    
    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) {
      console.error('Fecha resultante inválida:', date);
      return null;
    }
    
    return date.toISOString();
  }

  // Si no es formato esperado, intenta parsearlo normal
  const parsedDate = new Date(dateString);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString();
  }

  console.error('No se pudo parsear la fecha:', dateString);
  return null;
}



// Función para limpiar los datos y dejar solo los campos que el backend espera
const cleanLicenseData = (licenseData) => {
  // Solo incluye los campos que el backend espera
  return {
    client: licenseData.client,
    deviceName: licenseData.deviceName,
    licenseNumber: licenseData.licenseNumber,
    type: licenseData.type,
    installationDate: licenseData.installationDate 
      ? parseExcelDate(licenseData.installationDate)
      : null,
  };
};

// Función para obtener todas las licencias
export const getLicenses = async () => {
  try {
    const response = await api.get('/License');
    console.log('Respuesta getLicenses:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error fetching licenses:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener las licencias');
    } else {
      console.error('Unexpected error fetching licenses:', error);
      throw new Error('Error inesperado al obtener las licencias');
    }
  }
};

// Función para obtener una licencia por ID
export const getLicenseById = async (id) => {
  try {
    // Aseguramos que el ID sea un valor válido
    if (id === undefined || id === null) {
      throw new Error('ID de licencia no válido');
    }
    
    const response = await api.get(`/License/${id}`);
    console.log(`Respuesta getLicenseById ${id}:`, response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error fetching license:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener la licencia');
    } else {
      console.error('Unexpected error fetching license:', error);
      throw new Error('Error inesperado al obtener la licencia');
    }
  }
};

// Función para crear una licencia
export const createLicense = async (licenseData) => {
  try {
    // Limpiamos los datos para enviar solo lo que el backend espera
    const cleanedData = cleanLicenseData(licenseData);
    console.log('Datos enviados al crear licencia:', cleanedData);
    
    const response = await api.post('/License', cleanedData);
    console.log('Respuesta al crear licencia:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error creating license:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear la licencia');
    } else {
      console.error('Unexpected error creating license:', error);
      throw new Error('Error inesperado al crear la licencia');
    }
  }
};

export const bulkCreateLicenses = async (licenseDataArray) => {
  try {
    // Verificar que se recibió un array
    if (!Array.isArray(licenseDataArray) || licenseDataArray.length === 0) {
      throw new Error('Datos no válidos para importación masiva');
    }
   
    // Limpiar los datos para cada licencia
    const cleanedDataArray = licenseDataArray.map(licenseData => cleanLicenseData(licenseData));
    console.log('Datos enviados para creación masiva de licencias:', cleanedDataArray);
   
    // Enviar al endpoint de creación masiva
    const response = await api.post('/License/bulk', cleanedDataArray);
    console.log('Respuesta al crear licencias en masa:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error en importación masiva:', error.response?.data || error.message);
    
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const messages = Object.entries(validationErrors)
          .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
          .join(' | ');
        throw new Error(`Errores de validación: ${messages}`);
      }
    
      throw new Error(error.response?.data?.message || 'Error al importar licencias desde Excel');
    }
  }
}

// Función para actualizar una licencia
export const updateLicense = async (id, licenseData) => {
  try {
    // Aseguramos que el ID sea un valor válido
    if (id === undefined || id === null) {
      throw new Error('ID de licencia no válido');
    }
    
    // Limpiamos los datos para enviar solo lo que el backend espera
    const cleanedData = cleanLicenseData(licenseData);
    console.log(`Datos enviados al actualizar licencia ${id}:`, cleanedData);
    
    const response = await api.put(`/License/${id}`, cleanedData);
    console.log('Respuesta al actualizar licencia:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error updating license:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al actualizar la licencia');
    } else {
      console.error('Unexpected error updating license:', error);
      throw new Error('Error inesperado al actualizar la licencia');
    }
  }
};

// Función para eliminar una licencia
export const deleteLicense = async (id) => {
  try {
    // Aseguramos que el ID sea un valor válido
    if (id === undefined || id === null) {
      throw new Error('ID de licencia no válido');
    }
    
    console.log(`Eliminando licencia con ID: ${id}`);
    const response = await api.delete(`/License/${id}`);
    console.log('Respuesta al eliminar licencia:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error deleting license:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al eliminar la licencia');
    } else {
      console.error('Unexpected error deleting license:', error);
      throw new Error('Error inesperado al eliminar la licencia');
    }
  }
};