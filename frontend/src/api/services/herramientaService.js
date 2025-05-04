import api from "../apiConfig";

/**
 * Obtiene la lista de herramientas con paginación y filtros opcionales
 * @param {number} page - Número de página
 * @param {number} pageSize - Cantidad de elementos por página
 * @param {object} filters - Filtros a aplicar
 * @returns {Promise<object>} Respuesta paginada con las herramientas
 */
const getHerramientas = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/herramientas/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en getHerramientas:", error);
    throw error;
  }
};

/**
 * Obtiene una herramienta específica por su ID
 * @param {number} id - ID de la herramienta
 * @returns {Promise<object>} Información de la herramienta
 */
const getHerramienta = async (id) => {
  try {
    const response = await api.get(`/herramientas/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener herramienta con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crea una nueva herramienta
 * @param {object} data - Datos de la herramienta a crear
 * @returns {Promise<object>} Herramienta creada
 */
const createHerramienta = async (data) => {
  try {
    const response = await api.post("/herramientas/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear herramienta:", error);
    throw error;
  }
};

/**
 * Actualiza una herramienta existente
 * @param {number} id - ID de la herramienta
 * @param {object} data - Datos actualizados de la herramienta
 * @returns {Promise<object>} Herramienta actualizada
 */
const updateHerramienta = async (id, data) => {
  try {
    const response = await api.put(`/herramientas/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar herramienta con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina una herramienta
 * @param {number} id - ID de la herramienta a eliminar
 * @returns {Promise<object>} Objeto con el estado de la operación
 */
const deleteHerramienta = async (id) => {
  try {
    await api.delete(`/herramientas/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar herramienta con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene herramientas por tipo
 * @param {number} tipoId - ID del tipo de herramienta
 * @returns {Promise<array>} Lista de herramientas
 */
const getHerramientasPorTipo = async (tipoId) => {
  try {
    const response = await api.get(`/herramientas/?tipo_herramienta_id=${tipoId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener herramientas por tipo ${tipoId}:`, error);
    throw error;
  }
};

export const herramientaService = {
  getHerramientas,
  getHerramienta,
  createHerramienta,
  updateHerramienta,
  deleteHerramienta,
  getHerramientasPorTipo,
};

export default herramientaService;