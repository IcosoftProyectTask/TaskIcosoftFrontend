import { isAxiosError } from "axios";
import api from "../lib/axios";

export const getClienteAccountInfos = async () => {
  try {
    const { data } = await api.get("/ClienteAccountInfo");
    return data;
  } catch (error) {
    handleRequestError(error, "obtener las cuentas de clientes");
  }
};

export const getClienteAccountInfoById = async (id) => {
  if (id == null) throw new Error("ID de cuenta de cliente no válido");
  try {
    const { data } = await api.get(`/ClienteAccountInfo/${id}`);
    return data;
  } catch (error) {
    handleRequestError(error, "obtener la cuenta de cliente");
  }
};

export const createClienteAccountInfo = async (data) => {
  try {
    const res = await api.post("/ClienteAccountInfo", data);
    console.log("Respuesta de crear cuenta de cliente:", res.data);
    return res.data;
  } catch (error) {
    handleRequestError(error, "crear la cuenta de cliente");
  }
};

export const getClienteAccountInfosByCustomerId = async (customerId) => {
  if (customerId == null) throw new Error("ID de cliente no válido");
  try {
    const { data } = await api.get(`/ClienteAccountInfo/ByCustomer/${customerId}`);
    return data;
  } catch (error) {
    handleRequestError(error, "obtener la cuenta de cliente por ID de cliente");
  }
};


export const updateClienteAccountInfo = async (id, data) => {
  if (id == null) throw new Error("ID de cuenta de cliente no válido");
  try {
    const res = await api.put(`/ClienteAccountInfo/${id}`, data);
    return res.data;
  } catch (error) {
    handleRequestError(error, "actualizar la cuenta de cliente");
  }
};

export const deleteClienteAccountInfo = async (id) => {
  if (id == null) throw new Error("ID de cuenta de cliente no válido");
  try {
    const res = await api.delete(`/ClienteAccountInfo/${id}`);
    return res.data;
  } catch (error) {
    handleRequestError(error, "eliminar la cuenta de cliente");
  }
};

const handleRequestError = (error, context) => {
  if (isAxiosError(error)) {
    const msg = error.response?.data?.message || `Error al ${context}`;
    console.error(`Axios error: ${msg}`, {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(msg);
  }
  console.error(`Error inesperado al ${context}:`, error);
  throw new Error(`Error inesperado al ${context}`);
};
