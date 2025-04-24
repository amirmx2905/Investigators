import api from "../apiConfig";

const getTiposHerramienta = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/tipos-herramienta/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en getTiposHerramienta:", error);
    throw error;
  }
};

const getTipoHerramienta = async (id) => {
  try {
    const response = await api.get(`/tipos-herramienta/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener tipo de herramienta con ID ${id}:`, error);
    throw error;
  }
};

const createTipoHerramienta = async (data) => {
  try {
    const response = await api.post("/tipos-herramienta/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear tipo de herramienta:", error);
    throw error;
  }
};

const updateTipoHerramienta = async (id, data) => {
  try {
    const response = await api.put(`/tipos-herramienta/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar tipo de herramienta con ID ${id}:`, error);
    throw error;
  }
};

const deleteTipoHerramienta = async (id) => {
  try {
    await api.delete(`/tipos-herramienta/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar tipo de herramienta con ID ${id}:`, error);
    throw error;
  }
};

const getHerramientasPorTipo = async (id) => {
  try {
    const response = await api.get(`/tipos-herramienta/${id}/herramientas/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener herramientas del tipo ${id}:`, error);
    throw error;
  }
};

export const tipoherramientaService = {
  getTiposHerramienta,
  getTipoHerramienta,
  createTipoHerramienta,
  updateTipoHerramienta,
  deleteTipoHerramienta,
  getHerramientasPorTipo,
};

export default tipoherramientaService;