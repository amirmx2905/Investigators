import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import { roleventoService } from "../../../../api/services/roleventoService";

function RoleventoForm({ isOpen, onClose, rolevento = null, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (rolevento) {
      console.log("Datos del rol de evento a editar:", rolevento);
      setFormData({
        nombre: rolevento.nombre || ""
      });
    } else {
      setFormData({
        nombre: ""
      });
    }
  }, [rolevento, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = { ...formData };
      console.log("Datos a enviar al API:", dataToSend);

      let result;

      if (rolevento) {
        console.log(`Intentando actualizar rol de evento con ID ${rolevento.id}`);
        result = await roleventoService.updateRolEvento(
          rolevento.id,
          dataToSend
        );
        console.log("Respuesta del API (actualización):", result);
      } else {
        console.log("Intentando crear nuevo rol de evento");
        result = await roleventoService.createRolEvento(dataToSend);
        console.log("Respuesta del API (creación):", result);
      }

      onSuccess(result);
    } catch (err) {
      console.error("Error al guardar rol de evento:", err);
      
      // Log detallado del error
      if (err.response) {
        console.error("Respuesta de error del servidor:", {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
          headers: err.response.headers
        });
      }
      
      let errorMsg = err.message || "Error al guardar. Revisa los datos.";

      if (err.response) {
        const serverErrors = err.response.data;
        console.error("Detalles del error del servidor:", serverErrors);

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
      title={rolevento ? "Editar Rol de Evento" : "Crear Rol de Evento"}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Nombre del Rol
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Ponente, Organizador, Moderador"
          />
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
    </FormModal>
  );
}

export default RoleventoForm;