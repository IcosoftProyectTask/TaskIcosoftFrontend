import { isAxiosError } from "axios";
import api from "../lib/axios";

//insertar qr
export async function insertQr(formData) {
    try {
        console.log("Enviando datos para registrar asistencia:", formData);
        const { data } = await api.post("/attendances/register-attendance", formData);
        console.log("Respuesta de la API:", data);
        return data;
    } catch (error) {
        console.error("Error al insertar asistencia:", error);
        if (isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("Error desconocido al registrar asistencia");
        }
    }
}


//obtener qr
export async function getQr() {
    try {
      const { data } = await api.get("/attendances/list");
      console.log("Datos obtenidos de la API:", data); // Asegurarse de que llegan datos
      return data;
    } catch (error) {
      console.error("Error en la API al obtener datos:", error);
      throw new Error(error.response?.data?.message || "Error al obtener datos");
    }
}
