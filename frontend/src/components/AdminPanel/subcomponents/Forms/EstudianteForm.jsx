import React, { useState, useEffect, useRef } from "react";
import FormModal from "./FormModal";
import api from "../../../../api/apiConfig";
import { estudianteService } from "../../../../api/services/estudianteService";

function EstudianteForm({ isOpen, onClose, estudiante = null, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    celular: "",
    tipo_estudiante: "",
    area: "",
    carrera: "",
    investigador: "",
    escuela: "",
    fecha_inicio: "",
    fecha_termino: "",
    activo: true,
    estatus: "", // Añadimos el campo de estatus al estado inicial
  });

  // Definimos las opciones de estatus
  const ESTATUS_OPTIONS = [
    { value: "", label: "Sin estatus" },
    { value: "Desertor", label: "Desertor" },
    { value: "Egresado", label: "Egresado" },
    { value: "Titulado", label: "Titulado" },
  ];

  const [areas, setAreas] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [tiposEstudiante, setTiposEstudiante] = useState([]);
  const [investigadores, setInvestigadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedInvestigador, setSelectedInvestigador] = useState("");
  const searchRef = useRef(null);

  const normalizeId = (value) => {
    if (value === null || value === undefined || value === "") return "";

    if (typeof value === "object" && value !== null && "id" in value) {
      return parseInt(value.id, 10);
    }

    return parseInt(value, 10);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (estudiante) {
      console.log("Datos del estudiante a editar:", estudiante);
      setFormData({
        nombre: estudiante.nombre || "",
        correo: estudiante.correo || "",
        celular: estudiante.celular || "",
        tipo_estudiante: normalizeId(estudiante.tipo_estudiante),
        area: normalizeId(estudiante.area),
        carrera: normalizeId(estudiante.carrera),
        investigador: normalizeId(estudiante.investigador),
        escuela: estudiante.escuela || "",
        fecha_inicio: estudiante.fecha_inicio
          ? formatDateForInput(estudiante.fecha_inicio)
          : "",
        fecha_termino: estudiante.fecha_termino
          ? formatDateForInput(estudiante.fecha_termino)
          : "",
        activo: estudiante.activo !== undefined ? estudiante.activo : true,
        estatus: estudiante.estatus || "",
      });

      if (
        estudiante.investigador &&
        typeof estudiante.investigador === "object"
      ) {
        setSelectedInvestigador(estudiante.investigador.nombre || "");
      }
    } else {
      setFormData({
        nombre: "",
        correo: "",
        celular: "",
        tipo_estudiante: "",
        area: "",
        carrera: "",
        investigador: "",
        escuela: "",
        fecha_inicio: "",
        fecha_termino: "",
        activo: true,
        estatus: "",
      });
      setSelectedInvestigador("");
      setSearchTerm("");
    }
  }, [estudiante, isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function fetchCatalogos() {
      setFetchingData(true);
      setError(null);
      try {
        const [areasRes, carrerasRes, tiposEstudianteRes, investigadoresRes] =
          await Promise.all([
            api.get("/areas/?page_size=1000"),
            api.get("/carreras/?page_size=1000"),
            api.get("/tiposestudiante/?page_size=1000"),
            api.get("/investigadores/?page_size=1000&activo=true"),
          ]);

        const areasData = areasRes.data.results || areasRes.data || [];
        const carrerasData = carrerasRes.data.results || carrerasRes.data || [];
        const tiposEstudianteData =
          tiposEstudianteRes.data.results || tiposEstudianteRes.data || [];
        const investigadoresData =
          investigadoresRes.data.results || investigadoresRes.data || [];

        const sortedAreas = Array.isArray(areasData)
          ? [...areasData].sort((a, b) => a.id - b.id)
          : [];

        const sortedCarreras = Array.isArray(carrerasData)
          ? [...carrerasData].sort((a, b) => a.id - b.id)
          : [];

        const sortedTiposEstudiante = Array.isArray(tiposEstudianteData)
          ? [...tiposEstudianteData].sort((a, b) => a.id - b.id)
          : [];

        const sortedInvestigadores = Array.isArray(investigadoresData)
          ? [...investigadoresData].sort((a, b) => a.id - b.id)
          : [];

        setAreas(sortedAreas);
        setCarreras(sortedCarreras);
        setTiposEstudiante(sortedTiposEstudiante);
        setInvestigadores(sortedInvestigadores);

        if (estudiante && estudiante.investigador) {
          const inv = sortedInvestigadores.find(
            (i) => i.id === normalizeId(estudiante.investigador)
          );
          if (inv) {
            setSelectedInvestigador(inv.nombre);
          }
        }

        console.log("Catálogos cargados:", {
          areas: sortedAreas,
          carreras: sortedCarreras,
          tiposEstudiante: sortedTiposEstudiante,
          investigadores: sortedInvestigadores,
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
  }, [isOpen, estudiante]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (["area", "carrera", "tipo_estudiante", "investigador"].includes(name)) {
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

    if (name === "estatus") {
      if (
        value === "Desertor" ||
        value === "Egresado" ||
        value === "Titulado"
      ) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          activo: false,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const handleSelectInvestigador = (item) => {
    const { id, nombre } = item;
    setSelectedInvestigador(nombre);
    setSearchTerm("");
    setShowDropdown(false);
    setFormData((prev) => ({ ...prev, investigador: id }));
  };

  const getFilteredInvestigadores = () => {
    return investigadores.filter((inv) =>
      inv.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleClearInvestigador = () => {
    setSelectedInvestigador("");
    setSearchTerm("");
    setFormData((prev) => ({ ...prev, investigador: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = { ...formData };

      if (dataToSend.fecha_inicio && dataToSend.fecha_termino) {
        if (
          new Date(dataToSend.fecha_termino) < new Date(dataToSend.fecha_inicio)
        ) {
          throw new Error(
            "La fecha de término debe ser posterior a la fecha de inicio"
          );
        }
      }

      if (dataToSend.fecha_inicio === "") {
        dataToSend.fecha_inicio = null;
      }

      if (dataToSend.fecha_termino === "") {
        dataToSend.fecha_termino = null;
      }

      console.log("Datos a enviar:", dataToSend);

      let result;

      if (estudiante) {
        result = await estudianteService.updateEstudiante(
          estudiante.id,
          dataToSend
        );
      } else {
        result = await estudianteService.createEstudiante(dataToSend);
      }

      onSuccess(result);
    } catch (err) {
      console.error("Error al guardar estudiante:", err);
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

  const filteredInvestigadores = getFilteredInvestigadores();

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={estudiante ? "Editar Estudiante" : "Crear Estudiante"}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {fetchingData ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre y Correo */}
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-emerald-500 focus:border-emerald-500"
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Celular y Tipo de Estudiante */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Celular
              </label>
              <input
                type="text"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tipo de Estudiante
              </label>
              <select
                name="tipo_estudiante"
                value={formData.tipo_estudiante || ""}
                onChange={handleChange}
                required
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">-- Seleccionar Tipo --</option>
                {tiposEstudiante.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Asesor */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Asesor
            </label>
            <div ref={searchRef} className="relative">
              {selectedInvestigador ? (
                <div className="flex items-center justify-between px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                  <span>{selectedInvestigador}</span>
                  <button
                    type="button"
                    onClick={handleClearInvestigador}
                    className="text-gray-400 hover:text-gray-200 ml-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Buscar asesor..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-emerald-500 focus:border-emerald-500"
                  />

                  {/* Dropdown de resultados */}
                  {showDropdown && searchTerm && (
                    <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredInvestigadores.length > 0 ? (
                        filteredInvestigadores.map((item) => (
                          <div
                            key={item.id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-gray-200"
                            onClick={() => handleSelectInvestigador(item)}
                          >
                            {item.nombre}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-400">
                          No se encontraron resultados
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Área y Carrera */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Área
              </label>
              <select
                name="area"
                value={formData.area || ""}
                onChange={handleChange}
                required
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-emerald-500 focus:border-emerald-500"
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
                Carrera
              </label>
              <select
                name="carrera"
                value={formData.carrera || ""}
                onChange={handleChange}
                required
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">-- Seleccionar Carrera --</option>
                {carreras.map((carrera) => (
                  <option key={carrera.id} value={carrera.id}>
                    {carrera.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Escuela */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Escuela
            </label>
            <input
              type="text"
              name="escuela"
              value={formData.escuela}
              onChange={handleChange}
              placeholder="Nombre de la escuela o institución"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Fecha de inicio y Fecha de término */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fecha de Inicio
              </label>
              <input
                type="date"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fecha de Término (Opcional)
              </label>
              <input
                type="date"
                name="fecha_termino"
                value={formData.fecha_termino}
                onChange={handleChange}
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Estatus */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Estatus del Estudiante
            </label>
            <select
              name="estatus"
              value={formData.estatus}
              onChange={handleChange}
              className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-emerald-500 focus:border-emerald-500"
            >
              {ESTATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-400">
              {formData.estatus
                ? `Al seleccionar ${formData.estatus}, el estudiante se marcará como inactivo.`
                : "Si el estudiante ha completado su carrera o ha dejado de estudiar, seleccione el estatus correspondiente."}
            </p>
          </div>

          {/* Estado */}
          <div className="pt-4 pb-4 flex justify-center text-center">
            <input
              id="estudiante-activo"
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              disabled={["Desertor", "Egresado", "Titulado"].includes(
                formData.estatus
              )}
              className={`cursor-pointer h-4 w-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-600 ${
                ["Desertor", "Egresado", "Titulado"].includes(formData.estatus)
                  ? "opacity-50"
                  : ""
              }`}
            />
            <label
              htmlFor="estudiante-activo"
              className={`ml-2 text-sm text-gray-300 cursor-pointer ${
                ["Desertor", "Egresado", "Titulado"].includes(formData.estatus)
                  ? "opacity-50"
                  : ""
              }`}
            >
              Estudiante Activo{" "}
              {["Desertor", "Egresado", "Titulado"].includes(
                formData.estatus
              ) && "(Deshabilitado por estatus)"}
            </label>
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
              className={`cursor-pointer px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 transition-colors ${
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

export default EstudianteForm;
