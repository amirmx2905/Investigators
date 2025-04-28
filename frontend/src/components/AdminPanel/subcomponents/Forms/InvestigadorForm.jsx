import React, { useState, useEffect, useRef } from "react";
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
    lineas_ids: [],
  });

  const [areas, setAreas] = useState([]);
  const [nivelesEdu, setNivelesEdu] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [nivelesSNII, setNivelesSNII] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);

  const [lineaSearch, setLineaSearch] = useState("");
  const [showLineasDropdown, setShowLineasDropdown] = useState(false);
  const [selectedLineas, setSelectedLineas] = useState([]);
  const lineasRef = useRef(null);

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

      const fetchInvestigadorLineas = async () => {
        try {
          const response = await api.get(`/investigadores/${investigador.id}/`);
          const lineasData = response.data.lineas || [];
          const lineasIds = lineasData.map((linea) => linea.id);

          setFormData((prev) => ({
            ...prev,
            lineas_ids: lineasIds,
          }));

          setSelectedLineas(lineasData);
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
      setSelectedLineas([]);
    }
  }, [investigador, isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (lineasRef.current && !lineasRef.current.contains(event.target)) {
        setShowLineasDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        const [
          areasRes,
          nivelesEduRes,
          especialidadesRes,
          nivelesSNIIRes,
          lineasRes,
        ] = await Promise.all([
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
        const lineasData = lineasRes.data.results || lineasRes.data || [];

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

  // Función para filtrar líneas disponibles
  const getFilteredLineas = () => {
    return lineas.filter(
      (l) =>
        l.nombre.toLowerCase().includes(lineaSearch.toLowerCase()) &&
        !formData.lineas_ids.includes(l.id)
    );
  };

  // Función para agregar una línea
  const handleSelectLinea = (linea) => {
    if (!formData.lineas_ids.includes(linea.id)) {
      const updatedIds = [...formData.lineas_ids, linea.id];
      setFormData((prev) => ({
        ...prev,
        lineas_ids: updatedIds,
      }));
      setSelectedLineas((prev) => [...prev, linea]);
    }
    setLineaSearch("");
    setShowLineasDropdown(false);
  };

  // Función para eliminar una línea
  const handleRemoveLinea = (id) => {
    const updatedIds = formData.lineas_ids.filter((lId) => lId !== id);
    setFormData((prev) => ({
      ...prev,
      lineas_ids: updatedIds,
    }));
    setSelectedLineas((prev) => prev.filter((l) => l.id !== id));
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

            {/* Líneas de Investigación - Selectores múltiples */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Líneas de Investigación
              </label>
              <div className="mb-3 relative">
                <input
                  type="text"
                  placeholder="Buscar y agregar líneas..."
                  value={lineaSearch}
                  onChange={(e) => {
                    setLineaSearch(e.target.value);
                    setShowLineasDropdown(true);
                  }}
                  onFocus={() => setShowLineasDropdown(true)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                />

                {showLineasDropdown && (
                  <div
                    ref={lineasRef}
                    className="absolute z-40 mt-1 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-y-auto"
                  >
                    <div className="py-1">
                      {lineaSearch.length > 0 ? (
                        getFilteredLineas().length > 0 ? (
                          getFilteredLineas().map((linea) => (
                            <div
                              key={linea.id}
                              onClick={() => handleSelectLinea(linea)}
                              className="cursor-pointer px-4 py-2 hover:bg-gray-700 text-gray-200"
                            >
                              {linea.nombre}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-400">
                            No se encontraron líneas disponibles
                          </div>
                        )
                      ) : (
                        <div className="px-4 py-2 text-gray-400">
                          Escribe para buscar líneas
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Lista de líneas seleccionadas */}
              {selectedLineas.length > 0 && (
                <div className="mt-2 bg-gray-800/50 rounded-md p-2">
                  <div className="text-sm text-gray-300 mb-2">
                    Líneas de investigación seleccionadas:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedLineas.map((linea) => (
                      <div
                        key={linea.id}
                        className="bg-purple-900/40 text-purple-200 px-2 py-1 rounded-md text-xs flex items-center"
                      >
                        <span>{linea.nombre || `Línea #${linea.id}`}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLinea(linea.id)}
                          className="ml-2 text-purple-300 hover:text-purple-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
