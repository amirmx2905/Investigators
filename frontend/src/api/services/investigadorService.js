import api from "../apiConfig";

const getInvestigadores = async (page = 1, pageSize = 10, filters = {}) => {
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
      `Solicitando investigadores (página ${page}, ${pageSize} por página)...`
    );

    const response = await api.get(`/investigadores/?${params.toString()}`);
    console.log("Respuesta de investigadores:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en getInvestigadores:", error);
    throw error;
  }
};

const getInvestigador = async (id) => {
  try {
    const response = await api.get(`/investigadores/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener investigador con ID ${id}:`, error);
    throw error;
  }
};

const createInvestigador = async (data) => {
  try {
    const response = await api.post("/investigadores/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear investigador:", error);
    throw error;
  }
};

const updateInvestigador = async (id, data) => {
  try {
    const response = await api.put(`/investigadores/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar investigador con ID ${id}:`, error);
    throw error;
  }
};

const deleteInvestigador = async (id) => {
  try {
    await api.delete(`/investigadores/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar investigador con ID ${id}:`, error);
    throw error;
  }
};

export const investigadorService = {
  getInvestigadores,
  getInvestigador,
  createInvestigador,
  updateInvestigador,
  deleteInvestigador,
};
