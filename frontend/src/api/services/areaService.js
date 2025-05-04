import api from "../apiConfig";

/**
 * Obtiene la lista de áreas con paginación y filtros opcionales
 * @param {number} page - Número de página
 * @param {number} pageSize - Cantidad de elementos por página
 * @param {object} filters - Filtros a aplicar
 * @returns {Promise<object>} Respuesta paginada con las áreas
 */
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

/**
 * Obtiene un área específica por su ID
 * @param {number} id - ID del área
 * @returns {Promise<object>} Información del área
 */
const getArea = async (id) => {
  try {
    const response = await api.get(`/areas/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener área con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crea una nueva área
 * @param {object} data - Datos del área a crear
 * @returns {Promise<object>} Área creada
 */
const createArea = async (data) => {
  try {
    const response = await api.post("/areas/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear área:", error);
    throw error;
  }
};

/**
 * Actualiza un área existente
 * @param {number} id - ID del área
 * @param {object} data - Datos actualizados del área
 * @returns {Promise<object>} Área actualizada
 */
const updateArea = async (id, data) => {
  try {
    const response = await api.put(`/areas/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar área con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un área
 * @param {number} id - ID del área a eliminar
 * @returns {Promise<object>} Objeto con el estado de la operación
 */
const deleteArea = async (id) => {
  try {
    await api.delete(`/areas/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar área con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene las jefaturas de un área específica
 * @param {number} id - ID del área
 * @returns {Promise<array>} Lista de jefaturas del área
 */
const getJefaturasArea = async (id) => {
  try {
    const response = await api.get(`/areas/${id}/jefaturas/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener jefaturas del área ${id}:`, error);
    throw error;
  }
};

export const areaService = {
  getAreas,
  getArea,
  createArea,
  updateArea,
  deleteArea,
  getJefaturasArea
};

export default areaService;