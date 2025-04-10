import axios from "axios";

// Determinar la URL de API dinámicamente
const getApiBaseUrl = () => {
  // Intenta usar la variable de entorno primero
  const envUrl = import.meta.env.VITE_API_URL;
  
  // Si existe la variable de entorno, úsala
  if (envUrl) {
    return envUrl;
  }
  
  // Si no existe, crea la URL basada en la ubicación actual
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5297/api/';
  } else {
    return `http://${window.location.hostname}:5297/api/`;
  }
};

// Crear la instancia de axios con la URL dinámica
const api = axios.create({
    baseURL: getApiBaseUrl()
});

// Para debugging - ver qué URL está usando
console.log('API base URL:', getApiBaseUrl());

// Enviar el token
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;