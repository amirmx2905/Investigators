import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import { nivelService } from "../../../../api/services/nivelService";

function NivelForm({ isOpen, onClose, nivel = null, onSuccess }) {
  const [formData, setFormData] = useState({
    nivel: "",
    descripcion: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (nivel) {
      console.log("Datos del nivel a editar:", nivel);
      setFormData({
        nivel: nivel.nivel || "",
        descripcion: nivel.descripcion || ""
      });
    } else {
      setFormData({
        nivel: "",
        descripcion: ""
      });
    }
  }, [nivel, isOpen]);

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
      console.log("Datos a enviar:", dataToSend);

      let result;

      if (nivel) {
        result = await nivelService.updateNivel(
          nivel.id,
          dataToSend
        );
      } else {
        result = await nivelService.createNivel(dataToSend);
      }

      onSuccess(result);
    } catch (err) {
      console.error("Error al guardar nivel:", err);
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
      title={nivel ? "Editar Nivel" : "Crear Nivel"}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Nombre del Nivel
          </label>
          <input
            type="text"
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Licenciatura, Maestría, Doctorado"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Descripción (opcional)
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descripción o notas adicionales sobre este nivel"
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

export default NivelForm;