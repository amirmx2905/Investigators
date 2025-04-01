import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await axios.post(
          `${API_URL}/token/refresh/`,
          {},
          { withCredentials: true }
        );

        const originalRequest = error.config;
        originalRequest.withCredentials = true;
        return axios(originalRequest);
      } catch (refreshError) {
        console.log("No se pudo renovar la sesión");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
