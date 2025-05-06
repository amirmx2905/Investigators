import api from "../apiConfig";

const getNiveles = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/niveleducacion/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en getNiveles:", error);
    return { results: [], count: 0, total_pages: 1, current_page: 1 };
  }
};

const getNivel = async (id) => {
  try {
    const response = await api.get(`/niveleducacion/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener nivel con ID ${id}:`, error);
    throw error;
  }
};

const createNivel = async (data) => {
  try {
    const response = await api.post("/niveleducacion/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear nivel:", error);
    throw error;
  }
};

const updateNivel = async (id, data) => {
  try {
    const response = await api.put(`/niveleducacion/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar nivel con ID ${id}:`, error);
    throw error;
  }
};

const deleteNivel = async (id) => {
  try {
    await api.delete(`/niveleducacion/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar nivel con ID ${id}:`, error);
    throw error;
  }
};

export const nivelService = {
  getNiveles,
  getNivel,
  createNivel,
  updateNivel,
  deleteNivel,
};

export default nivelService;
