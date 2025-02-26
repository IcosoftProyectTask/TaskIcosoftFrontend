import { isAxiosError } from "axios";
import api from "../lib/axios";

//obtener los Payment activos
export async function getPaymentActive() {
    try {
        const { data } = await api.get("/payments/active");
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}

//obtener los Payment vencidos
export async function getPaymentExpired() {
    try {
        const { data } = await api.get("/payments/expired");
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}

//insertar payment
export async function insertPayments(formData) {
    try {
        const { data } = await api.post("/payments", formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}

//eliminar payment
export async function DeletePayments(id) {
    try {
        const { data } = await api.delete(`/payments/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function UpdatePayments({ paymentId}) {
    try {
      console.log("Enviando solicitud de actualización con:", { paymentId}); // Log de los datos enviados
      const { data } = await api.put(`/payments/complete/${paymentId}`);
      console.log("Respuesta del servidor:", data); // Log de la respuesta del servidor
      return data;
    } catch (error) {
      console.error("Error en UpdatePayments:", error); // Log del error
      throw new Error('Error al actualizar el pago');
    }
  }
