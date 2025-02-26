import { isAxiosError } from "axios";
import api from "../lib/axios";

export async function getAllQuerys() {
  try {
    const { data } = await api.get("/consulta");
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data);
    }
  }
}

export async function deleteQuery(id) {
  try {
    const { data } = await api.delete(`/consulta/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data);
    }
  }
}

export async function getRealTime() {
  try {
    const { data } = await api.get("/consulta/realtime");
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data);
    }
  }
}
