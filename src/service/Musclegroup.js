import { isAxiosError } from "axios";
import api from "../lib/axios";

//obtener los grupos musculares
export async function getMusclegroup() {
    try {
      const { data } = await api.get("/musclegroup");
      return data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response.message) {
        throw new Error(error.response.data.message);
      }
    }
  }

  //insertar el grupo muscular
  export async function insertMusclegroup(formData) {
    try {
      const { data } = await api.post("/musclegroup", formData);
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response.message) {
        throw new Error(error.response.data.message);
      }
    }
  }

  //eliminar grupo muscular
  export async function DeleteMusclegroup(id) {
    try {
      const { data } = await api.delete(`/musclegroup/${id}`);
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response.message) {
        throw new Error(error.response.data.message);
      }
    }
}

//actualizar grupo muscular
export async function UpdateMusclegroup({id, values}) {
  try {
    const { data } = await api.put(`/musclegroup/${id}`, values);
    return data;
  } catch (error) {
    throw new Error('Error al actualizar el grupo muscular');
  }
}

