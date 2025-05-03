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

    console.log("Llamando a la API de tiposherramienta con parámetros:", params.toString());
    
    const response = await api.get(`/tiposherramienta/?${params.toString()}`);
    console.log("Respuesta de la API tiposherramienta:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en getTiposHerramienta:", error);
    return { results: [], count: 0, total_pages: 1, current_page: 1 };
  }
};

const getTipoHerramienta = async (id) => {
  try {
    const response = await api.get(`/tiposherramienta/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener tipo herramienta con ID ${id}:`, error);
    throw error;
  }
};

const createTipoHerramienta = async (data) => {
  try {
    const response = await api.post("/tiposherramienta/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear tipo herramienta:", error);
    throw error;
  }
};

const updateTipoHerramienta = async (id, data) => {
  try {
    const response = await api.put(`/tiposherramienta/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar tipo herramienta con ID ${id}:`, error);
    throw error;
  }
};

const deleteTipoHerramienta = async (id) => {
  try {
    await api.delete(`/tiposherramienta/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar tipo herramienta con ID ${id}:`, error);
    throw error;
  }
};

export const tipoherramientaService = {
  getTiposHerramienta,
  getTipoHerramienta,
  createTipoHerramienta,
  updateTipoHerramienta,
  deleteTipoHerramienta,
};

export default tipoherramientaService;