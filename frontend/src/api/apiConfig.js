import axios from 'axios';

// Crear una instancia de axios con la URL base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true, // Para manejar cookies si tu API las usa
});

export default api;
