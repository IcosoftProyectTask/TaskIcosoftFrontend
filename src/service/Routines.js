import { isAxiosError } from "axios";
import api from "../lib/axios";

//obtener rutinas
export async function getRoutines() {
  try {
      const { data } = await api.get("/Routine");
      return data.data;
  } catch (error) {
      console.error("Error al obtener las rutinas", error); // Agregar un log
      if (isAxiosError(error) && error.response && error.response.data.message) {
          throw new Error(error.response.data.message);
      }
      throw new Error("Hubo un error al obtener las rutinas");
  }
}


  //rutimas por nombre
  export async function getRoutinesName() {
    try {
        const { data } = await api.get("/Routine");
        return data.data;
    } catch (error) {
        console.error("Error al obtener las rutinas", error); // Agregar un log
        if (isAxiosError(error) && error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error("Hubo un error al obtener las rutinas");
    }
  }

  

  
  //insertar rutinas
  export async function insertRoutines(formData) {
    try {
      const { data } = await api.post("/Routine", formData);
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response.message) {
        throw new Error(error.response.data.message);
      }
    }
  }


  //eliminar rutinas
  export async function DeleteRoutine(id) {
    try {
      const { data } = await api.delete(`/Routine/${id}`);
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response.message) {
        throw new Error(error.response.data.message);
      }
    }
}


//actualizar rutinas
export async function UpdateRoutine({id, values}) {
    try {
      const { data } = await api.put(`/Routine/${id}`, values);
      return data;
    } catch (error) {
      throw new Error('Error al actualizar rutina');
    }
  }