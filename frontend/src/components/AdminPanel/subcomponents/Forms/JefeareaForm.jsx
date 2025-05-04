import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import api from "../../../../api/apiConfig";
import { jefeareaService } from "../../../../api/services/jefeareaService";

function JefeareaForm({ isOpen, onClose, jefeArea = null, onSuccess }) {
  const [formData, setFormData] = useState({
    investigador: "",
    area: "",
    fecha_inicio: "",
    fecha_fin: null,
    activo: true,
  });

  const [areas, setAreas] = useState([]);
  const [investigadores, setInvestigadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);
  const [areaError, setAreaError] = useState(false);
  const [investigadorError, setInvestigadorError] = useState(false);

  const normalizeId = (value) => {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === "object" && value !== null && "id" in value) {
      return parseInt(value.id, 10);
    }
    return parseInt(value, 10);
  };

  useEffect(() => {
    if (jefeArea) {
      console.log("Datos del jefe de área a editar:", jefeArea);

      setFormData({
        investigador: normalizeId(jefeArea.investigador),
        area: normalizeId(jefeArea.area),
        fecha_inicio: jefeArea.fecha_inicio
          ? formatDateForInput(jefeArea.fecha_inicio)
          : "",
        fecha_fin: jefeArea.fecha_fin
          ? formatDateForInput(jefeArea.fecha_fin)
          : "",
        activo: jefeArea.activo !== undefined ? jefeArea.activo : true,
      });
    } else {
      setFormData({
        investigador: "",
        area: "",
        fecha_inicio: "",
        fecha_fin: "",
        activo: true,
      });
    }
  }, [jefeArea, isOpen]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];
  };

  const fetchAreas = async () => {
    setAreaError(false);
    try {
      const areasRes = await api.get("/areas/?page_size=1000");
      const areasData = areasRes.data.results || areasRes.data || [];
      
      const sortedAreas = Array.isArray(areasData)
        ? [...areasData].sort((a, b) => a.nombre.localeCompare(b.nombre))
        : [];
      
      setAreas(sortedAreas);
      console.log("Áreas cargadas:", sortedAreas);
      return true;
    } catch (err) {
      console.error("Error al cargar áreas:", err);
      setAreaError(true);
      return false;
    }
  };

  const fetchInvestigadores = async () => {
    setInvestigadorError(false);
    try {
      const investigadoresRes = await api.get("/investigadores/?page_size=1000&activo=true");
      const investigadoresData =
        investigadoresRes.data.results || investigadoresRes.data || [];
      
      const sortedInvestigadores = Array.isArray(investigadoresData)
        ? [...investigadoresData].sort((a, b) => a.nombre.localeCompare(b.nombre))
        : [];
      
      setInvestigadores(sortedInvestigadores);
      console.log("Investigadores cargados:", sortedInvestigadores);
      return true;
    } catch (err) {
      console.error("Error al cargar investigadores:", err);
      setInvestigadorError(true);
      return false;
    }
  };

  useEffect(() => {
    async function fetchCatalogos() {
      if (!isOpen) return;
      
      setFetchingData(true);
      setError(null);
      
      try {
        const [areasSuccess, investigadoresSuccess] = await Promise.all([
          fetchAreas(),
          fetchInvestigadores()
        ]);

        if (!areasSuccess || !investigadoresSuccess) {
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

    if (["investigador", "area"].includes(name)) {
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

    // Si se marca como activo, limpiar fecha_fin
    if (name === "activo" && checked) {
      setFormData((prev) => ({
        ...prev,
        fecha_fin: "",
      }));
    }
  };

  const handleRetryAreas = () => {
    fetchAreas();
  };

  const handleRetryInvestigadores = () => {
    fetchInvestigadores();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = { ...formData };
      
      // Si está activo, asegurar que fecha_fin sea null
      if (dataToSend.activo) {
        dataToSend.fecha_fin = null;
      }
      
      // Si está vacío, convertir a null
      if (dataToSend.fecha_fin === "") {
        dataToSend.fecha_fin = null;
      }

      console.log("Datos a enviar:", dataToSend);

      let result;

      if (jefeArea) {
        result = await jefeareaService.updateJefeArea(
          jefeArea.id,
          dataToSend
        );
      } else {
        result = await jefeareaService.createJefeArea(dataToSend);
      }

      onSuccess(result);
    } catch (err) {
      console.error("Error al guardar jefe de área:", err);
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
      title={jefeArea ? "Editar Jefe de Área" : "Asignar Jefe de Área"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Área
              </label>
              {areaError ? (
                <div className="mb-2">
                  <div className="p-3 bg-red-900/30 border border-red-500/30 rounded text-red-200 text-sm mb-2">
                    Error al cargar las áreas. Por favor, inténtalo de nuevo.
                  </div>
                  <button
                    type="button"
                    onClick={handleRetryAreas}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-500"
                  >
                    Reintentar
                  </button>
                </div>
              ) : (
                <select
                  name="area"
                  value={formData.area || ""}
                  onChange={handleChange}
                  required
                  className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Seleccionar Área --</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Investigador
              </label>
              {investigadorError ? (
                <div className="mb-2">
                  <div className="p-3 bg-red-900/30 border border-red-500/30 rounded text-red-200 text-sm mb-2">
                    Error al cargar los investigadores. Por favor, inténtalo de nuevo.
                  </div>
                  <button
                    type="button"
                    onClick={handleRetryInvestigadores}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-500"
                  >
                    Reintentar
                  </button>
                </div>
              ) : (
                <select
                  name="investigador"
                  value={formData.investigador || ""}
                  onChange={handleChange}
                  required
                  className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Seleccionar Investigador --</option>
                  {investigadores.map((investigador) => (
                    <option key={investigador.id} value={investigador.id}>
                      {investigador.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fecha de inicio
              </label>
              <input
                type="date"
                name="fecha_inicio"
                value={formData.fecha_inicio || ""}
                onChange={handleChange}
                required
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {!formData.activo && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Fecha de fin
                </label>
                <input
                  type="date"
                  name="fecha_fin"
                  value={formData.fecha_fin || ""}
                  onChange={handleChange}
                  required={!formData.activo}
                  className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          <div className="pt-4 pb-4 flex justify-center text-center">
            <input
              id="jefearea-activo"
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="cursor-pointer h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600"
            />
            <label
              htmlFor="jefearea-activo"
              className="ml-2 text-sm text-gray-300 cursor-pointer"
            >
              Jefatura Activa
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
              disabled={loading || areaError || investigadorError}
              className={`cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors ${
                (loading || areaError || investigadorError) ? "opacity-70 cursor-not-allowed" : ""
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

export default JefeareaForm;