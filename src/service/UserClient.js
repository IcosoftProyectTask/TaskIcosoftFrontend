import { isAxiosError } from "axios";
import api from "../lib/axios";

//registrar un usuario en la vista administrativa
export async function registerUserClient(formData) {
  try {
      const { data } = await api.post("/user/admin-create-user", formData);
      return data;
  } catch (error) {
      if (isAxiosError(error) && error.response) {
          throw new Error(error.response.data.message || "Error al registrar el usuario.");
      }
      throw new Error("Error de conexión con el servidor.");
  }
}

  // obtener usuarios
  export async function getUserClient() {
    try {
        const { data } = await api.get("/user/getAllRole3/active");
        return data.data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}
//obtener solo el nombre
export async function getUserClientName() {
    try {
      const { data } = await api.get("/user/getAllRole3/active");
      // Extraer solo los nombres de los usuarios
      return data.data.map((user) => ({
        idUser: user.idUser, // ID del usuario
        name: user.name,     // Nombre del usuario
        firstSurname: user.firstSurname,
        secondSurname: user.secondSurname,
      }));
    } catch (error) {
      if (isAxiosError(error) && error.response.message) {
        throw new Error(error.response.data.message);
      }
    }
  }
  
  export async function DeleteUserClient(id) {
    try {
        // Validación del ID
        if (!id) {
            throw new Error("ID del usuario no proporcionado");
        }
        
        console.log(`Intentando eliminar usuario con ID: ${id}`);
        const { data } = await api.delete(`/user/${id}`);
        return data;
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        
        if (error.message === "ID del usuario no proporcionado") {
            throw new Error(error.message);
        }
        
        if (isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else if (isAxiosError(error)) {
            throw new Error("Error al eliminar el usuario");
        } else {
            throw error;
        }
    }
}

//actualizar usuario
export async function UpdateUserClient({id, values}) {
    try {  
        const { data } = await api.put(`/user/${id}`, values);    
        return data;
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        throw new Error('Error al actualizar usuario');
    }
}
  
