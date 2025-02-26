import { isAxiosError } from "axios";
import api from "../lib/axios";

export async function getDays() {
    try {
      const { data } = await api.get("/days");
      return data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response.message) {
        throw new Error(error.response.data.message);
      }
    }
  }