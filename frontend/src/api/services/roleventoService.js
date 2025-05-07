import api from "../apiConfig";

/**
 * Servicio para interactuar con la API de RolEvento
 * Basado en el RolEventoViewSet del backend
 */

const getRolEventos = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/roleseventos/?${params.toString()}`);
    console.log("Respuesta de getRolEventos:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error en getRolEventos:", error);
    if (error.response) {
      console.error(`Error ${error.response.status}: ${error.response.statusText}`);
      console.error("Datos del error:", error.response.data);
    } else if (error.request) {
      console.error("No se recibió respuesta del servidor");
    } else {
      console.error("Error al configurar la solicitud:", error.message);
    }
    return { results: [], count: 0, total_pages: 1, current_page: 1 };
  }
};

const getRolEvento = async (id) => {
  try {
    const response = await api.get(`/roleseventos/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener rol de evento con ID ${id}:`, error);
    throw error;
  }
};

const createRolEvento = async (data) => {
  try {
    console.log("Creando nuevo rol de evento con datos:", data);
    const response = await api.post("/roleseventos/", data);
    console.log("Respuesta después de crear:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al crear rol de evento:", error);
    if (error.response) {
      console.error("Detalles del error:", error.response.data);
    }
    throw error;
  }
};

const updateRolEvento = async (id, data) => {
  try {
    console.log(`Actualizando rol de evento ${id} con datos:`, data);
    const response = await api.put(`/roleseventos/${id}/`, data);
    console.log("Respuesta después de actualizar:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar rol de evento con ID ${id}:`, error);
    if (error.response) {
      console.error("Detalles del error:", error.response.data);
    }
    throw error;
  }
};

const deleteRolEvento = async (id) => {
  try {
    await api.delete(`/roleseventos/${id}/`);
    console.log(`Rol de evento ${id} eliminado correctamente`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar rol de evento con ID ${id}:`, error);
    if (error.response) {
      console.error("Detalles del error:", error.response.data);
    }
    throw error;
  }
};

const getRolEventoStats = async () => {
  try {
    const response = await api.get('/roleseventos/stats/');
    return response.data;
  } catch (error) {
    console.error("Error al obtener estadísticas de roles de eventos:", error);
    return [];
  }
};

export const roleventoService = {
  getRolEventos,
  getRolEvento,
  createRolEvento,
  updateRolEvento,
  deleteRolEvento,
  getRolEventoStats,
};

export default roleventoService;
