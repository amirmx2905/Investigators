import React, { useState, useEffect, useRef } from "react";
import FormModal from "./FormModal";
import api from "../../../../api/apiConfig";
import { usuarioService } from "../../../../api/services/usuarioService";

function UsuarioForm({ isOpen, onClose, usuario = null, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    contrasena: "",
    confirmarContrasena: "", // Nuevo campo para confirmación
    rol: "investigador",
    investigador: null,
    estudiante: null,
    activo: true,
  });

  const [investigadores, setInvestigadores] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  // Estado para almacenar investigadores y estudiantes ya asignados a usuarios
  const [asignados, setAsignados] = useState({
    investigadores: [],
    estudiantes: []
  });
  
  // Estados para el buscador
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const searchRef = useRef(null);
  
  // Estado para errores de validación de contraseña
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre_usuario: usuario.nombre_usuario || "",
        contrasena: "",
        confirmarContrasena: "", // Limpiar también la confirmación
        rol: usuario.rol || "estudiante",
        investigador: usuario.investigador || null,
        estudiante: usuario.estudiante || null,
        activo: usuario.activo !== undefined ? usuario.activo : true,
      });
      
      // Si es edición, establecer el nombre seleccionado
      if (usuario.rol === 'investigador' && usuario.investigador) {
        const inv = investigadores.find(i => i.id === usuario.investigador);
        if (inv) setSelectedName(inv.nombre);
      } else if (usuario.rol === 'estudiante' && usuario.estudiante) {
        const est = estudiantes.find(e => e.id === usuario.estudiante);
        if (est) setSelectedName(est.nombre);
      }
    } else {
      setFormData({
        nombre_usuario: "",
        contrasena: "",
        confirmarContrasena: "",
        rol: "investigador",
        investigador: null,
        estudiante: null,
        activo: true,
      });
      setSelectedName('');
      setSearchTerm('');
    }
    
    // Limpiar error de contraseña al abrir/cerrar el modal
    setPasswordError("");
  }, [usuario, isOpen, investigadores, estudiantes]);

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

  useEffect(() => {
    async function fetchData() {
      setFetchingData(true);
      setError(null);
      try {
        // Solicitar una cantidad grande de registros por página para asegurar que se carguen todos
        const [invResponse, estResponse, usuariosResponse] = await Promise.all([
          api.get("/investigadores/?page_size=1000"),
          api.get("/estudiantes/?page_size=1000"),
          api.get("/usuarios/?page_size=1000") // Obtener todos los usuarios para verificar asignaciones
        ]);

        // Obtener los resultados y ordenarlos por ID
        const invData = invResponse.data.results || invResponse.data || [];
        const estData = estResponse.data.results || estResponse.data || [];
        const usuariosData = usuariosResponse.data.results || usuariosResponse.data || [];

        // Identificar investigadores y estudiantes ya asignados a un usuario
        const investigadoresAsignados = usuariosData
          .filter(u => u.rol === "investigador" && u.investigador !== null)
          .map(u => u.investigador);
        
        const estudiantesAsignados = usuariosData
          .filter(u => u.rol === "estudiante" && u.estudiante !== null)
          .map(u => u.estudiante);

        // Si estamos editando, debemos excluir el ID del usuario actual de la lista de asignados
        const invAsignadosFiltrados = usuario 
          ? investigadoresAsignados.filter(id => id !== usuario.investigador)
          : investigadoresAsignados;
        
        const estAsignadosFiltrados = usuario
          ? estudiantesAsignados.filter(id => id !== usuario.estudiante)
          : estudiantesAsignados;

        // Guardar la lista de asignados para referencia
        setAsignados({
          investigadores: invAsignadosFiltrados,
          estudiantes: estAsignadosFiltrados
        });

        // Ordenar por ID para asegurar que los registros con ID 1 aparezcan primero
        const sortedInv = Array.isArray(invData)
          ? [...invData].sort((a, b) => a.id - b.id)
          : [];

        const sortedEst = Array.isArray(estData)
          ? [...estData].sort((a, b) => a.id - b.id)
          : [];

        setInvestigadores(sortedInv);
        setEstudiantes(sortedEst);

        // Si estamos editando, establecer el nombre seleccionado
        if (usuario) {
          if (usuario.rol === 'investigador' && usuario.investigador) {
            const inv = sortedInv.find(i => i.id === usuario.investigador);
            if (inv) setSelectedName(inv.nombre);
          } else if (usuario.rol === 'estudiante' && usuario.estudiante) {
            const est = sortedEst.find(e => e.id === usuario.estudiante);
            if (est) setSelectedName(est.nombre);
          }
        }

        console.log("Investigadores cargados:", sortedInv);
        console.log("Estudiantes cargados:", sortedEst);
        console.log("Investigadores ya asignados:", invAsignadosFiltrados);
        console.log("Estudiantes ya asignados:", estAsignadosFiltrados);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        if (err.response) {
          setError(
            `Error al cargar datos: ${err.response.status} - ${JSON.stringify(
              err.response.data
            )}`
          );
        } else if (err.request) {
          setError(
            "Error al cargar datos: No se recibió respuesta del servidor"
          );
        } else {
          setError(`Error al cargar datos: ${err.message}`);
        }
      } finally {
        setFetchingData(false);
      }
    }

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, usuario]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (["investigador", "estudiante"].includes(name)) {
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
    
    // Si cambia alguna contraseña, limpiar el error de contraseña
    if (name === "contrasena" || name === "confirmarContrasena") {
      setPasswordError("");
    }
  };

  const handleRolChange = (e) => {
    const rol = e.target.value;
    setFormData((prev) => ({
      ...prev,
      rol,
      investigador: rol === "investigador" ? prev.investigador : null,
      estudiante: rol === "estudiante" ? prev.estudiante : null,
    }));
    
    // Limpiar búsqueda al cambiar de rol
    setSearchTerm('');
    setSelectedName('');
  };

  // Validar que las contraseñas coincidan
  const validatePasswords = () => {
    // Si estamos editando y no se está cambiando la contraseña, no validar
    if (usuario && !formData.contrasena) {
      return true;
    }
    
    // Validar que ambas contraseñas coincidan
    if (formData.contrasena !== formData.confirmarContrasena) {
      setPasswordError("Las contraseñas no coinciden");
      return false;
    }
    
    // Validar longitud mínima (opcional)
    if (formData.contrasena.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar contraseñas antes de enviar
    if (!validatePasswords()) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      let result;

      const dataToSend = { ...formData };
      // Eliminar el campo confirmarContrasena antes de enviar al servidor
      delete dataToSend.confirmarContrasena;
      
      if (usuario && !dataToSend.contrasena) {
        delete dataToSend.contrasena;
      }

      console.log("Datos a enviar:", dataToSend);

      if (usuario) {
        result = await usuarioService.updateUsuario(usuario.id, dataToSend);
      } else {
        result = await usuarioService.createUsuario(dataToSend);
      }

      onSuccess(result);
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      let errorMsg = err.message || "Error al guardar. Revisa los datos.";

      // Si hay un error de respuesta del servidor, mostrar detalles adicionales
      if (err.response) {
        const serverErrors = err.response.data;
        console.error("Detalles del error del servidor:", serverErrors);

        // Formatear errores de validación del backend
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

  // Filtrar investigadores y estudiantes que no están asignados a un usuario
  const investigadoresDisponibles = investigadores.filter(
    inv => !asignados.investigadores.includes(inv.id)
  );

  const estudiantesDisponibles = estudiantes.filter(
    est => !asignados.estudiantes.includes(est.id)
  );

  // Manejar selección desde el dropdown
  const handleSelect = (item) => {
    const { id, nombre } = item;
    setSelectedName(nombre);
    setSearchTerm('');
    setShowDropdown(false);
    
    if (formData.rol === 'investigador') {
      setFormData(prev => ({ ...prev, investigador: id }));
    } else if (formData.rol === 'estudiante') {
      setFormData(prev => ({ ...prev, estudiante: id }));
    }
  };

  // Filtrar resultados de búsqueda
  const getFilteredResults = () => {
    if (formData.rol === 'investigador') {
      return investigadoresDisponibles.filter(inv => 
        inv.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (formData.rol === 'estudiante') {
      return estudiantesDisponibles.filter(est => 
        est.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return [];
  };

  // Manejar clic en limpiar selección
  const handleClearSelection = () => {
    setSelectedName('');
    setSearchTerm('');
    
    if (formData.rol === 'investigador') {
      setFormData(prev => ({ ...prev, investigador: null }));
    } else if (formData.rol === 'estudiante') {
      setFormData(prev => ({ ...prev, estudiante: null }));
    }
  };

  const filteredResults = getFilteredResults();

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={usuario ? "Editar Usuario" : "Crear Usuario"}
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
              Nombre de Usuario
            </label>
            <input
              type="text"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Campo de contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Contraseña {usuario && "(Dejar vacío para mantener la actual)"}
            </label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required={!usuario}
              className={`w-full px-3 py-2 bg-gray-700 border ${
                passwordError ? "border-red-500" : "border-gray-600"
              } rounded-md text-white focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>
          
          {/* Campo de confirmar contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirmar Contraseña {usuario && "(Dejar vacío si no cambias la contraseña)"}
            </label>
            <input
              type="password"
              name="confirmarContrasena"
              value={formData.confirmarContrasena}
              onChange={handleChange}
              required={!usuario || formData.contrasena.length > 0}
              className={`w-full px-3 py-2 bg-gray-700 border ${
                passwordError ? "border-red-500" : "border-gray-600"
              } rounded-md text-white focus:ring-blue-500 focus:border-blue-500`}
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">
                {passwordError}
              </p>
            )}
          </div>

          {/* Campo de rol - solo editable en creación, no en edición */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Rol {usuario && "(No modificable)"}
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleRolChange}
              required
              disabled={!!usuario}
              className={`cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500 ${
                usuario ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              <option value="admin">Administrador</option>
              <option value="investigador">Investigador</option>
              <option value="estudiante">Estudiante</option>
            </select>
            {usuario && (
              <p className="text-xs text-blue-400 mt-1">
                El rol no se puede cambiar una vez creado el usuario.
              </p>
            )}
          </div>

          {/* Buscador de investigador/estudiante */}
          {(formData.rol === "investigador" || formData.rol === "estudiante") && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Vincular a {formData.rol === "investigador" ? "Investigador" : "Estudiante"} 
                {usuario && " (No modificable)"}
              </label>
              
              <div ref={searchRef} className="relative">
                {/* Si hay un valor seleccionado, mostrar el nombre */}
                {selectedName ? (
                  <div className={`flex items-center justify-between px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white ${
                    usuario ? "opacity-75" : ""
                  }`}>
                    <span>{selectedName}</span>
                    {!usuario && (
                      <button 
                        type="button"
                        onClick={handleClearSelection}
                        className="text-gray-400 hover:text-gray-200 ml-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ) : (
                  /* Si no hay selección, mostrar campo de búsqueda */
                  <div className={`${usuario ? "hidden" : ""}`}>
                    <input
                      type="text"
                      placeholder={`Buscar ${formData.rol === "investigador" ? "investigador" : "estudiante"}...`}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                      disabled={!!usuario}
                    />
                    
                    {/* Dropdown de resultados */}
                    {showDropdown && searchTerm && (
                      <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredResults.length > 0 ? (
                          filteredResults.map(item => (
                            <div
                              key={item.id}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-gray-200"
                              onClick={() => handleSelect(item)}
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
              
              {usuario && (
                <p className="text-xs text-blue-400 mt-1">
                  La vinculación no se puede cambiar una vez creado el usuario.
                </p>
              )}
              
              {!usuario && !selectedName && formData.rol === "investigador" && investigadoresDisponibles.length === 0 && (
                <p className="text-xs text-yellow-400 mt-1">
                  No hay investigadores disponibles para vincular. Todos están asignados a usuarios.
                </p>
              )}
              
              {!usuario && !selectedName && formData.rol === "estudiante" && estudiantesDisponibles.length === 0 && (
                <p className="text-xs text-yellow-400 mt-1">
                  No hay estudiantes disponibles para vincular. Todos están asignados a usuarios.
                </p>
              )}
            </div>
          )}

          <div className="pt-4 pb-4 flex justify-center text-center">
            <input
              id="usuario-activo"
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="cursor-pointer h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600"
            />
            <label
              htmlFor="usuario-activo"
              className="ml-2 text-sm text-gray-300 cursor-pointer"
            >
              Usuario Activo
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

export default UsuarioForm;