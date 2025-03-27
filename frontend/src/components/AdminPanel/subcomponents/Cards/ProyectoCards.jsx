import React from "react";

function ProyectoCards({ items, onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-gray-400">
        No hay proyectos para mostrar
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString();
  };

  const getStatusStyles = (status) => {
    const styles = {
      'activo': "bg-green-900/60 text-green-300",
      'completado': "bg-blue-900/60 text-blue-300",
      'suspendido': "bg-yellow-900/60 text-yellow-300",
      'cancelado': "bg-red-900/60 text-red-300"
    };
    
    return styles[status] || "bg-gray-900/60 text-gray-300";
  };

  return (
    <>
      {items.map((proyecto, index) => (
        <div
          key={proyecto.id}
          className="bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-900/20 transition-all duration-300 hover:border-blue-500/30"
          style={{
            animation: "fadeIn 0.5s ease-out forwards",
            animationDelay: `${index * 100}ms`,
            opacity: 0,
          }}
        >
          <div className="p-4">
            {/* Cabecera */}
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                {proyecto.nombre ? proyecto.nombre.charAt(0).toUpperCase() : "P"}
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-white">
                  {proyecto.nombre}
                </h3>
                <span
                  className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                    getStatusStyles(proyecto.estado)
                  }`}
                >
                  {proyecto.estado || "Sin estado"}
                </span>
              </div>
            </div>
            
            {/* Información del proyecto */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
              <div className="bg-gray-700/50 p-2 rounded">
                <span className="text-gray-400">ID:</span>
                <span className="ml-2 text-gray-200">{proyecto.id}</span>
              </div>
              <div className="bg-gray-700/50 p-2 rounded">
                <span className="text-gray-400">Inicio:</span>
                <span className="ml-2 text-gray-200">{formatDate(proyecto.fecha_inicio)}</span>
              </div>
              <div className="col-span-2 bg-gray-700/50 p-2 rounded">
                <span className="text-gray-400">Fin:</span>
                <span className="ml-2 text-gray-200">{formatDate(proyecto.fecha_fin)}</span>
              </div>
            </div>
            
            {/* Descripción (si existe) */}
            {proyecto.descripcion && (
              <div className="mt-3 bg-gray-700/30 p-2 rounded text-sm text-gray-300">
                <p className="line-clamp-2">{proyecto.descripcion}</p>
              </div>
            )}
            
            {/* Botones de acción */}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="cursor-pointer p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
                title="Editar"
                onClick={() => onEdit(proyecto)}
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
                title="Eliminar"
                onClick={() => onDelete(proyecto)}
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

export default ProyectoCards;