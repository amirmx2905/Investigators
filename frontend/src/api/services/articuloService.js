import api from "../apiConfig";

const getArticulos = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/articulos/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en getArticulos:", error);
    throw error;
  }
};

const getArticulo = async (id) => {
  try {
    const response = await api.get(`/articulos/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener artículo con ID ${id}:`, error);
    throw error;
  }
};

const createArticulo = async (data) => {
  try {
    const response = await api.post("/articulos/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear artículo:", error);
    throw error;
  }
};

const updateArticulo = async (id, data) => {
  try {
    const response = await api.put(`/articulos/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar artículo con ID ${id}:`, error);
    throw error;
  }
};

const deleteArticulo = async (id) => {
  try {
    await api.delete(`/articulos/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar artículo con ID ${id}:`, error);
    throw error;
  }
};

export const articuloService = {
  getArticulos,
  getArticulo,
  createArticulo,
  updateArticulo,
  deleteArticulo,
};