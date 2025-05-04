import api from "../apiConfig";

/**
 * Obtiene la lista de tipos de evento con paginación y filtros opcionales
 * @param {number} page - Número de página
 * @param {number} pageSize - Cantidad de elementos por página
 * @param {object} filters - Filtros a aplicar
 * @returns {Promise<object>} Respuesta paginada con los tipos de evento
 */
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

    const response = await api.get(`/tiposeventos/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en getTiposEvento:", error);
    throw error;
  }
};

/**
 * Obtiene un tipo de evento específico por su ID
 * @param {number} id - ID del tipo de evento
 * @returns {Promise<object>} Información del tipo de evento
 */
const getTipoEvento = async (id) => {
  try {
    const response = await api.get(`/tiposeventos/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener tipo de evento con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo tipo de evento
 * @param {object} data - Datos del tipo de evento a crear
 * @returns {Promise<object>} Tipo de evento creado
 */
const createTipoEvento = async (data) => {
  try {
    const response = await api.post("/tiposeventos/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear tipo de evento:", error);
    throw error;
  }
};

/**
 * Actualiza un tipo de evento existente
 * @param {number} id - ID del tipo de evento
 * @param {object} data - Datos actualizados del tipo de evento
 * @returns {Promise<object>} Tipo de evento actualizado
 */
const updateTipoEvento = async (id, data) => {
  try {
    const response = await api.put(`/tiposeventos/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar tipo de evento con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un tipo de evento
 * @param {number} id - ID del tipo de evento a eliminar
 * @returns {Promise<object>} Objeto con el estado de la operación
 */
const deleteTipoEvento = async (id) => {
  try {
    await api.delete(`/tiposeventos/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar tipo de evento con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de uso de los tipos de evento
 * @returns {Promise<array>} Estadísticas de tipos de evento
 */
const getTipoEventoStats = async () => {
  try {
    const response = await api.get('/tiposeventos/stats/');
    return response.data;
  } catch (error) {
    console.error("Error al obtener estadísticas de tipos de evento:", error);
    return [];
  }
};

export const tipoeventoService = {
  getTiposEvento,
  getTipoEvento,
  createTipoEvento,
  updateTipoEvento,
  deleteTipoEvento,
  getTipoEventoStats,
};

export default tipoeventoService;