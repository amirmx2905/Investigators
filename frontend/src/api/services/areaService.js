import api from "../apiConfig";

const getAreas = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/areas/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en getAreas:", error);
    throw error;
  }
};

const getArea = async (id) => {
  try {
    const response = await api.get(`/areas/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener área con ID ${id}:`, error);
    throw error;
  }
};

const createArea = async (data) => {
  try {
    const response = await api.post("/areas/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear área:", error);
    throw error;
  }
};

const updateArea = async (id, data) => {
  try {
    const response = await api.put(`/areas/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar área con ID ${id}:`, error);
    throw error;
  }
};

const deleteArea = async (id) => {
  try {
    await api.delete(`/areas/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar área con ID ${id}:`, error);
    throw error;
  }
};

export const areaService = {
  getAreas,
  getArea,
  createArea,
  updateArea,
  deleteArea,
};

export default areaService;