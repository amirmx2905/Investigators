import api from "../apiConfig";

/**
 * Obtiene la lista de carreras con paginación y filtros opcionales
 */
const getCarreras = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    console.log(
      `Solicitando carreras (página ${page}, ${pageSize} por página)...`
    );

    const response = await api.get(`/carreras/?${params.toString()}`);
    console.log("Respuesta de carreras:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en getCarreras:", error);
    throw error;
  }
};

/**
 * Obtiene una carrera por su ID
 */
const getCarrera = async (id) => {
  try {
    const response = await api.get(`/carreras/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener carrera con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crea una nueva carrera
 */
const createCarrera = async (data) => {
  try {
    const response = await api.post("/carreras/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear carrera:", error);
    throw error;
  }
};

/**
 * Actualiza una carrera existente
 */
const updateCarrera = async (id, data) => {
  try {
    const response = await api.put(`/carreras/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar carrera con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina una carrera
 */
const deleteCarrera = async (id) => {
  try {
    await api.delete(`/carreras/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar carrera con ID ${id}:`, error);
    throw error;
  }
};

export const carreraService = {
  getCarreras,
  getCarrera,
  createCarrera,
  updateCarrera,
  deleteCarrera,
};