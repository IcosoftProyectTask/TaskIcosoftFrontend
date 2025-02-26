import { isAxiosError } from "axios";
import api from "../lib/axios";

export async function getAllLevels() {
    try {
      const { data } = await api.get("/nivel");
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data);
      }
    }
  }