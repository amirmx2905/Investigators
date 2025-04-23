import api from "../apiConfig";

const getTiposEstudiante = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/tipos-estudiante/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en getTiposEstudiante:", error);
    throw error;
  }
};

const getTipoEstudiante = async (id) => {
  try {
    const response = await api.get(`/tipos-estudiante/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener tipo de estudiante con ID ${id}:`, error);
    throw error;
  }
};

const createTipoEstudiante = async (data) => {
  try {
    const response = await api.post("/tipos-estudiante/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear tipo de estudiante:", error);
    throw error;
  }
};

const updateTipoEstudiante = async (id, data) => {
  try {
    const response = await api.put(`/tipos-estudiante/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar tipo de estudiante con ID ${id}:`, error);
    throw error;
  }
};

const deleteTipoEstudiante = async (id) => {
  try {
    await api.delete(`/tipos-estudiante/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar tipo de estudiante con ID ${id}:`, error);
    throw error;
  }
};

const getEstudiantesPorTipo = async (id) => {
  try {
    const response = await api.get(`/tipos-estudiante/${id}/estudiantes/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener estudiantes del tipo ${id}:`, error);
    throw error;
  }
};

export const tipoestudianteService = {
  getTiposEstudiante,
  getTipoEstudiante,
  createTipoEstudiante,
  updateTipoEstudiante,
  deleteTipoEstudiante,
  getEstudiantesPorTipo,
};

export default tipoestudianteService;