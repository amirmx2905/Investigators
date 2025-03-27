import axios from "axios";

// Se crea una instancia personalizada de axios
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Añadimos el interceptor para incluir el token JWT en las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    console.log("Enviando solicitud con headers:", config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en la respuesta API:", error.response || error);

    if (error.response && error.response.status === 401) {
      console.log("Error 401: Token inválido o expirado. Cerrando sesión...");
      // Si el token ta expirado o no válido, lo manda al login.
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;