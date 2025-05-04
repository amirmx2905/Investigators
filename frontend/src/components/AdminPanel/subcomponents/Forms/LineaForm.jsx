import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import { lineaService } from "../../../../api/services/lineaService";

function LineaForm({ isOpen, onClose, linea = null, onSuccess }) {
  // Estado simplificado
  const [formData, setFormData] = useState({
    nombre: "",
    reconocimiento_institucional: false,
    investigadores: [], // Mantener este campo aunque no esté en el formulario
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (linea) {
      console.log("Datos de la línea a editar:", linea);
      setFormData({
        nombre: linea.nombre || "",
        reconocimiento_institucional:
          linea.reconocimiento_institucional || false,
        investigadores: linea.investigadores || [], // Preservamos los investigadores existentes
      });
    } else {
      setFormData({
        nombre: "",
        reconocimiento_institucional: false,
        investigadores: [],
      });
    }
  }, [linea, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Creamos una copia del formData para enviar
      const dataToSend = {
        nombre: formData.nombre,
        reconocimiento_institucional: formData.reconocimiento_institucional,
      };
      if (!linea) {
        dataToSend.investigadores = formData.investigadores;
      }

      console.log("Datos a enviar:", dataToSend);

      let result;

      if (linea) {
        result = await lineaService.updateLinea(linea.id, dataToSend);
      } else {
        result = await lineaService.createLinea(dataToSend);
      }

      onSuccess(result);
    } catch (err) {
      console.error("Error al guardar línea de investigación:", err);
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
      title={
        linea ? "Editar Línea de Investigación" : "Crear Línea de Investigación"
      }
    >
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {fetchingData ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre de la línea */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nombre de la Línea de Investigación
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ingrese el nombre de la línea de investigación"
            />
          </div>

          {/* Reconocimiento Institucional */}
          <div className="flex items-center justify-center py-2">
            <div
              className="inline-flex items-center cursor-pointer"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  reconocimiento_institucional:
                    !prev.reconocimiento_institucional,
                }));
              }}
            >
              <input
                id="reconocimiento-institucional"
                type="checkbox"
                name="reconocimiento_institucional"
                checked={formData.reconocimiento_institucional}
                onChange={handleCheckboxChange}
                className="cursor-pointer h-5 w-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-600 focus:ring-offset-gray-800"
                onClick={(e) => e.stopPropagation()}
              />
              <label
                htmlFor="reconocimiento-institucional"
                className="ml-2 cursor-pointer text-sm text-gray-300 select-none"
              >
                Cuenta con reconocimiento institucional
              </label>
            </div>
          </div>

          {/* Botones de acción */}
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
              className={`cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition-colors ${
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

export default LineaForm;
