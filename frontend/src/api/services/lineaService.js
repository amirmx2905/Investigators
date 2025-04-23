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

    const response = await api.get(`/lineas-investigacion/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en getLineas:", error);
    throw error;
  }
};

const getLinea = async (id) => {
  try {
    const response = await api.get(`/lineas-investigacion/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener línea de investigación con ID ${id}:`, error);
    throw error;
  }
};

const createLinea = async (data) => {
  try {
    const response = await api.post("/lineas-investigacion/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear línea de investigación:", error);
    throw error;
  }
};

const updateLinea = async (id, data) => {
  try {
    const response = await api.put(`/lineas-investigacion/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar línea de investigación con ID ${id}:`, error);
    throw error;
  }
};

const deleteLinea = async (id) => {
  try {
    await api.delete(`/lineas-investigacion/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar línea de investigación con ID ${id}:`, error);
    throw error;
  }
};

const getInvestigadoresLinea = async (id) => {
  try {
    const response = await api.get(`/lineas-investigacion/${id}/investigadores/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener investigadores de la línea ${id}:`, error);
    throw error;
  }
};

const getEstadisticasLinea = async (id) => {
  try {
    const response = await api.get(`/lineas-investigacion/${id}/estadisticas/`);
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