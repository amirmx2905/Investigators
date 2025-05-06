import axios from 'axios';

// Instancia de axios con la URL base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost/api',
  withCredentials: true, // Pa manejar las cookies
});

export default api;
