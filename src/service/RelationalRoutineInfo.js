import { isAxiosError } from "axios";
import api from "../lib/axios";


//insertar rutinas
export async function insertRelationalRoutine(formData) {
    try {
        const { data } = await api.post("/RelationalRoutineInfo", formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}

//obtener rutina
export async function getRelationalRoutine() {
    try {
        const { data } = await api.get("/RelationalRoutineInfo");
        return data.data;
    } catch (error) {
        console.error("Error al obtener las rutinas", error); // Agregar un log
        if (isAxiosError(error) && error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error("Hubo un error al obtener las rutinas");
    }
  }

//eliminar rutina
export async function DeleteRelationalRoutine(id) {
    try {
      const { data } = await api.delete(`/RelationalRoutineInfo/${id}`);
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response.message) {
        throw new Error(error.response.data.message);
      }
    }
}
