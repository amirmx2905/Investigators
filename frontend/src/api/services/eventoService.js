import api from "../apiConfig";

const getEventos = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/eventos/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en getEventos:", error);
    throw error;
  }
};

const getEvento = async (id) => {
  try {
    const response = await api.get(`/eventos/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener evento con ID ${id}:`, error);
    throw error;
  }
};

const createEvento = async (data) => {
  try {
    const response = await api.post("/eventos/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear evento:", error);
    throw error;
  }
};

const updateEvento = async (id, data) => {
  try {
    const response = await api.put(`/eventos/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar evento con ID ${id}:`, error);
    throw error;
  }
};

const deleteEvento = async (id) => {
  try {
    await api.delete(`/eventos/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar evento con ID ${id}:`, error);
    throw error;
  }
};

const getInvestigadoresEvento = async (id) => {
  try {
    const response = await api.get(`/eventos/${id}/investigadores/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener investigadores del evento ${id}:`, error);
    throw error;
  }
};

const getEstadisticasEventos = async () => {
  try {
    const response = await api.get("/eventos/estadisticas/");
    return response.data;
  } catch (error) {
    console.error("Error al obtener estadísticas de eventos:", error);
    throw error;
  }
};

const getAñosDisponibles = async () => {
  try {
    const response = await api.get("/eventos/años/");
    return response.data;
  } catch (error) {
    console.error("Error al obtener años disponibles:", error);
    throw error;
  }
};

const getTiposEvento = async () => {
  try {
    try {
      const response = await api.get("/tiposeventos/");
      return response.data.results || response.data;
    } catch (error) {
      console.log("Intentando con el endpoint alternativo para tipos de evento: " + error);
      const response = await api.get("/tipos-evento/");
      return response.data.results || response.data;
    }
  } catch (error) {
    console.error("Error al obtener tipos de evento:", error);
    return [];
  }
};

const getRolesEvento = async () => {
  try {
    try {
      const response = await api.get("/roleseventos/");
      return response.data.results || response.data;
    } catch (error) {
      console.log(
        "Intentando con el endpoint alternativo para tipos de evento: " + error
      );
      const response = await api.get("/roles-evento/");
      return response.data.results || response.data;
    }
  } catch (error) {
    console.error("Error al obtener roles de evento:", error);
    return [];
  }
};

export const eventoService = {
  getEventos,
  getEvento,
  createEvento,
  updateEvento,
  deleteEvento,
  getInvestigadoresEvento,
  getEstadisticasEventos,
  getAñosDisponibles,
  getTiposEvento,
  getRolesEvento,
};

export default eventoService;
