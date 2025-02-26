import { isAxiosError } from "axios";
import api from "../lib/axios";

//registrar asignamiento de rutina
export async function registerRoutineAssignment(formData) {
    try {
      console.log("Enviando datos a la API:", formData); // Log de los datos enviados
      const { data } = await api.post("/routine-assignment", formData);
      console.log("Respuesta del backend:", data); // Log de la respuesta del backend
      return data;
    } catch (error) {
      console.error("Error en la solicitud API:", error);
      throw error; // Asegúrate de propagar el error para que pueda ser manejado en el .catch()
    }
  }
  
  

  //obtener rutinas asignadas activas
export async function getRoutineAssignmentActive() {
    try {
        const { data } = await api.get("/routine-assignment/getAllActive");
        return data.data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}

  //obtener rutinas asignadas inactivas
  export async function getRoutineAssignmentInactive() {
    try {
        const { data } = await api.get("/routine-assignment/getAllInactive");
        return data.data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}

//eliminar asignamiento de rutina
export async function DeleteRoutineAssignment(id) {
    try {
        const { data } = await api.delete(`/routine-assignment/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}

//actualizar asignamiento de rutina
export async function UpdateRoutineAssignment({id, values}) {
    try {
      const { data } = await api.put(`/routine-assignment/${id}`, values);
      return data;
    } catch (error) {
      throw new Error('Error al actualizar asignamiento de rutina');
    }
  }
  