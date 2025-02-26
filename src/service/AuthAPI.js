import { isAxiosError } from "axios";
import api from "../lib/axios";

export async function login(formData) {
  try {
    const { data } = await api.post("/auth/login", formData);
    console.log(data)
    return data;
  } catch (error) {
    console.log(error)
    throw new Error(error.response?.data?.message || "Error desconocido");
  }
}

export async function register(formData) {
  try {
    const { data } = await api.post("/auth/register", formData);
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.response){
      throw new Error(error.response.data.errors);
    }
  }
}

export async function ActivatAccount(formData) {
  try {
    const { data } = await api.post("/auth/verify", formData);
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.response){
      throw new Error(error.response.data.errors);
    }
  }
}

export async function activateAccount({ user, token }) {
  try {
    const { data } = await api.get(`/email/confirm`, {
      params: { userId: user, token: token }
    });
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.response){
      throw new Error(error.response.data);
    }
  }
}

export async function verify2FA(formData) {
  try {
    const { data } = await api.post("/account/verify-2fa", formData);
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.response){
      throw new Error(error.response.data);
    }
  }
}

