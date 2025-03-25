import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

export const getInvestigadores = async () => {
  const response = await api.get("/investigadores/");
  return response.data;
};

export const getUsuarios = async () => {
  const response = await api.get("/usuarios/");
  return response.data;
};

export const getProyectos = async () => {
  const response = await api.get("/proyectos/");
  return response.data;
};

export default api;
