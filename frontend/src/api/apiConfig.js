import axios from 'axios';

// Crear una instancia de axios con la URL base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.59.101:30001/api", // Cambia esto a la URL de tu API
  withCredentials: true, // Para manejar cookies si tu API las usa
});

export default api;
