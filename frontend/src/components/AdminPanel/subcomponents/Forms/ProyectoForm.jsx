import React, { useState, useEffect, useRef } from "react";
import FormModal from "./FormModal";
import api from "../../../../api/apiConfig";
import { proyectoService } from "../../../../api/services/proyectoService";

function ProyectoForm({ isOpen, onClose, proyecto = null, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    estado: "En Progreso",
    explicacion: "",
    fecha_inicio: "",
    fecha_fin: "",
    lider: "",
    activo: true,
    herramientas_ids: [],
    investigadores_ids: [],
  });
  
  const [selectedLeaderName, setSelectedLeaderName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  
  const herramientasRef = useRef(null);
  const investigadoresRef = useRef(null);
  
  const [herramientaSearch, setHerramientaSearch] = useState("");
  const [investigadorSearch, setInvestigadorSearch] = useState("");
  
  const [showHerramientasDropdown, setShowHerramientasDropdown] = useState(false);
  const [showInvestigadoresDropdown, setShowInvestigadoresDropdown] = useState(false);
  
  const [investigadores, setInvestigadores] = useState([]);
  const [herramientas, setHerramientas] = useState([]);
  
  const [selectedHerramientas, setSelectedHerramientas] = useState([]);
  const [selectedInvestigadores, setSelectedInvestigadores] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return "";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const investigadoresRes = await api.get("/investigadores/?page_size=1000");
        setInvestigadores(investigadoresRes.data.results || []);
        
        const herramientasRes = await api.get("/herramientas/?page_size=1000");
        setHerramientas(herramientasRes.data.results || []);
        
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar datos. Por favor, intente de nuevo.");
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (proyecto) {
      const leaderName = 
        typeof proyecto.lider === 'object' && proyecto.lider ? 
          proyecto.lider.nombre : 
          investigadores.find(inv => inv.id === proyecto.lider)?.nombre || "";
      
      let estadoActualizado = proyecto.estado || "En Progreso";
      if (estadoActualizado === "Activo") {
        estadoActualizado = "En Progreso";
      }
      
      setFormData({
        nombre: proyecto.nombre || "",
        estado: estadoActualizado,
        explicacion: proyecto.explicacion || "",
        fecha_inicio: proyecto.fecha_inicio || "",
        fecha_fin: proyecto.fecha_fin || "",
        lider: typeof proyecto.lider === 'object' ? proyecto.lider.id : proyecto.lider,
        activo: proyecto.activo !== undefined ? proyecto.activo : true,
        herramientas_ids: [],
        investigadores_ids: [],
      });
      
      setSelectedLeaderName(leaderName);
      
      const loadProjectDetails = async () => {
        try {
          const response = await api.get(`/proyectos/${proyecto.id}/`);
          const projectData = response.data;
          
          if (projectData.herramientas && Array.isArray(projectData.herramientas)) {
            const herramientasIds = projectData.herramientas.map(h => 
              typeof h === 'object' ? h.id : h
            );
            
            setFormData(prev => ({
              ...prev,
              herramientas_ids: herramientasIds
            }));
            
            const selectedTools = herramientasIds.map(id => {
              const herramienta = herramientas.find(h => h.id === id);
              return herramienta || { id };
            });
            
            setSelectedHerramientas(selectedTools);
          }
          
          if (projectData.investigadores && Array.isArray(projectData.investigadores)) {
            const investigadoresIds = projectData.investigadores.map(i => 
              typeof i === 'object' ? i.id : i
            );
            
            setFormData(prev => ({
              ...prev,
              investigadores_ids: investigadoresIds
            }));
            
            const selectedInvs = investigadoresIds.map(id => {
              const investigador = investigadores.find(i => i.id === id);
              return investigador || { id };
            });
            
            setSelectedInvestigadores(selectedInvs);
          }
        } catch (err) {
          console.error("Error al cargar detalles del proyecto:", err);
        }
      };
      
      if (proyecto.id) {
        loadProjectDetails();
      }
    } else {
      setFormData({
        nombre: "",
        estado: "En Progreso",
        explicacion: "",
        fecha_inicio: "",
        fecha_fin: "",
        lider: "",
        activo: true,
        herramientas_ids: [],
        investigadores_ids: [],
      });
      setSelectedLeaderName("");
      setSearchTerm("");
      setSelectedHerramientas([]);
      setSelectedInvestigadores([]);
    }
  }, [proyecto, isOpen, herramientas, investigadores]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (herramientasRef.current && !herramientasRef.current.contains(event.target)) {
        setShowHerramientasDropdown(false);
      }
      if (investigadoresRef.current && !investigadoresRef.current.contains(event.target)) {
        setShowInvestigadoresDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // eslint-disable-next-line no-unused-vars
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
    return parseInt(value, 10);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
  
  const getFilteredHerramientas = () => {
    return herramientas.filter(h => 
      h.nombre.toLowerCase().includes(herramientaSearch.toLowerCase()) &&
      !formData.herramientas_ids.includes(h.id)
    );
  };
  
  const getFilteredInvestigadores = () => {
    return investigadores.filter(i => 
      i.nombre.toLowerCase().includes(investigadorSearch.toLowerCase()) &&
      !formData.investigadores_ids.includes(i.id) &&
      i.id !== formData.lider 
    );
  };
  
  const handleSelectHerramienta = (herramienta) => {
    if (!formData.herramientas_ids.includes(herramienta.id)) {
      const updatedIds = [...formData.herramientas_ids, herramienta.id];
      setFormData(prev => ({
        ...prev,
        herramientas_ids: updatedIds
      }));
      setSelectedHerramientas(prev => [...prev, herramienta]);
    }
    setHerramientaSearch("");
    setShowHerramientasDropdown(false);
  };
  
  const handleSelectInvestigador = (investigador) => {
    if (!formData.investigadores_ids.includes(investigador.id) && investigador.id !== formData.lider) {
      const updatedIds = [...formData.investigadores_ids, investigador.id];
      setFormData(prev => ({
        ...prev,
        investigadores_ids: updatedIds
      }));
      setSelectedInvestigadores(prev => [...prev, investigador]);
    }
    setInvestigadorSearch("");
    setShowInvestigadoresDropdown(false);
  };
  
  const handleRemoveHerramienta = (id) => {
    const updatedIds = formData.herramientas_ids.filter(hId => hId !== id);
    setFormData(prev => ({
      ...prev,
      herramientas_ids: updatedIds
    }));
    setSelectedHerramientas(prev => prev.filter(h => h.id !== id));
  };
  
  const handleRemoveInvestigador = (id) => {
    const updatedIds = formData.investigadores_ids.filter(iId => iId !== id);
    setFormData(prev => ({
      ...prev,
      investigadores_ids: updatedIds
    }));
    setSelectedInvestigadores(prev => prev.filter(i => i.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        fecha_inicio: formatDateForAPI(formData.fecha_inicio),
        fecha_fin: formData.fecha_fin ? formatDateForAPI(formData.fecha_fin) : null
      };
      
      if (
        dataToSend.fecha_fin &&
        dataToSend.fecha_inicio &&
        new Date(dataToSend.fecha_fin) < new Date(dataToSend.fecha_inicio)
      ) {
        throw new Error(
          "La fecha de fin debe ser posterior a la fecha de inicio."
        );
      }

      console.log("Enviando datos del proyecto:", dataToSend);

      let result;
      if (proyecto) {
        result = await proyectoService.updateProyecto(proyecto.id, dataToSend);
      } else {
        result = await proyectoService.createProyecto(dataToSend);
      }

      onSuccess(result);
    } catch (err) {
      console.error("Error al guardar proyecto:", err);
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
      title={proyecto ? "Editar Proyecto" : "Crear Proyecto"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2 bg-red-800/40 border border-red-700 rounded-md text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="En Progreso">En Progreso</option>
              <option value="Concluido">Concluido</option>
              <option value="Suspendido">Suspendido</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
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
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Fecha de Finalización (opcional)
            </label>
            <input
              type="date"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Líder de Proyecto*
          </label>
          <div className="relative">
            {selectedLeaderName ? (
              <div className="flex items-center w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                <span className="flex-grow truncate">{selectedLeaderName}</span>
                <button
                  type="button"
                  onClick={handleClearLeaderSelection}
                  className="cursor-pointer ml-2 text-gray-400 hover:text-gray-200"
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
                  placeholder="Buscar investigador..."
                  value={searchTerm}
                  onChange={(e) => { 
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {showDropdown && !selectedLeaderName && (
              <div
                ref={searchRef}
                className="absolute z-40 mt-1 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                <div className="py-1">
                  {searchTerm.length > 0 ? (
                    getFilteredLeaders().length > 0 ? (
                      getFilteredLeaders().map((investigador) => (
                        <div
                          key={investigador.id}
                          onClick={() => handleSelectLeader(investigador)}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-700 text-gray-200"
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
                    )
                  ) : (
                    <div className="px-4 py-2 text-gray-400">
                      Escribe para buscar investigadores
                    </div>
                  )}
                </div>
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

        {/* Sección de Herramientas */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Herramientas
          </label>
          <div className="mb-3 relative">
            <input
              type="text"
              placeholder="Buscar y agregar herramientas..."
              value={herramientaSearch}
              onChange={(e) => {
                setHerramientaSearch(e.target.value);
                setShowHerramientasDropdown(true);
              }}
              onFocus={() => setShowHerramientasDropdown(true)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            />
            
            {showHerramientasDropdown && (
              <div
                ref={herramientasRef}
                className="absolute z-40 mt-1 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                <div className="py-1">
                  {herramientaSearch.length > 0 ? (
                    getFilteredHerramientas().length > 0 ? (
                      getFilteredHerramientas().map((herramienta) => (
                        <div
                          key={herramienta.id}
                          onClick={() => handleSelectHerramienta(herramienta)}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-700 text-gray-200"
                        >
                          {herramienta.nombre}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-400">
                        No se encontraron herramientas
                      </div>
                    )
                  ) : (
                    <div className="px-4 py-2 text-gray-400">
                      Escribe para buscar herramientas
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Lista de herramientas seleccionadas */}
          {selectedHerramientas.length > 0 && (
            <div className="mt-2 bg-gray-800/50 rounded-md p-2">
              <div className="text-sm text-gray-300 mb-2">Herramientas seleccionadas:</div>
              <div className="flex flex-wrap gap-2">
                {selectedHerramientas.map((herramienta) => (
                  <div 
                    key={herramienta.id} 
                    className="bg-blue-900/40 text-blue-200 px-2 py-1 rounded-md text-xs flex items-center"
                  >
                    <span>{herramienta.nombre || `Herramienta #${herramienta.id}`}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHerramienta(herramienta.id)}
                      className="ml-2 text-blue-300 hover:text-blue-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Sección de Investigadores (colaboradores) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Investigadores Participantes
          </label>
          <div className="mb-3 relative">
            <input
              type="text"
              placeholder="Buscar y agregar investigadores..."
              value={investigadorSearch}
              onChange={(e) => {
                setInvestigadorSearch(e.target.value);
                setShowInvestigadoresDropdown(true);
              }}
              onFocus={() => setShowInvestigadoresDropdown(true)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            />
            
            {showInvestigadoresDropdown && (
              <div
                ref={investigadoresRef}
                className="absolute z-40 mt-1 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                <div className="py-1">
                  {investigadorSearch.length > 0 ? (
                    getFilteredInvestigadores().length > 0 ? (
                      getFilteredInvestigadores().map((investigador) => (
                        <div
                          key={investigador.id}
                          onClick={() => handleSelectInvestigador(investigador)}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-700 text-gray-200"
                        >
                          {investigador.nombre}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-400">
                        No se encontraron investigadores disponibles
                      </div>
                    )
                  ) : (
                    <div className="px-4 py-2 text-gray-400">
                      Escribe para buscar investigadores
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Lista de investigadores seleccionados */}
          {selectedInvestigadores.length > 0 && (
            <div className="mt-2 bg-gray-800/50 rounded-md p-2">
              <div className="text-sm text-gray-300 mb-2">Investigadores participantes:</div>
              <div className="flex flex-wrap gap-2">
                {selectedInvestigadores.map((investigador) => (
                  <div 
                    key={investigador.id} 
                    className="bg-green-900/40 text-green-200 px-2 py-1 rounded-md text-xs flex items-center"
                  >
                    <span>{investigador.nombre || `Investigador #${investigador.id}`}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInvestigador(investigador.id)}
                      className="ml-2 text-green-300 hover:text-green-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 pb-4 flex justify-center text-center">
          <input
            id="proyecto-activo"
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
            className="cursor-pointer h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600"
          />
          <label
            htmlFor="proyecto-activo"
            className="ml-2 text-sm text-gray-300 cursor-pointer"
          >
            Activo
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
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors disabled:bg-blue-800 disabled:text-blue-200 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Guardando...
              </span>
            ) : (
              "Guardar"
            )}
          </button>
        </div>
      </form>
    </FormModal>
  );
}

export default ProyectoForm;