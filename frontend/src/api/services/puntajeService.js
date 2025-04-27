import api from "../apiConfig";

export const puntajeService = {
  // Obtener todos los puntajes
  getAll: async () => {
    try {
      const response = await api.get("/puntajes/");
      return response.data;
    } catch (error) {
      console.error("Error obteniendo puntajes:", error);
      throw error;
    }
  },

  // Obtener un puntaje específico por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/puntajes/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo puntaje ${id}:`, error);
      throw error;
    }
  },

  // Obtener resumen por área
  getResumenPorArea: async () => {
    try {
      const response = await api.get("/puntajes/resumen_por_area/");
      return response.data;
    } catch (error) {
      console.error("Error obteniendo resumen por área:", error);
      throw error;
    }
  },

  // Obtener estadísticas por categoría
  getStatsPorCategoria: async (categoria) => {
    try {
      const response = await api.get(
        `/puntajes/stats_por_categoria/?categoria=${categoria}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo estadísticas para ${categoria}:`, error);
      throw error;
    }
  },

  // Recalcular todos los puntajes
  recalcularTodos: async () => {
    try {
      const response = await api.post("/puntajes/recalcular_todos/");
      return response.data;
    } catch (error) {
      console.error("Error recalculando puntajes:", error);
      throw error;
    }
  },

  // Recalcular puntaje de un investigador específico
  recalcularInvestigador: async (id) => {
    try {
      const response = await api.post(`/puntajes/${id}/recalcular/`);
      return response.data;
    } catch (error) {
      console.error(
        `Error recalculando puntaje para investigador ${id}:`,
        error
      );
      throw error;
    }
  },
};

export default puntajeService;
