import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

function InvestigadorSelector({ investigadores, onSelect, selectedId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filtrar investigadores basado en el término de búsqueda
  const filteredInvestigadores = investigadores.filter((inv) =>
    inv.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener el nombre del investigador seleccionado
  const selectedInvestigador = selectedId
    ? investigadores.find((inv) => inv.id === selectedId)?.nombre
    : "Todos los investigadores";

  return (
    <div className="w-full sm:w-64 relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Filtrar por Investigador:
      </label>

      {/* Botón que muestra la selección actual */}
      <button
        type="button"
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer text-sm sm:text-base flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedInvestigador}</span>
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

      {/* Dropdown con búsqueda */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 shadow-lg rounded-md border border-gray-700 max-h-80 overflow-y-auto">
          {/* Campo de búsqueda */}
          <div className="sticky top-0 p-2 bg-gray-800 border-b border-gray-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Cambiar SearchIcon por MagnifyingGlassIcon */}
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Buscar investigador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Opción para "Todos" */}
          <div
            className={`px-3 py-2 cursor-pointer hover:bg-gray-700 ${
              !selectedId ? "bg-blue-600" : ""
            }`}
            onClick={() => {
              onSelect(null);
              setIsOpen(false);
              setSearchTerm("");
            }}
          >
            Todos los investigadores
          </div>

          {/* Lista de investigadores filtrados */}
          {filteredInvestigadores.length > 0 ? (
            filteredInvestigadores.map((inv) => (
              <div
                key={inv.id}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-700 ${
                  selectedId === inv.id ? "bg-blue-600" : ""
                }`}
                onClick={() => {
                  onSelect(inv.id);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                {inv.nombre}
              </div>
            ))
          ) : (
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
