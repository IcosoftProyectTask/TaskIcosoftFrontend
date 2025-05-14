import { isAxiosError } from "axios";
import api from "../lib/axios";
import { toast } from "react-toastify";

// Función para limpiar los datos y dejar solo los campos que el backend espera
const cleanRemoteData = (remoteData) => {
  return {
    idCustomer: remoteData.idCustomer, // <- Usar el ID, no un objeto Company
    idTypeLicense: remoteData.idTypeLicense, // <- Agregar este campo
    terminal: remoteData.terminal,
    software: remoteData.software,
    ipAddress: remoteData.ipAddress,
    user: remoteData.user,
    password: remoteData.password,
    status: true, // Asegúrate de incluirlo si es requerido
  };
};


// Función para crear múltiples registros remotos desde Excel
export const bulkCreateRemotes = async (remoteDataArray) => {
  try {
    // Verificar que se recibió un array
    if (!Array.isArray(remoteDataArray) || remoteDataArray.length === 0) {
      throw new Error('Datos no válidos para importación masiva');
    }

    // Limpiar los datos para cada registro
    const cleanedDataArray = remoteDataArray.map(remoteData => cleanRemoteData(remoteData));
    console.log('Datos enviados para creación masiva de registros remotos:', cleanedDataArray);

    // Enviar al endpoint de creación masiva (necesitarás crear este endpoint en tu backend)
    const response = await api.post('/Remote/bulk', cleanedDataArray);
    console.log('Respuesta al crear registros remotos en masa:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error en importación masiva:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al importar registros desde Excel');
    } else {
      console.error('Error inesperado en importación masiva:', error);
      throw new Error('Error inesperado al importar registros desde Excel');
    }
  }
};

// Función para obtener registros remotos por ID de cliente
export const getRemotesByCustomerId = async (customerId) => {
  try {
    if (!customerId) {
      throw new Error('ID de cliente no válido');
    }

    const response = await api.get(`/Remote/ByCustomer/${customerId}`);
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

// Función para obtener todos los registros remotos
export const getRemotes = async () => {
  try {
    const response = await api.get('/Remote');
    console.log('Respuesta getRemotes:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      // Si el error es 404 (not found), interpretamos que no hay registros
      if (error.response && error.response.status === 404) {
        console.log('No se encontraron registros remotos (Esto es normal)');
        // Devolvemos un objeto con data como array vacío
        return {
          data: [],
          message: "No hay registros remotos registrados",
          status: "success"
        };
      }

      console.error('Error fetching remotes:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener los registros remotos');
    } else {
      console.error('Unexpected error fetching remotes:', error);
      throw new Error('Error inesperado al obtener los registros remotos');
    }
  }
};

// Función para obtener un registro remoto por ID
export const getRemoteById = async (id) => {
  try {
    // Aseguramos que el ID sea un valor válido
    if (id === undefined || id === null) {
      throw new Error('ID de registro remoto no válido');
    }

    const response = await api.get(`/Remote/${id}`);
    console.log(`Respuesta getRemoteById ${id}:`, response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error fetching remote:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener el registro remoto');
    } else {
      console.error('Unexpected error fetching remote:', error);
      throw new Error('Error inesperado al obtener el registro remoto');
    }
  }
};

// Función para crear un registro remoto
export const createRemote = async (remoteData) => {
  try {
    // Limpiamos los datos para enviar solo lo que el backend espera
    const cleanedData = cleanRemoteData(remoteData);
    const response = await api.post('/Remote', cleanedData);
    toast.success('Registro remoto creado exitosamente');
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error creating remote:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear el registro remoto');
    } else {
      console.error('Unexpected error creating remote:', error);
      throw new Error('Error inesperado al crear el registro remoto');
    }
  }
};
export const updateRemote = async (id, remoteData) => {
  try {
    if (!id) throw new Error('ID no válido');

    const cleanedData = {
      idCustomer: remoteData.idCustomer,
      idTypeLicense: remoteData.idTypeLicense, // <- ¡Este campo es obligatorio!
      terminal: remoteData.terminal,
      software: remoteData.software, // Este campo no está en el ejemplo del backend, podrías removerlo si no es necesario
      ipAddress: remoteData.ipAddress,
      user: remoteData.user,
      password: remoteData.password,
      status: true,
    };

    const response = await api.put(`/Remote/${id}`, cleanedData);

    console.log(`Respuesta al actualizar registro remoto ${id}:`, response.data);

    return {
      success: true,
      data: response.data,
      message: response.data.message || "Registro actualizado correctamente",
      status: "success"
    };

  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error al actualizar');
    }
    throw new Error('Error inesperado');
  }
};


// Función para eliminar un registro remoto
export const deleteRemote = async (id) => {
  try {
    // Aseguramos que el ID sea un valor válido
    if (id === undefined || id === null) {
      throw new Error('ID de registro remoto no válido');
    }

    console.log(`Eliminando registro remoto con ID: ${id}`);
    const response = await api.delete(`/Remote/${id}`);
    console.log('Respuesta al eliminar registro remoto:', response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error deleting remote:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al eliminar el registro remoto');
    } else {
      console.error('Unexpected error deleting remote:', error);
      throw new Error('Error inesperado al eliminar el registro remoto');
    }
  }
};