import { isAxiosError } from "axios";
import api from "../lib/axios";


export async function getImage() {
    try {
        const { data } = await api.get("/images");
        return data.data;
    } catch (error) {
        if (isAxiosError(error) && error.response.message) {
            throw new Error(error.response.data.message);
        }
    }
}
export async function insertImage(imageFile) {
    try {
      const formData = new FormData();
  
      // Analiza la extensión del archivo
      const fileExtension = imageFile.name.split(".").pop().toLowerCase();
      let idImageType = 0;
  
      // Define el tipo según la extensión
      if (["jpg", "jpeg", "png", "bmp", "webp"].includes(fileExtension)) {
        idImageType = 1; // Imagen estándar
      } else if (["gif"].includes(fileExtension)) {
        idImageType = 2; // Animación
      } else {
        throw new Error("Archivo no permitido. Solo se aceptan imágenes y GIFs.");
      }
  
      // Agrega los valores al FormData
      formData.append("IdImageType", idImageType);
      formData.append("ImageFile", imageFile);
  
      // Realiza la solicitud a la API
      const { data } = await api.post("/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error desconocido al subir la imagen");
      }
    }
  }

  export async function deleteImage(id) {
    try {
      const { data } = await api.delete(`/images/${id}`);
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response.message) {
        throw new Error(error.response.data.message);
      }
    }
  }

  export async function updateImage(imageId, imageFile) {
    try {
      const formData = new FormData();
  
      // Analiza la extensión del archivo
      const fileExtension = imageFile.name.split(".").pop().toLowerCase();
      let idImageType = 0;
  
      // Define el tipo según la extensión
      if (["jpg", "jpeg", "png", "bmp", "webp"].includes(fileExtension)) {
        idImageType = 1; // Imagen estándar
      } else if (["gif"].includes(fileExtension)) {
        idImageType = 2; // Animación
      } else {
        throw new Error("Archivo no permitido. Solo se aceptan imágenes y GIFs.");
      }
  
      // Agrega los valores al FormData
      formData.append("IdImageType", idImageType);
      formData.append("ImageFile", imageFile);
  
      // Realiza la solicitud a la API
      const { data } = await api.put(`/images/${imageId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error desconocido al actualizar la imagen");
      }
    }
  }


  export async function getImageById(id) {
    try {
      const { data } = await api.get(`/images/${id}`);
      return data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response.message) {
        throw new Error(error.response.data.message);
      }
    }
  }




