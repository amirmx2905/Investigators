import api from "../apiConfig";

const getNivelesEducacion = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/niveles-educacion/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en getNivelesEducacion:", error);
    throw error;
  }
};

const getNivelEducacion = async (id) => {
  try {
    const response = await api.get(`/niveles-educacion/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener nivel de educación con ID ${id}:`, error);
    throw error;
  }
};

const createNivelEducacion = async (data) => {
  try {
    const response = await api.post("/niveles-educacion/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear nivel de educación:", error);
    throw error;
  }
};

const updateNivelEducacion = async (id, data) => {
  try {
    const response = await api.put(`/niveles-educacion/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar nivel de educación con ID ${id}:`, error);
    throw error;
  }
};

const deleteNivelEducacion = async (id) => {
  try {
    await api.delete(`/niveles-educacion/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar nivel de educación con ID ${id}:`, error);
    throw error;
  }
};

export const niveleseducacionService = {
  getNivelesEducacion,
  getNivelEducacion,
  createNivelEducacion,
  updateNivelEducacion,
  deleteNivelEducacion,
};

export default niveleseducacionService;