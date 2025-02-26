import { isAxiosError } from "axios";
import api from "../lib/axios";

//obtener los ejercicios
export async function getExercise() {
    try {
        const { data } = await api.get("/exercise");
        return data.data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}

//insertar ejercicio
export async function insertExercise(formData) {
    try {
        const { data } = await api.post("/exercise", formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}

//eliminar ejercicio
export async function DeleteExercise(id) {
    try {
        const { data } = await api.delete(`/exercise/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}

//actualizar ejercicio
export async function UpdateExercise({id, values}) {
    try {
      const { data } = await api.put(`/exercise/${id}`, values);
      return data;
    } catch (error) {
      throw new Error('Error al actualizar el ejercicio');
    }
  }