import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import api from "../../../../api/apiConfig";
import { usuarioService } from "../../../../api/services/usuarioService";

function UsuarioForm({ isOpen, onClose, usuario = null, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    contrasena: "",
    rol: "estudiante",
    investigador: null,
    estudiante: null,
    activo: true,
  });

  const [investigadores, setInvestigadores] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre_usuario: usuario.nombre_usuario || "",
        contrasena: "",
        rol: usuario.rol || "estudiante",
        investigador: usuario.investigador || null,
        estudiante: usuario.estudiante || null,
        activo: usuario.activo !== undefined ? usuario.activo : true,
      });
    } else {
      setFormData({
        nombre_usuario: "",
        contrasena: "",
        rol: "estudiante",
        investigador: null,
        estudiante: null,
        activo: true,
      });
    }
  }, [usuario, isOpen]);

  useEffect(() => {
    async function fetchData() {
      setFetchingData(true);
      setError(null);
      try {
        // Solicitar una cantidad grande de registros por página para asegurar que se carguen todos
        const [invResponse, estResponse] = await Promise.all([
          api.get("/investigadores/?page_size=1000"),
          api.get("/estudiantes/?page_size=1000"),
        ]);

        // Obtener los resultados y ordenarlos por ID
        const invData = invResponse.data.results || invResponse.data || [];
        const estData = estResponse.data.results || estResponse.data || [];

        // Ordenar por ID para asegurar que los registros con ID 1 aparezcan primero
        const sortedInv = Array.isArray(invData)
          ? [...invData].sort((a, b) => a.id - b.id)
          : [];

        const sortedEst = Array.isArray(estData)
          ? [...estData].sort((a, b) => a.id - b.id)
          : [];

        setInvestigadores(sortedInv);
        setEstudiantes(sortedEst);

        console.log("Investigadores cargados:", sortedInv);
        console.log("Estudiantes cargados:", sortedEst);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        if (err.response) {
          setError(
            `Error al cargar datos: ${err.response.status} - ${JSON.stringify(
              err.response.data
            )}`
          );
        } else if (err.request) {
          setError(
            "Error al cargar datos: No se recibió respuesta del servidor"
          );
        } else {
          setError(`Error al cargar datos: ${err.message}`);
        }
      } finally {
        setFetchingData(false);
      }
    }

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "investigador" || name === "estudiante") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? null : parseInt(value, 10),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleRolChange = (e) => {
    const rol = e.target.value;
    setFormData((prev) => ({
      ...prev,
      rol,
      investigador: rol === "investigador" ? prev.investigador : null,
      estudiante: rol === "estudiante" ? prev.estudiante : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;

      const dataToSend = { ...formData };
      if (usuario && !dataToSend.contrasena) {
        delete dataToSend.contrasena;
      }

      console.log("Datos a enviar:", dataToSend);

      if (usuario) {
        result = await usuarioService.updateUsuario(usuario.id, dataToSend);
      } else {
        result = await usuarioService.createUsuario(dataToSend);
      }

      onSuccess(result);
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      let errorMsg = err.message || "Error al guardar. Revisa los datos.";

      // Si hay un error de respuesta del servidor, mostrar detalles adicionales
      if (err.response) {
        const serverErrors = err.response.data;
        console.error("Detalles del error del servidor:", serverErrors);

        // Formatear errores de validación del backend
        if (typeof serverErrors === "object") {
          const errorDetails = Object.entries(serverErrors)
            .map(
              ([campo, mensaje]) =>
                `${campo}: ${
                  Array.isArray(mensaje) ? mensaje.join(", ") : mensaje
                }`
            )
            .join("; ");

          if (errorDetails) {
            errorMsg += ` Detalles: ${errorDetails}`;
          }
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={usuario ? "Editar Usuario" : "Crear Usuario"}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {fetchingData ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nombre de Usuario
            </label>
            <input
              type="text"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Contraseña {usuario && "(Dejar vacío para mantener la actual)"}
            </label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required={!usuario}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Rol
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleRolChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="admin">Administrador</option>
              <option value="investigador">Investigador</option>
              <option value="estudiante">Estudiante</option>
            </select>
          </div>

          {formData.rol === "investigador" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Vincular a Investigador
              </label>
              <select
                name="investigador"
                value={formData.investigador || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Seleccionar Investigador --</option>
                {investigadores.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.rol === "estudiante" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Vincular a Estudiante
              </label>
              <select
                name="estudiante"
                value={formData.estudiante || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Seleccionar Estudiante --</option>
                {estudiantes.map((est) => (
                  <option key={est.id} value={est.id}>
                    {est.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-4 pb-4 flex justify-center text-center">
            <input
              id="usuario-activo"
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="cursor-pointer h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600"
            />
            <label
              htmlFor="usuario-activo"
              className="ml-2 text-sm text-gray-300 cursor-pointer"
            >
              Usuario Activo
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      )}
    </FormModal>
  );
}

export default UsuarioForm;
