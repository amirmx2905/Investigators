import api from "../apiConfig";

const getEspecialidades = async (page = 1, pageSize = 10, filters = {}) => {
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
      `Solicitando especialidades (página ${page}, ${pageSize} por página)...`
    );

    const response = await api.get(`/especialidades/?${params.toString()}`);
    console.log("Respuesta de especialidades:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en getEspecialidades:", error);
    throw error;
  }
};


const getEspecialidad = async (id) => {
  try {
    const response = await api.get(`/especialidades/${id}/`); 
    return response.data;
  } catch (error) {
    console.error(`Error al obtener especialidad con ID ${id}:`, error);
    throw error;
  }
};


const createEspecialidad = async (data) => {
  try {
    const response = await api.post("/especialidades/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear especialidad:", error);
    throw error;
  }
};


const updateEspecialidad = async (id, data) => {
  try {
    const response = await api.put(`/especialidades/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar especialidad con ID ${id}:`, error);
    throw error;
  }
};

const deleteEspecialidad = async (id) => {
  try {
    await api.delete(`/especialidades/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar especialidad con ID ${id}:`, error);
    throw error;
  }
};

export const especialidadService = {
  getEspecialidades,
  getEspecialidad,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,
};