import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import api from "../../../../api/apiConfig";
import { investigadorService } from "../../../../api/services/investigadorService";

function InvestigadorForm({ isOpen, onClose, investigador = null, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    celular: "",
    area: "",
    nivel_edu: "",
    especialidad: "",
    nivel_snii: "",
    fecha_asignacion_snii: "",
    activo: true,
    lineas_ids: [], // Seguiremos usando un array por compatibilidad con el backend
  });

  const [areas, setAreas] = useState([]);
  const [nivelesEdu, setNivelesEdu] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [nivelesSNII, setNivelesSNII] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);

  const normalizeId = (value) => {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === "object" && value !== null && "id" in value) {
      return parseInt(value.id, 10);
    }
    return parseInt(value, 10);
  };

  useEffect(() => {
    if (investigador) {
      console.log("Datos del investigador a editar:", investigador);

      // Obtener las líneas asociadas al investigador
      const fetchInvestigadorLineas = async () => {
        try {
          const response = await api.get(`/investigadores/${investigador.id}/`);
          const lineasData = response.data.lineas || [];
          // Solo tomamos la primera línea si existe
          const lineaId = lineasData.length > 0 ? lineasData[0].id : null;
          
          setFormData(prev => ({
            ...prev,
            lineas_ids: lineaId ? [lineaId] : []
          }));
        } catch (error) {
          console.error("Error al obtener líneas del investigador:", error);
        }
      };

      setFormData({
        nombre: investigador.nombre || "",
        correo: investigador.correo || "",
        celular: investigador.celular || "",
        area: normalizeId(investigador.area),
        nivel_edu: normalizeId(investigador.nivel_edu),
        especialidad: normalizeId(investigador.especialidad),
        nivel_snii: normalizeId(investigador.nivel_snii),
        fecha_asignacion_snii: investigador.fecha_asignacion_snii
          ? formatDateForInput(investigador.fecha_asignacion_snii)
          : "",
        activo: investigador.activo !== undefined ? investigador.activo : true,
        lineas_ids: [],
      });
      
      if (investigador.id) {
        fetchInvestigadorLineas();
      }
    } else {
      setFormData({
        nombre: "",
        correo: "",
        celular: "",
        area: "",
        nivel_edu: "",
        especialidad: "",
        nivel_snii: "",
        fecha_asignacion_snii: "",
        activo: true,
        lineas_ids: [],
      });
    }
  }, [investigador, isOpen]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    async function fetchCatalogos() {
      setFetchingData(true);
      setError(null);
      try {
        const [areasRes, nivelesEduRes, especialidadesRes, nivelesSNIIRes, lineasRes] =
          await Promise.all([
            api.get("/areas/?page_size=1000"),
            api.get("/niveleducacion/?page_size=1000"),
            api.get("/especialidades/?page_size=1000"),
            api.get("/nivelsnii/?page_size=1000"),
            api.get("/lineas/?page_size=1000"),
          ]);

        const areasData = areasRes.data.results || areasRes.data || [];
        const nivelesEduData =
          nivelesEduRes.data.results || nivelesEduRes.data || [];
        const especialidadesData =
          especialidadesRes.data.results || especialidadesRes.data || [];
        const nivelesSNIIData =
          nivelesSNIIRes.data.results || nivelesSNIIRes.data || [];
        const lineasData =
          lineasRes.data.results || lineasRes.data || [];

        const sortedAreas = Array.isArray(areasData)
          ? [...areasData].sort((a, b) => a.id - b.id)
          : [];

        const sortedNivelesEdu = Array.isArray(nivelesEduData)
          ? [...nivelesEduData].sort((a, b) => a.id - b.id)
          : [];

        const sortedEspecialidades = Array.isArray(especialidadesData)
          ? [...especialidadesData].sort((a, b) => a.id - b.id)
          : [];

        const sortedNivelesSNII = Array.isArray(nivelesSNIIData)
          ? [...nivelesSNIIData].sort((a, b) => a.id - b.id)
          : [];

        const sortedLineas = Array.isArray(lineasData)
          ? [...lineasData].sort((a, b) => a.nombre.localeCompare(b.nombre))
          : [];

        setAreas(sortedAreas);
        setNivelesEdu(sortedNivelesEdu);
        setEspecialidades(sortedEspecialidades);
        setNivelesSNII(sortedNivelesSNII);
        setLineas(sortedLineas);

        console.log("Catálogos cargados:", {
          areas: sortedAreas,
          nivelesEdu: sortedNivelesEdu,
          especialidades: sortedEspecialidades,
          nivelesSNII: sortedNivelesSNII,
          lineas: sortedLineas,
        });
      } catch (err) {
        console.error("Error al cargar catálogos:", err);
        if (err.response) {
          setError(
            `Error al cargar datos de referencia: ${
              err.response.status
            } - ${JSON.stringify(err.response.data)}`
          );
        } else if (err.request) {
          setError(
            "Error al cargar datos de referencia: No se recibió respuesta del servidor"
          );
        } else {
          setError(`Error al cargar datos de referencia: ${err.message}`);
        }
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

    if (["area", "nivel_edu", "especialidad", "nivel_snii"].includes(name)) {
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

  // Manejador específico para el cambio de línea
  const handleLineaChange = (e) => {
    const value = e.target.value;
    
    // Si selecciona una línea, la guardamos como un array con un solo elemento
    // Si selecciona la opción vacía, guardamos un array vacío
    setFormData(prev => ({
      ...prev,
      lineas_ids: value ? [parseInt(value, 10)] : []
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

      if (investigador) {
        result = await investigadorService.updateInvestigador(
          investigador.id,
          dataToSend
        );
      } else {
        result = await investigadorService.createInvestigador(dataToSend);
      }

      onSuccess(result);
    } catch (err) {
      console.error("Error al guardar investigador:", err);
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

  // Obtener el valor de la línea actual (si existe)
  const getCurrentLineaValue = () => {
    if (formData.lineas_ids && formData.lineas_ids.length > 0) {
      return formData.lineas_ids[0].toString();
    }
    return "";
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={investigador ? "Editar Investigador" : "Crear Investigador"}
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Correo
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Celular
              </label>
              <input
                type="text"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Área
              </label>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nivel Educación
              </label>
              <select
                name="nivel_edu"
                value={formData.nivel_edu || ""}
                onChange={handleChange}
                required
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Seleccionar Nivel --</option>
                {nivelesEdu.map((nivel) => (
                  <option key={nivel.id} value={nivel.id}>
                    {nivel.nivel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Especialidad
              </label>
              <select
                name="especialidad"
                value={formData.especialidad || ""}
                onChange={handleChange}
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Seleccionar Especialidad --</option>
                {especialidades.map((esp) => (
                  <option key={esp.id} value={esp.id}>
                    {esp.nombre_especialidad}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nivel SNII
              </label>
              <select
                name="nivel_snii"
                value={formData.nivel_snii || ""}
                onChange={handleChange}
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Seleccionar Nivel SNII --</option>
                {nivelesSNII.map((nivel) => (
                  <option key={nivel.id} value={nivel.id}>
                    {nivel.nivel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fecha Asignación SNII
              </label>
              <input
                type="date"
                name="fecha_asignacion_snii"
                value={formData.fecha_asignacion_snii || ""}
                onChange={handleChange}
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Línea de Investigación ocupando todo el ancho */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Línea de Investigación
              </label>
              <select
                value={getCurrentLineaValue()}
                onChange={handleLineaChange}
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Seleccionar Línea --</option>
                {lineas.map((linea) => (
                  <option key={linea.id} value={linea.id}>
                    {linea.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 pb-4 flex justify-center text-center">
            <input
              id="investigador-activo"
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="cursor-pointer h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600"
            />
            <label
              htmlFor="investigador-activo"
              className="ml-2 text-sm text-gray-300 cursor-pointer"
            >
              Investigador Activo
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

export default InvestigadorForm;