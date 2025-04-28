/**
 * InvestigadorSelector - Componente de selección avanzada de investigadores
 *
 * Este componente proporciona una interfaz interactiva para filtrar investigadores utilizando
 * un menú desplegable con capacidad de búsqueda integrada. Admite la visualización
 * de muchos investigadores de forma escalable.
 */
import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

/**
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.investigadores - Lista de objetos investigador {id, nombre}
 * @param {Function} props.onSelect - Función a ejecutar cuando se selecciona un investigador
 * @param {number|null} props.selectedId - ID del investigador actualmente seleccionado (null si no hay selección)
 * @returns {JSX.Element} Selector de investigadores con búsqueda
 */
function InvestigadorSelector({ investigadores, onSelect, selectedId }) {
  // Estado para controlar si el menú desplegable está abierto o cerrado
  const [isOpen, setIsOpen] = useState(false);

  // Estado para almacenar el texto de búsqueda ingresado por el usuario
  const [searchTerm, setSearchTerm] = useState("");

  // Referencia al elemento DOM para detectar clics fuera del componente
  const dropdownRef = useRef(null);

  /**
   * Efecto para manejar el cierre del menú desplegable cuando se hace clic fuera
   * Agrega y elimina eventListeners para detectar clics fuera del componente
   */
  useEffect(() => {
    // Función que verifica si el clic fue fuera del componente
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Registrar el event listener cuando el componente se monta
    document.addEventListener("mousedown", handleClickOutside);

    // Limpiar el event listener cuando el componente se desmonta
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Filtra la lista de investigadores basándose en el término de búsqueda
   * La búsqueda no distingue entre mayúsculas y minúsculas
   */
  const filteredInvestigadores = investigadores.filter((inv) =>
    inv.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Obtiene el nombre del investigador seleccionado para mostrarlo en el botón
   * Si no hay selección, muestra "Todos los investigadores"
   */
  const selectedInvestigador = selectedId
    ? investigadores.find((inv) => inv.id === selectedId)?.nombre
    : "Todos los investigadores";

  return (
    <div className="w-full sm:w-64 relative" ref={dropdownRef}>
      {/* Etiqueta descriptiva del campo */}
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Filtrar por Investigador:
      </label>

      {/* Botón principal que muestra la selección actual y controla la apertura del menú */}
      <button
        type="button"
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer text-sm sm:text-base flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Texto truncado del investigador seleccionado */}
        <span className="truncate">{selectedInvestigador}</span>

        {/* Icono de flecha que rota cuando el menú está abierto */}
        <svg
          className={`h-5 w-5 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Menú desplegable (solo visible cuando isOpen es true) */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 shadow-lg rounded-md border border-gray-700 max-h-80 overflow-y-auto">
          {/* Sección de búsqueda que permanece fija al hacer scroll */}
          <div className="sticky top-0 p-2 bg-gray-800 border-b border-gray-700">
            <div className="relative">
              {/* Icono de lupa dentro del campo de búsqueda */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>

              {/* Campo de entrada para la búsqueda */}
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Buscar investigador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus // Enfoca automáticamente el campo al abrir el menú
              />
            </div>
          </div>

          {/* Opción para seleccionar "Todos los investigadores" */}
          <div
            className={`px-3 py-2 cursor-pointer hover:bg-gray-700 ${
              !selectedId ? "bg-blue-600" : "" // Resalta esta opción si no hay selección
            }`}
            onClick={() => {
              onSelect(null); // Envía null al componente padre
              setIsOpen(false); // Cierra el menú
              setSearchTerm(""); // Limpia la búsqueda
            }}
          >
            Todos los investigadores
          </div>

          {/* Sección de resultados de la búsqueda */}
          {filteredInvestigadores.length > 0 ? (
            // Mapea los investigadores filtrados a elementos de la lista
            filteredInvestigadores.map((inv) => (
              <div
                key={inv.id} // Clave única para React
                className={`px-3 py-2 cursor-pointer hover:bg-gray-700 ${
                  selectedId === inv.id ? "bg-blue-600" : "" // Resalta el elemento seleccionado
                }`}
                onClick={() => {
                  onSelect(inv.id); // Envía el id al componente padre
                  setIsOpen(false); // Cierra el menú
                  setSearchTerm(""); // Limpia la búsqueda
                }}
              >
                {inv.nombre}
              </div>
            ))
          ) : (
            // Mensaje cuando no hay resultados que coincidan con la búsqueda
            <div className="px-3 py-2 text-gray-400 italic">
              No se encontraron investigadores
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InvestigadorSelector;
