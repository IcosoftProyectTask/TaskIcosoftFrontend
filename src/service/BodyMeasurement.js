import { isAxiosError } from "axios";
import api from "../lib/axios";

//obtener bodyMeasurement
export async function getBodyMeasurement() {
    try {
      const { data } = await api.get("/bodymeasurement");
      return data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response.message) {
        throw new Error(error.response.data.message);
      }
    }
  }

  //insertar bodyMeasurement
  export async function insertBodyMeasurement(formData) {
    try {
      const { data } = await api.post("/bodymeasurement", formData);
      return data;
    } catch (error) {
      console.error("Error al insertar la medición:", error);
      if (isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al insertar la medición.");
      }
    }
  }
  

  //eliminar bodyMeasurement
  export async function DeleteBodyMeasurement(id) {
    try {
      const { data } = await api.delete(`/bodymeasurement/${id}`);
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response.message) {
        throw new Error(error.response.data.message);
      }
    }
}

//actualizar bodyMeasurement
export async function UpdateBodyMeasurement({id, values}) {
    try {
      const { data } = await api.put(`/bodymeasurement/${id}`, values);
      return data;
    } catch (error) {
      throw new Error('Error al actualizar bodyMeasurement ');
    }
  }
  