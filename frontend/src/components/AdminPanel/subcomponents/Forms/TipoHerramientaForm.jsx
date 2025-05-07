import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import { tipoherramientaService } from "../../../../api/services/tipoherramientaService";
import { showNotification } from "../../utils/notificationsUtils";

function TipoHerramientaForm({ isOpen, onClose, tipoHerramienta = null, onSuccess }) {
  const isEdit = !!tipoHerramienta?.id;
  const [formData, setFormData] = useState({
    nombre: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && tipoHerramienta) {
      setFormData({
        nombre: tipoHerramienta.nombre || "",
      });
    } else if (isOpen) {
      setFormData({
        nombre: "",
      });
    }
  }, [isOpen, tipoHerramienta]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre del tipo de herramienta es obligatorio");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log("Enviando datos del formulario:", formData);
      
      if (isEdit) {
        await tipoherramientaService.updateTipoHerramienta(tipoHerramienta.id, formData);
      } else {
        await tipoherramientaService.createTipoHerramienta(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error al guardar tipo de herramienta:", err);
      setError(
        err.response?.data?.message ||
          "Ha ocurrido un error. Por favor intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Editar Tipo de Herramienta" : "Nuevo Tipo de Herramienta"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">
            Nombre del Tipo de Herramienta <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            value={formData.nombre}
            onChange={handleChange}
            autoComplete="off"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
            placeholder="Ej: Software de Análisis, Herramientas de Simulación"
            required
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
            className={`cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
            ) : isEdit ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </FormModal>
  );
}

export default TipoHerramientaForm;
