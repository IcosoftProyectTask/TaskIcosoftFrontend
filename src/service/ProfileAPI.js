import { isAxiosError } from "axios";
import api from "../lib/axios";

export async function getAllProfiles() {
    try {
      const { data } = await api.get("/perfil");
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data);
      }
    }
  }