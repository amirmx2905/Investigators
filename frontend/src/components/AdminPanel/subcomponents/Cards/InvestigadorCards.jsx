import React, { useState, useEffect } from 'react';

function InvestigadorCards({ items, onEdit, onDelete }) {
  const [visibleItems, setVisibleItems] = useState([]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const showItems = [];
      
      items.forEach((item, index) => {
        setTimeout(() => {
          showItems.push(item);
          setVisibleItems([...showItems]);
        }, 50 * index);
      });
    }, 50);
    
    return () => clearTimeout(timer);
  }, [items]);
  
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No hay investigadores para mostrar
      </div>
    );
  }

  return (
    <>
      {/* Mapear los investigadores */}
      {items.map((investigador, index) => (
        <div
          key={investigador.id}
          className={`bg-gray-800/60 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:border-blue-500/40 ${
            visibleItems.includes(investigador)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: `${index * 50}ms` }}
        >
          {/* Contenido de la tarjeta */}
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-3">
                {investigador.nombre?.charAt(0).toUpperCase() || "I"}
              </div>
              <div>
                <h3 className="font-semibold text-gray-200">{investigador.nombre}</h3>
                <p className="text-sm text-gray-400">{investigador.correo}</p>
              </div>
            </div>
            
            {/* Información del investigador */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
              <div className="bg-gray-700/50 p-2 rounded">
                <span className="text-gray-400">ID:</span>
                <span className="ml-2 text-gray-200">{investigador.id}</span>
              </div>
              <div className="bg-gray-700/50 p-2 rounded">
                <span className="text-gray-400">Especialidad:</span>
                <span className="ml-2 text-gray-200">{investigador.especialidad}</span>
              </div>
              <div className="col-span-2 bg-gray-700/50 p-2 rounded">
                <span className="text-gray-400">Estado:</span>
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    investigador.activo
                      ? "bg-green-900/60 text-green-300"
                      : "bg-red-900/60 text-red-300"
                  }`}
                >
                  {investigador.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
            
            {/* Acciones */}
            <div className="mt-4 flex justify-end space-x-2 border-t border-gray-700 pt-3">
              <button
                onClick={() => onEdit(investigador)}
                className="cursor-pointer p-2 text-blue-400 hover:text-blue-300 transition-colors"
                title="Editar"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={() => onDelete(investigador)}
                className="cursor-pointer p-2 text-red-400 hover:text-red-300 transition-colors"
                title="Eliminar"
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
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default InvestigadorCards;