import React, { useState, useEffect } from "react";

function RoleventoCards({ items, onEdit, onDelete }) {
  const [visibleItems, setVisibleItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const handleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

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
      <div className="col-span-full text-center py-8 text-gray-400">
        No hay roles de eventos para mostrar
      </div>
    );
  }

  return (
    <>
      {items.map((rolevento, index) => (
        <RoleventoCard
          key={rolevento.id}
          rolevento={rolevento}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          expanded={expandedId === rolevento.id}
          onExpand={() => handleExpand(rolevento.id)}
        />
      ))}
    </>
  );
}

function RoleventoCard({
  rolevento,
  index,
  onEdit,
  onDelete,
  expanded,
  onExpand,
}) {
  return (
    <div
      className={`bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-blue-900/20 ${
        expanded
          ? "hover:border-blue-500/50 ring-1 ring-blue-500/20 col-span-full"
          : "hover:border-blue-500/30"
      }`}
      style={{
        animation: "fadeIn 0.5s ease-out forwards",
        animationDelay: `${index * 100}ms`,
        opacity: 0,
      }}
    >
      <div className="p-4">
        <div className="flex items-center mb-2">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
            {rolevento.nombre ? rolevento.nombre.charAt(0).toUpperCase() : "R"}
          </div>

          <div className="ml-3 flex-grow min-w-0">
            <h3 className="font-semibold text-white flex items-center space-x-2">
              <span className="truncate">{rolevento.nombre}</span>
            </h3>
            <p className="text-sm text-gray-400 truncate">
              rol de evento
            </p>
          </div>

          {/* Botón de expandir */}
          <button
            onClick={onExpand}
            className={`cursor-pointer ml-2 flex items-center justify-center p-1.5 rounded-full ${
              expanded
                ? "bg-blue-900/40 text-blue-300 hover:bg-blue-800/50"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            } transition-colors`}
            title={expanded ? "Colapsar" : "Expandir información"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform duration-300 ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={expanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </button>
        </div>

        {/* Badge de ID */}
        <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 rounded-lg p-2 mb-3 flex items-center">
          <div className="text-sm text-gray-300 flex items-center">
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="text-gray-400">ID:</span>
            <span className="ml-1.5 font-medium text-gray-200">{rolevento.id}</span>
          </div>
        </div>

        {/* Contenido expandible */}
        {expanded && (
          <div className="mt-4 border-t border-gray-700 pt-4">
            <div className="space-y-4">
              {/* Estadísticas */}
              <div className="bg-gray-800/60 hover:bg-gray-800/80 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-gray-300 font-medium">Eventos asociados:</span>
                  </div>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                    {rolevento.eventos_count || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-4 flex justify-end space-x-2 border-t border-gray-700 pt-3">
          <button
            className="cursor-pointer p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
            title="Editar rol de evento"
            onClick={() => onEdit(rolevento)}
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
            title="Eliminar rol de evento"
            onClick={() => onDelete(rolevento)}
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

export default RoleventoCards;