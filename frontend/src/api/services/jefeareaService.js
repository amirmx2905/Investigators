import api from "../apiConfig";

const getJefesArea = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/jefes-area/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en getJefesArea:", error);
    throw error;
  }
};

const getJefeArea = async (id) => {
  try {
    const response = await api.get(`/jefes-area/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener jefe de área con ID ${id}:`, error);
    throw error;
  }
};

const createJefeArea = async (data) => {
  try {
    const response = await api.post("/jefes-area/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear jefe de área:", error);
    throw error;
  }
};

const updateJefeArea = async (id, data) => {
  try {
    const response = await api.put(`/jefes-area/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar jefe de área con ID ${id}:`, error);
    throw error;
  }
};

const deleteJefeArea = async (id) => {
  try {
    await api.delete(`/jefes-area/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar jefe de área con ID ${id}:`, error);
    throw error;
  }
};

const getInvestigadoresPorJefeArea = async (id) => {
  try {
    const response = await api.get(`/jefes-area/${id}/investigadores/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener investigadores del jefe de área ${id}:`, error);
    throw error;
  }
};

const getEstadisticasJefeArea = async (id) => {
  try {
    const response = await api.get(`/jefes-area/${id}/estadisticas/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener estadísticas del jefe de área ${id}:`, error);
    throw error;
  }
};

export const jefeareaService = {
  getJefesArea,
  getJefeArea,
  createJefeArea,
  updateJefeArea,
  deleteJefeArea,
  getInvestigadoresPorJefeArea,
  getEstadisticasJefeArea,
};

export default jefeareaService;