import api from "../apiConfig";
 
const getEstudiantes = async (page = 1, pageSize = 10, filters = {}) => {
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
      `Solicitando estudiantes (página ${page}, ${pageSize} por página)...`
    );
 
    const response = await api.get(`/estudiantes/?${params.toString()}`);
    console.log("Respuesta de estudiantes:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en getEstudiantes:", error);
    throw error;
  }
};
 
const getEstudiante = async (id) => {
  try {
    const response = await api.get(`/estudiantes/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener estudiante con ID ${id}:`, error);
    throw error;
  }
};
 
const createEstudiante = async (data) => {
  try {
    const response = await api.post("/estudiantes/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear estudiante:", error);
    throw error;
  }
};
 
const updateEstudiante = async (id, data) => {
  try {
    const response = await api.put(`/estudiantes/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar estudiante con ID ${id}:`, error);
    throw error;
  }
};
 
const deleteEstudiante = async (id) => {
  try {
    await api.delete(`/estudiantes/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar estudiante con ID ${id}:`, error);
    throw error;
  }
};
 
export const estudianteService = {
  getEstudiantes,
  getEstudiante,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
};