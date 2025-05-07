import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import { herramientaService } from "../../../../api/services/herramientaService";
import { tipoherramientaService } from "../../../../api/services/tipoherramientaService";
import { showNotification } from "../../utils/notificationsUtils";

function HerramientaForm({ isOpen, onClose, herramienta = null, onSuccess }) {
  const isEdit = !!herramienta?.id;
  const [formData, setFormData] = useState({
    nombre: "",
    tipo_herramienta_id: "",
  });
  
  const [tiposHerramienta, setTiposHerramienta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos de la herramienta si estamos en modo edición
  useEffect(() => {
    if (isOpen && herramienta) {
      setFormData({
        nombre: herramienta.nombre || "",
        tipo_herramienta_id: herramienta.tipo_herramienta_id || "",
      });
    } else if (isOpen) {
      setFormData({
        nombre: "",
        tipo_herramienta_id: "",
      });
    }
  }, [isOpen, herramienta]);

  // Cargar tipos de herramientas
  useEffect(() => {
    async function fetchTiposHerramienta() {
      if (!isOpen) return;
      
      setFetchingData(true);
      try {
        const response = await tipoherramientaService.getTiposHerramienta(1, 1000);
        const tipos = response.results || [];
        setTiposHerramienta(tipos);
      } catch (error) {
        console.error("Error al cargar tipos de herramienta:", error);
        setError("No se pudieron cargar los tipos de herramienta. Por favor, intenta de nuevo.");
      } finally {
        setFetchingData(false);
      }
    }

    fetchTiposHerramienta();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre de la herramienta es obligatorio");
      return false;
    }

    if (!formData.tipo_herramienta_id) {
      setError("Debes seleccionar un tipo de herramienta");
      return false;
    }
    
    // Validar que sea un valor numérico válido
    const tipoId = parseInt(formData.tipo_herramienta_id, 10);
    if (isNaN(tipoId) || tipoId <= 0) {
      setError("El tipo de herramienta seleccionado no es válido");
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
      // Crear una copia del objeto formData con tipo_herramienta_id como número entero
      const formDataToSend = {
        ...formData,
        tipo_herramienta_id: parseInt(formData.tipo_herramienta_id, 10)
      };

      if (isEdit) {
        await herramientaService.updateHerramienta(herramienta.id, formDataToSend);
      } else {
        await herramientaService.createHerramienta(formDataToSend);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error al guardar herramienta:", err);
      if (err.response?.data) {
        // Formatear errores del API
        const errorMessages = Object.entries(err.response.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join('. ');
        setError(errorMessages || "Ha ocurrido un error. Por favor intenta de nuevo.");
      } else {
        setError("Ha ocurrido un error. Por favor intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Editar Herramienta" : "Nueva Herramienta"}
    >
      {fetchingData ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">
              Nombre de la Herramienta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={formData.nombre}
              onChange={handleChange}
              autoComplete="off"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Python, MATLAB, Excel"
              required
            />
          </div>

          <div>
            <label htmlFor="tipo_herramienta_id" className="block text-sm font-medium text-gray-300 mb-1">
              Tipo de Herramienta <span className="text-red-500">*</span>
            </label>
            <select
              name="tipo_herramienta_id"
              id="tipo_herramienta_id"
              value={formData.tipo_herramienta_id}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Selecciona un tipo</option>
              {tiposHerramienta.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
            {tiposHerramienta.length === 0 && !fetchingData && (
              <p className="mt-1 text-sm text-yellow-500">
                No hay tipos de herramienta disponibles. Por favor, crea uno primero.
              </p>
            )}
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
              disabled={loading || tiposHerramienta.length === 0}
              className={`cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors ${
                (loading || tiposHerramienta.length === 0) ? "opacity-70 cursor-not-allowed" : ""
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
      )}
    </FormModal>
  );
}

export default HerramientaForm;
