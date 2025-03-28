import api from "../apiConfig";

const getUsuarios = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    
    const params = new URLSearchParams();

    // Pa la pagination.py
    params.append("page", page);
    params.append("page_size", pageSize);

    // Pa añadir filtros adicionales si los llega a pedir el profe
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    console.log(
      `Solicitando usuarios (página ${page}, ${pageSize} por página)...`
    );

    const response = await api.get(`/usuarios/?${params.toString()}`);
    console.log("Respuesta de usuarios:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en getUsuarios:", error);
    throw error;
  }
};

const getUsuario = async (id) => {
  try {
    const response = await api.get(`/usuarios/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${id}:`, error);
    throw error;
  }
};

const createUsuario = async (data) => {
  try {
    const response = await api.post("/usuarios/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

const updateUsuario = async (id, data) => {
  try {
    const response = await api.put(`/usuarios/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${id}:`, error);
    throw error;
  }
};

const deleteUsuario = async (id) => {
  try {
    await api.delete(`/usuarios/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${id}:`, error);
    throw error;
  }
};

export const usuarioService = {
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
