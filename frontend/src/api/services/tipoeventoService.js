import api from "../apiConfig";

const getTiposEvento = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/tipos-evento/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en getTiposEvento:", error);
    throw error;
  }
};

const getTipoEvento = async (id) => {
  try {
    const response = await api.get(`/tipos-evento/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener tipo de evento con ID ${id}:`, error);
    throw error;
  }
};

const createTipoEvento = async (data) => {
  try {
    const response = await api.post("/tipos-evento/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear tipo de evento:", error);
    throw error;
  }
};

const updateTipoEvento = async (id, data) => {
  try {
    const response = await api.put(`/tipos-evento/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar tipo de evento con ID ${id}:`, error);
    throw error;
  }
};

const deleteTipoEvento = async (id) => {
  try {
    await api.delete(`/tipos-evento/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar tipo de evento con ID ${id}:`, error);
    throw error;
  }
};

const getEventosPorTipo = async (id) => {
  try {
    const response = await api.get(`/tipos-evento/${id}/eventos/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener eventos del tipo ${id}:`, error);
    throw error;
  }
};

export const tipoeventoService = {
  getTiposEvento,
  getTipoEvento,
  createTipoEvento,
  updateTipoEvento,
  deleteTipoEvento,
  getEventosPorTipo,
};

export default tipoeventoService;