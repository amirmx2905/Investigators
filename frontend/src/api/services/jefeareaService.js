import api from '../apiConfig';

export const jefeareaService = {
  /**
   * Obtener todos los jefes de área con paginación opcional
   */
  getJefesAreas: async (page = 1, pageSize = 10, params = {}) => {
    try {
      const response = await api.get('/jefesareas/', {
        params: {
          page,
          page_size: pageSize,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener jefes de área:', error);
      throw error;
    }
  },

  /**
   * Obtener un jefe de área por su ID
   */
  getJefeAreaById: async (id) => {
    try {
      const response = await api.get(`/jefesareas/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener jefe de área con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo jefe de área
   */
  createJefeArea: async (jefeAreaData) => {
    try {
      const response = await api.post('/jefesareas/', jefeAreaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear jefe de área:', error);
      throw error;
    }
  },

  /**
   * Actualizar un jefe de área existente
   */
  updateJefeArea: async (id, jefeAreaData) => {
    try {
      const response = await api.patch(`/jefesareas/${id}/`, jefeAreaData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar jefe de área con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un jefe de área
   */
  deleteJefeArea: async (id) => {
    try {
      const response = await api.delete(`/jefesareas/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar jefe de área con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener jefes de área activos
   */
  getJefesAreasActivos: async () => {
    try {
      const response = await api.get('/jefesareas/', {
        params: {
          activo: true,
          page_size: 1000
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener jefes de área activos:', error);
      throw error;
    }
  }
};