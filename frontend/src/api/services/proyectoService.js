import api from "../apiConfig";

const getProyectos = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/proyectos/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en getProyectos:", error);
    throw error;
  }
};

const getProyecto = async (id) => {
  try {
    const response = await api.get(`/proyectos/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener proyecto con ID ${id}:`, error);
    throw error;
  }
};

const createProyecto = async (data) => {
  try {
    const response = await api.post("/proyectos/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    throw error;
  }
};

const updateProyecto = async (id, data) => {
  try {
    const response = await api.put(`/proyectos/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar proyecto con ID ${id}:`, error);
    throw error;
  }
};

const deleteProyecto = async (id) => {
  try {
    await api.delete(`/proyectos/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar proyecto con ID ${id}:`, error);
    throw error;
  }
};

const getHerramientasProyecto = async (id) => {
  try {
    const response = await api.get(`/proyectos/${id}/herramientas/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener herramientas del proyecto ${id}:`, error);
    throw error;
  }
};

export const proyectoService = {
  getProyectos,
  getProyecto,
  createProyecto,
  updateProyecto,
  deleteProyecto,
  getHerramientasProyecto,
};
