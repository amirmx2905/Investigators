import api from "../apiConfig";

const getLineas = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });
    const response = await api.get(`/lineas/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en getLineas:", error);
    throw error;
  }
};

// También cambia las demás URLs del servicio
const getLinea = async (id) => {
  try {
    const response = await api.get(`/lineas/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener línea de investigación con ID ${id}:`, error);
    throw error;
  }
};

const createLinea = async (data) => {
  try {
    const response = await api.post("/lineas/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear línea de investigación:", error);
    throw error;
  }
};

const updateLinea = async (id, data) => {
  try {
    const response = await api.put(`/lineas/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar línea de investigación con ID ${id}:`, error);
    throw error;
  }
};

const deleteLinea = async (id) => {
  try {
    await api.delete(`/lineas/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar línea de investigación con ID ${id}:`, error);
    throw error;
  }
};

const getInvestigadoresLinea = async (id) => {
  try {
    const response = await api.get(`/lineas/${id}/investigadores/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener investigadores de la línea ${id}:`, error);
    throw error;
  }
};

const getEstadisticasLinea = async (id) => {
  try {
    const response = await api.get(`/lineas/${id}/estadisticas/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener estadísticas de la línea ${id}:`, error);
    throw error;
  }
};

export const lineaService = {
  getLineas,
  getLinea,
  createLinea,
  updateLinea,
  deleteLinea,
  getInvestigadoresLinea,
  getEstadisticasLinea,
};

export default lineaService;
