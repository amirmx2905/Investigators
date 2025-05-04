import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import { areaService } from "../../../../api/services/areaService";
import api from "../../../../api/apiConfig";
import { showNotification } from "../../utils/notificationsUtils";

function AreaForm({ isOpen, onClose, area = null, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    unidad: "",
  });

  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);
  const [unidadError, setUnidadError] = useState(false);

  const normalizeId = (value) => {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === "object" && value !== null && "id" in value) {
      return parseInt(value.id, 10);
    }
    return parseInt(value, 10);
  };

  useEffect(() => {
    if (area) {
      console.log("Datos del área a editar:", area);

      setFormData({
        nombre: area.nombre || "",
        unidad: normalizeId(area.unidad),
      });
    } else {
      setFormData({
        nombre: "",
        unidad: "",
      });
    }
  }, [area, isOpen]);

  const fetchUnidades = async () => {
    setUnidadError(false);
    try {
      const unidadesRes = await api.get("/unidades/?page_size=1000");
      const unidadesData = unidadesRes.data.results || unidadesRes.data || [];
      
      const sortedUnidades = Array.isArray(unidadesData)
        ? [...unidadesData].sort((a, b) => a.nombre.localeCompare(b.nombre))
        : [];
      
      setUnidades(sortedUnidades);
      console.log("Unidades cargadas:", sortedUnidades);
      return true;
    } catch (err) {
      console.error("Error al cargar unidades:", err);
      setUnidadError(true);
      return false;
    }
  };

  useEffect(() => {
    async function fetchCatalogos() {
      if (!isOpen) return;
      
      setFetchingData(true);
      setError(null);
      
      try {
        const unidadesSuccess = await fetchUnidades();

        if (!unidadesSuccess) {
          setError("Hubo un problema al cargar los datos de referencia. Algunas opciones pueden no estar disponibles.");
        }
      } catch (err) {
        console.error("Error al cargar catálogos:", err);
        setError(
          "Error al cargar datos de referencia. Por favor, inténtalo de nuevo más tarde."
        );
      } finally {
        setFetchingData(false);
      }
    }

    if (isOpen) {
      fetchCatalogos();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "unidad") {
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

  const handleRetryUnidades = () => {
    fetchUnidades();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = { ...formData };
      
      console.log("Datos a enviar:", dataToSend);

      let result;

      if (area) {
        result = await areaService.updateArea(
          area.id,
          dataToSend
        );
      } else {
        result = await areaService.createArea(dataToSend);
      }

      showNotification(`Área ${area ? 'actualizada' : 'creada'} correctamente`);
      onSuccess(result);
    } catch (err) {
      console.error("Error al guardar área:", err);
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
      title={area ? "Editar Área" : "Nueva Área"}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {fetchingData ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre del Área
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-teal-500 focus:border-teal-500"
                placeholder="Nombre del área"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Unidad
              </label>
              {unidadError ? (
                <div className="mb-2">
                  <div className="p-3 bg-red-900/30 border border-red-500/30 rounded text-red-200 text-sm mb-2">
                    Error al cargar las unidades. Por favor, inténtalo de nuevo.
                  </div>
                  <button
                    type="button"
                    onClick={handleRetryUnidades}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-500"
                  >
                    Reintentar
                  </button>
                </div>
              ) : (
                <select
                  name="unidad"
                  value={formData.unidad || ""}
                  onChange={handleChange}
                  required
                  className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">-- Seleccionar Unidad --</option>
                  {unidades.map((unidad) => (
                    <option key={unidad.id} value={unidad.id}>
                      {unidad.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>
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
              disabled={loading || unidadError}
              className={`cursor-pointer px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500 transition-colors ${
                (loading || unidadError) ? "opacity-70 cursor-not-allowed" : ""
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

export default AreaForm;