import React, { useState, useEffect } from "react";

function ProyectoCards({ items }) {
  const [visibleItems, setVisibleItems] = useState([]);
  
  // Animación de entrada escalonada
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
  
  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "No definida";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Fecha inválida";
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Función para obtener estilo según estado
  const getStatusStyle = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo':
        return "bg-green-900/60 text-green-300";
      case 'completado':
        return "bg-blue-900/60 text-blue-300";
      case 'suspendido':
        return "bg-yellow-900/60 text-yellow-300";
      case 'cancelado':
        return "bg-red-900/60 text-red-300";
      default:
        return "bg-gray-900/60 text-gray-300";
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No hay proyectos para mostrar
      </div>
    );
  }

  return (
    <>
      {items.map((proyecto, index) => (
        <div
          key={proyecto.id}
          className={`bg-gray-800/60 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:border-blue-500/40 ${
            visibleItems.includes(proyecto)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: `${index * 50}ms` }}
        >
          <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 px-4 py-3 border-b border-gray-700">
            <h3 className="font-semibold text-gray-200">{proyecto.nombre}</h3>
            <span 
              className={`px-2 py-1 text-xs rounded-full inline-block mt-2 ${getStatusStyle(proyecto.estado)}`}
            >
              {proyecto.estado}
            </span>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-700/50 p-2 rounded">
                <span className="text-gray-400">ID:</span>
                <span className="ml-2 text-gray-200">{proyecto.id}</span>
              </div>
              <div className="bg-gray-700/50 p-2 rounded">
                <span className="text-gray-400">Fecha Inicio:</span>
                <span className="ml-2 text-gray-200">{formatDate(proyecto.fecha_inicio)}</span>
              </div>
              <div className="col-span-2 bg-gray-700/50 p-2 rounded">
                <span className="text-gray-400">Fecha Fin:</span>
                <span className="ml-2 text-gray-200">{formatDate(proyecto.fecha_fin)}</span>
              </div>
            </div>
            
            {proyecto.descripcion && (
              <div className="mt-3 bg-gray-700/30 p-2 rounded text-sm text-gray-300">
                <p className="line-clamp-2">{proyecto.descripcion}</p>
              </div>
            )}
            
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
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
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors duration-200"
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

export default ProyectoCards;