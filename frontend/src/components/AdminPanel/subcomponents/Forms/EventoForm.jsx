import React, { useState, useEffect, useRef } from "react";
import { eventoService } from "../../../../api/services/eventoService";
import { investigadorService } from "../../../../api/services/investigadorService";
import FormModal from "./FormModal";

function EventoForm({ isOpen, onClose, evento = null, onSuccess }) {
  const isEdit = !!evento?.id;
  const [formData, setFormData] = useState({
    nombre_evento: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    lugar: "",
    empresa_invita: "",
    tipo_evento: "",
  });
  
  // Estados para listas de datos
  const [tiposEvento, setTiposEvento] = useState([]);
  const [rolesEvento, setRolesEvento] = useState([]);
  const [investigadores, setInvestigadores] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  
  // Estados para UI
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState(null);
  const [participantesError, setParticipantesError] = useState(null);
  
  // Para gestionar la búsqueda y selección de investigadores
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRol, setSelectedRol] = useState("");
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Formatear fecha para input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];
  };

  // Efecto para cerrar el dropdown cuando se hace clic fuera
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

  // Cargar datos iniciales
  useEffect(() => {
    async function fetchData() {
      setFetchingData(true);
      setError(null);
      setParticipantesError(null);
      
      try {
        // Intentar cargar todos los catálogos de manera independiente
        let tiposRes = [];
        let rolesRes = [];
        let investigadoresRes = { results: [] };

        try {
          tiposRes = await eventoService.getTiposEvento();
        } catch (err) {
          console.error("Error al cargar tipos de evento:", err);
        }

        try {
          rolesRes = await eventoService.getRolesEvento();
        } catch (err) {
          console.error("Error al cargar roles de evento:", err);
        }

        try {
          investigadoresRes = await investigadorService.getInvestigadores(1, 1000, { activo: true });
        } catch (err) {
          console.error("Error al cargar investigadores:", err);
        }

        // Asignar datos a estados (incluso si algunos fallan)
        setTiposEvento(tiposRes || []);
        setRolesEvento(rolesRes || []);
        setInvestigadores(investigadoresRes?.results || investigadoresRes || []);

        // Si es edición, cargar datos del evento
        if (isEdit && evento?.id) {
          try {
            const eventoCompleto = await eventoService.getEvento(evento.id);
            
            setFormData({
              nombre_evento: eventoCompleto.nombre_evento || "",
              descripcion: eventoCompleto.descripcion || "",
              fecha_inicio: eventoCompleto.fecha_inicio ? formatDateForInput(eventoCompleto.fecha_inicio) : "",
              fecha_fin: eventoCompleto.fecha_fin ? formatDateForInput(eventoCompleto.fecha_fin) : "",
              lugar: eventoCompleto.lugar || "",
              empresa_invita: eventoCompleto.empresa_invita || "",
              tipo_evento: eventoCompleto.tipo_evento?.id || eventoCompleto.tipo_evento || "",
            });
            
            // Cargar participantes del evento
            if (eventoCompleto.investigadores) {
              setParticipantes(eventoCompleto.investigadores.map(inv => ({
                investigador_id: inv.investigador_id,
                rol_evento_id: inv.rol_evento_id,
                nombre: inv.nombre,
                correo: inv.correo,
                rol_nombre: inv.rol_nombre
              })));
            }
          } catch (err) {
            console.error(`Error al cargar evento ${evento.id}:`, err);
            // No establecemos el error aquí para permitir que el formulario siga funcionando
          }
        } else {
          // Para un nuevo evento, inicializar con fecha actual
          const today = new Date().toISOString().split('T')[0];
          setFormData(prev => ({
            ...prev,
            fecha_inicio: today
          }));
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        // Mostrar un mensaje más detallado para depuración
        setError(`Error al cargar los datos necesarios: ${err.message || "Error desconocido"}. Por favor, intente más tarde.`);
      } finally {
        setFetchingData(false);
      }
    }

    if (isOpen) {
      fetchData();
    } else {
      // Limpiar estado al cerrar
      setFormData({
        nombre_evento: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        lugar: "",
        empresa_invita: "",
        tipo_evento: "",
      });
      setParticipantes([]);
      setSearchTerm("");
      setSelectedRol("");
      setError(null);
      setParticipantesError(null);
    }
  }, [isOpen, isEdit, evento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filtrar investigadores según el término de búsqueda
  const getFilteredInvestigadores = () => {
    if (!searchTerm.trim()) return [];
    
    // Excluir los investigadores que ya están añadidos como participantes
    const investigadoresDisponibles = investigadores.filter(
      inv => !participantes.some(p => p.investigador_id === inv.id)
    );
    
    // Filtrar por término de búsqueda
    return investigadoresDisponibles.filter(
      inv => inv.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10); // Limitamos a 10 resultados para mejor rendimiento
  };

  const handleSelectInvestigador = (investigador) => {
    // Si no hay rol seleccionado, mostrar error específico de participantes
    if (!selectedRol) {
      setParticipantesError("Por favor seleccione un rol antes de agregar un participante");
      return;
    }

    // Limpiar el error de participantes si existe
    setParticipantesError(null);

    const rol = rolesEvento.find(r => r.id === parseInt(selectedRol));
    
    // Agregar el investigador a la lista de participantes
    setParticipantes(prev => [
      ...prev,
      {
        investigador_id: investigador.id,
        rol_evento_id: parseInt(selectedRol),
        nombre: investigador.nombre,
        correo: investigador.correo || "",
        rol_nombre: rol ? rol.nombre : "Rol desconocido"
      }
    ]);
    
    // Limpiar búsqueda pero mantener rol seleccionado
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemoveParticipante = (investigadorId) => {
    setParticipantes(prev => 
      prev.filter(p => p.investigador_id !== investigadorId)
    );
  };

  // Función para asegurar formato YYYY-MM-DD para las fechas
  const formatDateForServer = (dateString) => {
    if (!dateString) return null;
    
    try {
      // Convertir a formato ISO sin la parte de tiempo
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      
      // Tomar solo la parte YYYY-MM-DD del formato ISO
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error("Error al formatear fecha:", e);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre_evento || !formData.tipo_evento) {
      setError("Por favor complete los campos obligatorios (nombre y tipo de evento)");
      return;
    }

    // Verificar que la fecha de fin sea posterior a la fecha de inicio
    if (formData.fecha_inicio && formData.fecha_fin) {
      const inicio = new Date(formData.fecha_inicio);
      const fin = new Date(formData.fecha_fin);
      
      if (fin < inicio) {
        setError("La fecha de fin debe ser posterior a la fecha de inicio");
        return;
      }
    }

    setLoading(true);
    setError(null);
    setParticipantesError(null);

    try {
      // Preparar datos para enviar al servidor asegurando el formato correcto de fechas
      const datosEvento = {
        ...formData,
        fecha_inicio: formatDateForServer(formData.fecha_inicio),
        fecha_fin: formatDateForServer(formData.fecha_fin),
        investigadores: participantes.map(p => ({
          investigador_id: p.investigador_id,
          rol_evento_id: p.rol_evento_id
        }))
      };

      let result;

      if (isEdit) {
        result = await eventoService.updateEvento(evento.id, datosEvento);
        console.log("Evento actualizado exitosamente:", result);
      } else {
        result = await eventoService.createEvento(datosEvento);
        console.log("Evento creado exitosamente:", result);
      }

      // Asegurarnos de llamar a onSuccess con la acción correcta
      if (typeof onSuccess === 'function') {
        onSuccess({
          ...result,
          action: isEdit ? 'update' : 'create',
          message: isEdit ? 'Evento actualizado con éxito' : 'Evento creado con éxito'
        });
      }
      
      // Cerrar el modal solo si la operación tuvo éxito
      onClose();
    } catch (err) {
      console.error("Error al guardar el evento:", err);
      
      let errorMsg = err.message || "Error al guardar el evento.";

      if (err.response) {
        const serverErrors = err.response.data;
        console.error("Detalles del error:", serverErrors);

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

  // Lista filtrada de investigadores para el dropdown
  const filteredInvestigadores = getFilteredInvestigadores();

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Editar Evento" : "Crear Evento"}
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre del evento*
              </label>
              <input
                type="text"
                name="nombre_evento"
                value={formData.nombre_evento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tipo de evento*
              </label>
              <select
                name="tipo_evento"
                value={formData.tipo_evento}
                onChange={handleChange}
                required
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">-- Seleccionar tipo --</option>
                {tiposEvento.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fecha de inicio
              </label>
              <input
                type="date"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fecha de fin
              </label>
              <input
                type="date"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleChange}
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Lugar
              </label>
              <input
                type="text"
                name="lugar"
                value={formData.lugar}
                onChange={handleChange}
                placeholder="Presencial o Virtual"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Empresa/Institución
              </label>
              <input
                type="text"
                name="empresa_invita"
                value={formData.empresa_invita}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Participantes</h3>
            
            {participantesError && (
              <div className="mb-3 p-2 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
                {participantesError}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              {/* Selección de rol - primera */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Rol del participante
                </label>
                <select
                  value={selectedRol}
                  onChange={(e) => {
                    setSelectedRol(e.target.value);
                    // Limpiar error de participantes si el usuario selecciona un rol
                    if (e.target.value) {
                      setParticipantesError(null);
                    }
                  }}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:ring-purple-500 focus:border-purple-500 ${
                    participantesError ? "border-red-500" : "border-gray-600"
                  }`}
                >
                  <option value="">--Escoger Rol--</option>
                  {rolesEvento.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo de búsqueda interactiva - más grande */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Buscar investigador
                </label>
                <div ref={searchRef} className="relative">
                  <input
                    type="text"
                    placeholder="Escriba para buscar investigadores..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (e.target.value.trim()) {
                        setShowDropdown(true);
                      } else {
                        setShowDropdown(false);
                      }
                    }}
                    onFocus={() => {
                      if (searchTerm.trim()) {
                        setShowDropdown(true);
                      }
                    }}
                    className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
                  />
                  
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        setShowDropdown(false);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}

                  {/* Dropdown de resultados */}
                  {showDropdown && (
                    <div 
                      ref={dropdownRef} 
                      className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    >
                      {filteredInvestigadores.length > 0 ? (
                        filteredInvestigadores.map((investigador) => (
                          <button
                            key={investigador.id}
                            type="button"
                            className="w-full px-4 py-2 text-left cursor-pointer hover:bg-gray-700 text-gray-200 flex items-center justify-between"
                            onClick={() => handleSelectInvestigador(investigador)}
                            onMouseDown={(e) => e.preventDefault()} // Evita que el input pierda el foco antes del clic
                          >
                            <div>
                              <span className="block">{investigador.nombre}</span>
                            </div>
                            {selectedRol && (
                              <span className="text-xs bg-purple-900/40 text-purple-300 py-0.5 px-2 rounded-full">
                                {rolesEvento.find(r => r.id === parseInt(selectedRol))?.nombre || ""}
                              </span>
                            )}
                          </button>
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
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
              {participantes.length > 0 ? (
                <ul className="divide-y divide-gray-700">
                  {participantes.map((p) => (
                    <li
                      key={p.investigador_id}
                      className="px-4 py-3 flex items-center justify-between hover:bg-gray-700/30"
                    >
                      <div>
                        <span className="text-gray-200">{p.nombre}</span>
                        <span className="ml-2 bg-purple-900/40 text-purple-300 text-xs py-0.5 px-2 rounded-full">
                          {p.rol_nombre}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveParticipante(p.investigador_id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  No hay participantes agregados
                </div>
              )}
            </div>
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
              className={`cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      )}
    </FormModal>
  );
}

export default EventoForm;