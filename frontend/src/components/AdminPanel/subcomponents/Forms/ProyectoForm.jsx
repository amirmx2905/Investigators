import React, { useState, useEffect, useRef } from "react";
import FormModal from "./FormModal";
import api from "../../../../api/apiConfig";
import { proyectoService } from "../../../../api/services/proyectoService";

function ProyectoForm({ isOpen, onClose, proyecto = null, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    explicacion: "",
    estado: "En Progreso",
    fecha_inicio: "",
    fecha_fin: "",
    lider: "",
  });

  const [investigadores, setInvestigadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLeaderName, setSelectedLeaderName] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    if (proyecto) {
      console.log("Datos recibidos del proyecto a editar:", proyecto);
      console.log("Tipo de dato del líder:", typeof proyecto.lider);
      console.log("Valor del líder:", proyecto.lider);

      setFormData({
        nombre: proyecto.nombre || "",
        explicacion:
          proyecto.explicacion !== undefined ? proyecto.explicacion : "",
        estado: proyecto.estado || "En Progreso",
        fecha_inicio: proyecto.fecha_inicio
          ? formatDateForInput(proyecto.fecha_inicio)
          : "",
        fecha_fin: proyecto.fecha_fin
          ? formatDateForInput(proyecto.fecha_fin)
          : "",
        lider: normalizeId(proyecto.lider),
      });

      console.log("Líder normalizado:", normalizeId(proyecto.lider));

      if (proyecto.lider_nombre) {
        setSelectedLeaderName(proyecto.lider_nombre);
      } else if (
        proyecto.lider &&
        typeof proyecto.lider === "object" &&
        proyecto.lider.nombre
      ) {
        setSelectedLeaderName(proyecto.lider.nombre);
      }
    } else {
      setFormData({
        nombre: "",
        explicacion: "",
        estado: "En Progreso",
        fecha_inicio: "",
        fecha_fin: "",
        lider: "",
      });
      setSelectedLeaderName("");
      setSearchTerm("");
    }
  }, [proyecto, isOpen]);

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

  const normalizeId = (value) => {
    if (value === null || value === undefined || value === "") return "";

    if (typeof value === "object" && value !== null) {
      if ("id" in value) {
        return parseInt(value.id, 10);
      }
      for (const key in value) {
        if (key === "id" || key === "ID" || key === "Id") {
          return parseInt(value[key], 10);
        }
      }
    }

    const parsedValue = parseInt(value, 10);
    return isNaN(parsedValue) ? "" : parsedValue;
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    async function fetchInvestigadores() {
      setFetchingData(true);
      setError(null);
      try {
        const response = await api.get("/investigadores/?page_size=1000");

        let data = response.data.results || response.data || [];

        if (!Array.isArray(data)) {
          console.warn("La respuesta no es un array:", data);
          data = [];
        }

        const sortedData = [...data].sort((a, b) => a.id - b.id);

        console.log("Investigadores cargados:", sortedData);
        setInvestigadores(sortedData);

        if (proyecto && proyecto.lider) {
          const liderId =
            typeof proyecto.lider === "object"
              ? proyecto.lider.id
              : proyecto.lider;
          const liderExiste = sortedData.some((inv) => inv.id === liderId);

          if (!liderExiste) {
            console.warn(
              `El líder con ID ${liderId} no está en la lista de investigadores cargados`
            );
            try {
              const liderResponse = await api.get(
                `/investigadores/${liderId}/`
              );
              const liderData = liderResponse.data;
              if (liderData && liderData.id) {
                console.log("Líder cargado individualmente:", liderData);
                setInvestigadores([liderData, ...sortedData]);
                setSelectedLeaderName(liderData.nombre);
              }
            } catch (liderErr) {
              console.error(
                `Error al cargar líder con ID ${liderId}:`,
                liderErr
              );
            }
          } else {
            const lider = sortedData.find((inv) => inv.id === liderId);
            if (lider && lider.nombre) {
              setSelectedLeaderName(lider.nombre);
            }
          }
        }
      } catch (err) {
        console.error("Error al cargar investigadores:", err);
        if (err.response) {
          setError(
            `Error al cargar investigadores: ${
              err.response.status
            } - ${JSON.stringify(err.response.data)}`
          );
        } else if (err.request) {
          setError(
            "Error al cargar investigadores: No se recibió respuesta del servidor"
          );
        } else {
          setError(`Error al cargar investigadores: ${err.message}`);
        }
      } finally {
        setFetchingData(false);
      }
    }

    if (isOpen) {
      fetchInvestigadores();
    }
  }, [isOpen, proyecto]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "lider") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? null : parseInt(value, 10),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectLeader = (investigador) => {
    const { id, nombre } = investigador;
    setSelectedLeaderName(nombre);
    setSearchTerm("");
    setShowDropdown(false);

    setFormData((prev) => ({
      ...prev,
      lider: id,
    }));
  };

  const handleClearLeaderSelection = () => {
    setSelectedLeaderName("");
    setSearchTerm("");

    setFormData((prev) => ({
      ...prev,
      lider: "",
    }));
  };

  const getFilteredLeaders = () => {
    return investigadores.filter((inv) =>
      inv.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (
        formData.fecha_fin &&
        formData.fecha_inicio &&
        new Date(formData.fecha_fin) < new Date(formData.fecha_inicio)
      ) {
        throw new Error(
          "La fecha de fin debe ser posterior a la fecha de inicio"
        );
      }
      const dataToSend = { ...formData };
      if (dataToSend.fecha_fin === "") {
        dataToSend.fecha_fin = null;
      }

      if (dataToSend.lider === "") {
        dataToSend.lider = null;
      }

      console.log("Datos a enviar:", dataToSend);

      let result;

      if (proyecto) {
        result = await proyectoService.updateProyecto(proyecto.id, dataToSend);
      } else {
        result = await proyectoService.createProyecto(dataToSend);
      }

      onSuccess(result);
    } catch (err) {
      console.error("Error al guardar proyecto:", err);
      let errorMsg = err.message || "Error al guardar proyecto.";

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

  const filteredLeaders = getFilteredLeaders();

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={proyecto ? "Editar Proyecto" : "Crear Proyecto"}
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
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nombre del Proyecto
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
              Líder de Proyecto
            </label>
            <div ref={searchRef} className="relative">
              {/* Si hay un valor seleccionado, mostrar el nombre */}
              {selectedLeaderName ? (
                <div className="flex items-center justify-between px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                  <span>{selectedLeaderName}</span>
                  <button
                    type="button"
                    onClick={handleClearLeaderSelection}
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
                /* Si no hay selección, mostrar campo de búsqueda */
                <div>
                  <input
                    type="text"
                    placeholder="Buscar investigador..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                  />

                  {/* Dropdown de resultados */}
                  {showDropdown && (
                    <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredLeaders.length > 0 ? (
                        filteredLeaders.map((investigador) => (
                          <div
                            key={investigador.id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-gray-200"
                            onClick={() => handleSelectLeader(investigador)}
                          >
                            {investigador.nombre}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-400">
                          {searchTerm
                            ? "No se encontraron resultados"
                            : "Escribe para buscar investigadores"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Explicación
            </label>
            <textarea
              name="explicacion"
              value={formData.explicacion}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="En Progreso">En progreso</option>
              <option value="Completado">Completado</option>
              <option value="Suspendido">Suspendido</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

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
                required
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fecha de Fin (Opcional)
              </label>
              <input
                type="date"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleChange}
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              />
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

export default ProyectoForm;
