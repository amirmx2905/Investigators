import api from "../apiConfig";

const getUnidades = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/unidades/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en getUnidades:", error);
    throw error;
  }
};
const getUnidad = async (id) => {
  try {
    const response = await api.get(`/unidades/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener unidad con ID ${id}:`, error);
    throw error;
  }
};
const createUnidad = async (data) => {
  try {
    const response = await api.post("/unidades/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear unidad:", error);
    throw error;
  }
};
const updateUnidad = async (id, data) => {
  try {
    const response = await api.put(`/unidades/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar unidad con ID ${id}:`, error);
    throw error;
  }
};
const deleteUnidad = async (id) => {
  try {
    await api.delete(`/unidades/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar unidad con ID ${id}:`, error);
    throw error;
  }
};

export const unidadService = {
  getUnidades,
  getUnidad,
  createUnidad,
  updateUnidad,
  deleteUnidad,
};