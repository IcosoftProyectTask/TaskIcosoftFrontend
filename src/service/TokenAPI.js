import { isAxiosError } from "axios";
import api from "../lib/axios";
import { useMutation } from "@tanstack/react-query";
import * as Toastify from "../assets/js/Toastify"

async function tokenRefresh(email) {
  try {
    const { data } = await api.post("/token",  email );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data);
    }
  }
}

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: tokenRefresh,
    onSuccess: (data) => {
      sessionStorage.setItem("token", data.accessToken);
    },
    onError: () => {
      Toastify.ToastError("Error al actualizar token");
      sessionStorage.clear();
    },
  });
};