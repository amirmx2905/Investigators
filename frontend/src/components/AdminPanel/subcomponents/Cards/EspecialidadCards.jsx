import React, { useState, useEffect } from "react";

function EspecialidadCards({ items, onEdit, onDelete }) {
  console.log("EspecialidadCards recibió:", items);
  
  const [visibleItems, setVisibleItems] = useState([]);

  // Asegurarse de que items sea un array y manejar su carga
  useEffect(() => {
    if (Array.isArray(items)) {
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
    } else {
      setVisibleItems([]);
    }
  }, [items]);

  // Si items no es un array o está vacío
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="w-full flex justify-center items-center p-8 bg-gray-800/60 rounded-lg border border-gray-700">
        <p className="text-gray-400 text-lg">
          No hay especialidades registradas. Crea una nueva especialidad usando el botón "Nueva Especialidad".
        </p>
      </div>
    );
  }

  return (
    <>
      {items.map((especialidad, index) => (
        <EspecialidadCard
          key={especialidad.id}
          especialidad={especialidad}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}

function EspecialidadCard({ especialidad, index, onEdit, onDelete }) {
  return (
    <div
      className="w-full bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-blue-900/20 mb-4"
      style={{
        animation: "fadeIn 0.5s ease-out forwards",
        animationDelay: `${index * 100}ms`,
        opacity: 0,
      }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              {especialidad.nombre_especialidad ? especialidad.nombre_especialidad.charAt(0).toUpperCase() : "E"}
            </div>
            <div className="ml-3 flex-grow min-w-0">
              <h3 className="text-lg font-semibold text-white">
                {especialidad.nombre_especialidad}
              </h3>
              <div className="flex items-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                <span className="text-sm text-gray-400 ml-1.5">Especialidad académica</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Badge de ID */}
        <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 rounded-lg p-2 my-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1"
            />
          </svg>
          <span className="text-gray-400 text-sm">ID:</span>
          <span className="ml-1.5 font-medium text-gray-200 text-sm">
            {especialidad.id}
          </span>
        </div>

        {/* Botones de acción */}
        <div className="mt-4 flex justify-end space-x-2 border-t border-gray-700 pt-3">
          <button
            className="cursor-pointer p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
            title="Editar especialidad"
            onClick={() => onEdit(especialidad)}
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
            className="cursor-pointer p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors duration-200"
            title="Eliminar especialidad"
            onClick={() => onDelete(especialidad)}
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
  );
}

export default EspecialidadCards;