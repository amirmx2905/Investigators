import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeToTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await axios.post(
            `${API_URL}/token/refresh/`,
            {},
            { withCredentials: true }
          );

          isRefreshing = false;
          onTokenRefreshed();

          return axios(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          console.log("Error al refrescar token:", refreshError);
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        subscribeToTokenRefresh(() => {
          resolve(axios(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
