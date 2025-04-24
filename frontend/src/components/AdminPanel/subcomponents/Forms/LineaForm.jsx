import React, { useState, useEffect, useRef } from "react";
import FormModal from "./FormModal";
import api from "../../../../api/apiConfig";
import { lineaService } from "../../../../api/services/lineaService";

function LineaForm({ isOpen, onClose, linea = null, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    investigadores: []
  });

  const [investigadores, setInvestigadores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedInvestigadores, setSelectedInvestigadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (linea) {
      console.log("Datos de la línea a editar:", linea);
      setFormData({
        nombre: linea.nombre || "",
        investigadores: []
      });

      // Si tenemos un ID, obtenemos los investigadores asociados a esta línea
      if (linea.id) {
        fetchLineaInvestigadores(linea.id);
      }
    } else {
      setFormData({
        nombre: "",
        investigadores: []
      });
      setSelectedInvestigadores([]);
    }
  }, [linea, isOpen]);

  const fetchLineaInvestigadores = async (lineaId) => {
    try {
      const response = await api.get(`/lineas-investigacion/${lineaId}/investigadores/`);
      const investigadoresData = response.data || [];
      const investigadoresIds = investigadoresData.map(inv => inv.id);
      
      setFormData(prev => ({
        ...prev,
        investigadores: investigadoresIds
      }));
      
      setSelectedInvestigadores(investigadoresData);
    } catch (error) {
      console.error("Error al obtener investigadores de la línea:", error);
    }
  };

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
    async function fetchInvestigadores() {
      setFetchingData(true);
      setError(null);
      try {
        const response = await api.get("/investigadores/?page_size=1000&activo=true");
        const investigadoresData = response.data.results || response.data || [];
        
        const sortedInvestigadores = Array.isArray(investigadoresData)
          ? [...investigadoresData].sort((a, b) => a.nombre.localeCompare(b.nombre))
          : [];

        setInvestigadores(sortedInvestigadores);
        console.log("Investigadores cargados:", sortedInvestigadores);
      } catch (err) {
        console.error("Error al cargar investigadores:", err);
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
      fetchInvestigadores();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectInvestigador = (item) => {
    if (!formData.investigadores.includes(item.id)) {
      const updatedInvestigadores = [...formData.investigadores, item.id];
      const updatedSelected = [...selectedInvestigadores, item];
      
      setFormData(prev => ({
        ...prev,
        investigadores: updatedInvestigadores
      }));
      
      setSelectedInvestigadores(updatedSelected);
    }
    
    setSearchTerm("");
    setShowDropdown(false);
  };
  
  const handleRemoveInvestigador = (id) => {
    const updatedInvestigadores = formData.investigadores.filter(invId => invId !== id);
    const updatedSelected = selectedInvestigadores.filter(inv => inv.id !== id);
    
    setFormData(prev => ({
      ...prev,
      investigadores: updatedInvestigadores
    }));
    
    setSelectedInvestigadores(updatedSelected);
  };
  
  const getFilteredInvestigadores = () => {
    return investigadores.filter(inv => 
      inv.nombre.toLowerCase().includes(searchTerm.toLowerCase()) && 
      !formData.investigadores.includes(inv.id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = { ...formData };
      console.log("Datos a enviar:", dataToSend);

      let result;

      if (linea) {
        result = await lineaService.updateLinea(linea.id, dataToSend);
      } else {
        result = await lineaService.createLinea(dataToSend);
      }

      onSuccess(result);
    } catch (err) {
      console.error("Error al guardar línea de investigación:", err);
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
      title={linea ? "Editar Línea de Investigación" : "Crear Línea de Investigación"}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {fetchingData ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre de la línea */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nombre de la Línea de Investigación
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ingrese el nombre de la línea de investigación"
            />
          </div>

          {/* Investigadores */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Investigadores
            </label>
            <div ref={searchRef} className="relative">
              <input
                type="text"
                placeholder="Buscar investigadores..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
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
          </div>

          {/* Investigadores seleccionados */}
          {selectedInvestigadores.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Investigadores seleccionados:
              </h4>
              <div className="space-y-2">
                {selectedInvestigadores.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between px-3 py-2 bg-gray-700/60 border border-gray-600 rounded-md"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {inv.nombre.charAt(0).toUpperCase()}
                      </div>
                      <span className="ml-2 text-white">{inv.nombre}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveInvestigador(inv.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
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
                ))}
              </div>
            </div>
          )}

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
              className={`cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition-colors ${
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

export default LineaForm;