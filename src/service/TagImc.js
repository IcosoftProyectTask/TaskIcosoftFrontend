import { isAxiosError } from "axios";
import api from "../lib/axios";

//obtener tagimc
export async function getTagImc() {
    try {
      const { data } = await api.get("/tag-imc/active");
      return data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response.message) {
        throw new Error(error.response.data.message);
      }
    }
  }

    //insertar tagimc
    export async function insertTagImc(formData) {
        try {
          const { data } = await api.post("/tag-imc", formData);
          return data;
        } catch (error) {
          if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
          }
        }
      }

  //eliminar tag-imc
  export async function DeleteTagImc(id) {
    try {
      const { data } = await api.delete(`/tag-imc/${id}`);
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response.message) {
        throw new Error(error.response.data.message);
      }
    }
}

//actualizar tagImc
export async function UpdateTagImc({ id, values }) {
    try {
        const { data } = await api.put(`/tag-imc/${id}`, { ...values });
        return data;
    } catch (error) {
        console.error("Detalles del error:", error.response?.data || error.message);
        throw new Error("Error al actualizar tagimc");
    }
}

  