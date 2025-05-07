import { isAxiosError } from "axios";
import api from "../lib/axios";

export async function getAll() {
  try {
    const { data } = await api.get("/user");
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data);
    }
  }
}

//obtener usuario por id
export async function ObtenerUsuariosId({id, values}) {
  try {  
      const { data } = await api.put(`/user/${id}`, values);    
      return data;
  } catch (error) {
      console.error("Error al obtener el usuario:", error);
      throw new Error('Error al obtener usuario');
  }
}

  //olvido de contrasenia
  export async function OlvidoPassword(email) {
    try {
      const { data } = await api.post("/user/recover-password", { email });
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw new Error(error.response?.data.message || 'Error en la solicitud');
    }
  }


export async function updateProfile({id, formData}) {
  try {  
      const { data } = await api.put(`/user/${id}`, formData);    
      return data;
  } catch (error) {
      throw new Error(error);
  }
}

export async function getUserById(id) {
  try {  
      const { data } = await api.get(`/user/${id}`);    
      return data.data;
  } catch (error) {
      throw new Error('Error al obtener usuario');
  }
}


// Actualizar la foto de un usuario
export async function UpdateUserClientPhoto({ id, base64Image }) {
    try {
        const { data } = await api.patch(`/user/update-image/${id}`, {
            updateBase64Image: base64Image,
        });
        return data;
    } catch (error) {
        console.error("Error al actualizar la imagen del usuario:", error);
        if (isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("Error al actualizar la imagen del usuario.");
        }
    }
}
  