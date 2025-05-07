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
const cleanClienteAccountInfoData = (accountData) => {
  // Solo incluye los campos que el backend espera
  return {
    client: accountData.client,
    email: accountData.email,
    password: accountData.password,
    appPassword: accountData.appPassword,
    hotmail: accountData.hotmail,
    hotmailPassword: accountData.hotmailPassword,
    vin: accountData.vin,
    date1: accountData.date1
    ? parseExcelDate(accountData.date1)
      : null,
  };
};

export const bulkCreateClienteAccountInfos = async (accountsData) => {
  try {
    // Transformar los datos al formato exacto que espera el backend
    const formattedData = accountsData.map(account => ({
      client: account.client || '',
      email: account.email || '',
      password: account.password || '',
      appPassword: account.appPassword || '',
      hotmail: account.hotmail || '',
      hotmailPassword: account.hotmailPassword || '',
      vin: account.vin || '',
      date1: convertToBackendDateFormat(account.date1) // Conversión crítica
    }));

    console.log('Datos formateados para el backend:', formattedData);
    
    const response = await api.post('/ClienteAccountInfo/bulk', formattedData);
    
    if (response.data.errors && response.data.errors.length > 0) {
      const errorDetails = response.data.errors.join('\n• ');
      console.error('Errores durante la importación:\n•', errorDetails);
      throw new Error(`Algunos registros fallaron:\n• ${errorDetails}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Detalles del error:', {
      url: error.config?.url,
      requestData: error.config?.data,
      status: error.response?.status,
      responseData: error.response?.data
    });
    throw new Error(error.response?.data?.message || 'Error al importar cuentas');
  }
};

// Función para convertir cualquier formato de fecha al que espera el backend (ISO 8601)
function convertToBackendDateFormat(dateInput) {
  if (!dateInput) return null;
  
  // Si ya está en formato ISO (como "2025-04-30T02:07:42.148Z")
  if (dateInput.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
    return dateInput;
  }
  
  // Para formato DD/MM/YYYY
  if (dateInput.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const [day, month, year] = dateInput.split('/');
    const dateObj = new Date(`${year}-${month}-${day}`);
    return dateObj.toISOString();
  }
  
  // Para formato YYYY-MM-DD
  if (dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return new Date(dateInput).toISOString();
  }
  
  // Si no reconocemos el formato, devolvemos null o podrías lanzar un error
  console.warn(`Formato de fecha no reconocido: ${dateInput}`);
  return null;
}

// Función para obtener todas las cuentas de clientes
export const getClienteAccountInfos = async () => {
  try {
    const response = await api.get('/ClienteAccountInfo');
    console.log('Respuesta getClienteAccountInfos:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error fetching cliente account infos:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener las cuentas de clientes');
    } else {
      console.error('Unexpected error fetching cliente account infos:', error);
      throw new Error('Error inesperado al obtener las cuentas de clientes');
    }
  }
};

// Función para obtener una cuenta de cliente por ID
export const getClienteAccountInfoById = async (id) => {
  try {
    // Aseguramos que el ID sea un valor válido
    if (id === undefined || id === null) {
      throw new Error('ID de cuenta de cliente no válido');
    }
    
    const response = await api.get(`/ClienteAccountInfo/${id}`);
    console.log(`Respuesta getClienteAccountInfoById ${id}:`, response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error fetching cliente account info:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener la cuenta de cliente');
    } else {
      console.error('Unexpected error fetching cliente account info:', error);
      throw new Error('Error inesperado al obtener la cuenta de cliente');
    }
  }
};

// Función para crear una cuenta de cliente
export const createClienteAccountInfo = async (accountData) => {
  try {
    // Limpiamos los datos para enviar solo lo que el backend espera
    const cleanedData = cleanClienteAccountInfoData(accountData);
    console.log('Datos enviados al crear cuenta de cliente:', cleanedData);
    
    const response = await api.post('/ClienteAccountInfo', cleanedData);
    console.log('Respuesta al crear cuenta de cliente:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error creating cliente account info:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear la cuenta de cliente');
    } else {
      console.error('Unexpected error creating cliente account info:', error);
      throw new Error('Error inesperado al crear la cuenta de cliente');
    }
  }
};

// Función para actualizar una cuenta de cliente
export const updateClienteAccountInfo = async (id, accountData) => {
  try {
    // Aseguramos que el ID sea un valor válido
    if (id === undefined || id === null) {
      throw new Error('ID de cuenta de cliente no válido');
    }
    
    // Limpiamos los datos para enviar solo lo que el backend espera
    const cleanedData = cleanClienteAccountInfoData(accountData);
    console.log(`Datos enviados al actualizar cuenta de cliente ${id}:`, cleanedData);
    
    const response = await api.put(`/ClienteAccountInfo/${id}`, cleanedData);
    console.log('Respuesta al actualizar cuenta de cliente:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error updating cliente account info:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al actualizar la cuenta de cliente');
    } else {
      console.error('Unexpected error updating cliente account info:', error);
      throw new Error('Error inesperado al actualizar la cuenta de cliente');
    }
  }
};

// Función para eliminar una cuenta de cliente
export const deleteClienteAccountInfo = async (id) => {
  try {
    // Aseguramos que el ID sea un valor válido
    if (id === undefined || id === null) {
      throw new Error('ID de cuenta de cliente no válido');
    }
    
    console.log(`Eliminando cuenta de cliente con ID: ${id}`);
    const response = await api.delete(`/ClienteAccountInfo/${id}`);
    console.log('Respuesta al eliminar cuenta de cliente:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error deleting cliente account info:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al eliminar la cuenta de cliente');
    } else {
      console.error('Unexpected error deleting cliente account info:', error);
      throw new Error('Error inesperado al eliminar la cuenta de cliente');
    }
  }
};