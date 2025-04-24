import React, { useState, useEffect } from "react";

function NivelCards({ items, onEdit, onDelete }) {
  const [visibleItems, setVisibleItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [nivelDetalle, setNivelDetalle] = useState(null);

  const handleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setNivelDetalle(null);
      document.dispatchEvent(
        new CustomEvent("nivel-pagination-control", {
          detail: { show: true },
        })
      );
      return;
    }

    setExpandedId(id);
    const nivel = items.find(item => item.id === id);
    setNivelDetalle(nivel);
    document.dispatchEvent(
      new CustomEvent("nivel-pagination-control", {
        detail: { show: false },
      })
    );
  };

  const handleClose = () => {
    setExpandedId(null);
    setNivelDetalle(null);
    document.dispatchEvent(
      new CustomEvent("nivel-pagination-control", {
        detail: { show: true },
      })
    );
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
        No hay niveles para mostrar
      </div>
    );
  }

  if (expandedId !== null) {
    const nivel = items.find((item) => item.id === expandedId);
    if (!nivel) {
      setExpandedId(null);
      return null;
    }

    return (
      <div className="col-span-full">
        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={handleClose}
            className="cursor-pointer bg-gray-700 transition-all duration-200 ease-in-out hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center w-full sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver a la lista
          </button>
        </div>
        <DetalleNivel
          nivel={nivelDetalle || nivel}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    );
  }

  return (
    <>
      {items.map((nivel, index) => (
        <NivelCard
          key={nivel.id}
          nivel={nivel}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          expanded={false}
          isFullWidth={false}
          onExpand={() => handleExpand(nivel.id)}
        />
      ))}
    </>
  );
}

function DetalleNivel({ nivel, onEdit, onDelete }) {
  if (!nivel) return null;

  return (
    <div className="bg-gray-800/80 border border-blue-500/30 rounded-lg overflow-hidden shadow-xl">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-indigo-900/20"></div>
        <div className="relative p-4 md:p-6 flex flex-col gap-5">
          {/* Información principal */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl md:text-3xl relative shadow-lg mx-auto sm:mx-0">
              {nivel.nivel?.charAt(0).toUpperCase() || "N"}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {nivel.nivel || "Sin nombre"}
              </h2>
              <p className="text-gray-300 mt-1">
                ID: {nivel.id}
              </p>
            </div>
          </div>

          {/* Descripción (si existe) */}
          {nivel.descripcion && (
            <div className="border-t border-gray-700/50 pt-4 mt-1">
              <h3 className="text-lg font-semibold text-white mb-2">Descripción</h3>
              <p className="text-gray-300">{nivel.descripcion}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-center sm:justify-end space-x-3 border-t border-gray-700/50 pt-4">
            <button
              className="cursor-pointer px-3 py-1.5 md:px-4 md:py-2 bg-blue-900/30 text-blue-300 hover:bg-blue-800/40 rounded-md transition-colors duration-200 flex items-center text-sm"
              onClick={() => onEdit(nivel)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5 md:h-5 md:w-5 md:mr-2"
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
              Editar
            </button>
            <button
              className="cursor-pointer px-3 py-1.5 md:px-4 md:py-2 bg-red-900/30 text-red-300 hover:bg-red-800/40 rounded-md transition-colors duration-200 flex items-center text-sm"
              onClick={() => onDelete(nivel)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5 md:h-5 md:w-5 md:mr-2"
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
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NivelCard({
  nivel,
  index,
  onEdit,
  onDelete,
  expanded = false,
  isFullWidth = false,
  onExpand,
}) {
  const handleCardClick = (e) => {
    if (e.target.closest("button[data-action]")) return;
    onExpand();
  };

  return (
    <div
      className={`bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-blue-900/20 ${
        expanded
          ? "hover:border-blue-500/50 ring-1 ring-blue-500/20"
          : "hover:border-blue-500/30"
      } ${isFullWidth ? "col-span-full" : ""}`}
      style={{
        animation: "fadeIn 0.5s ease-out forwards",
        animationDelay: `${index * 100}ms`,
        opacity: 0,
        cursor: "pointer",
      }}
      onClick={handleCardClick}
    >
      <div className={`p-4 ${isFullWidth ? "max-w-4xl mx-auto" : ""}`}>
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl relative">
            {nivel.nivel ? nivel.nivel.charAt(0).toUpperCase() : "N"}
          </div>

          <div className="ml-3 flex-grow min-w-0">
            <h3 className="font-semibold text-white flex items-center space-x-2">
              <span className="truncate">{nivel.nivel || "Sin nombre"}</span>
            </h3>
            <p className="text-sm text-gray-400 truncate">
              ID: {nivel.id}
            </p>
          </div>
        </div>

        {nivel.descripcion && (
          <div className="bg-gray-700/40 p-2 rounded my-3">
            <span className="text-gray-400">Descripción:</span>
            <span className="text-gray-200 block truncate">
              {nivel.descripcion}
            </span>
          </div>
        )}

        <div className="mt-4 flex justify-end space-x-2 border-t border-gray-700 pt-3">
          <button
            data-action="edit"
            className="cursor-pointer p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
            title="Editar nivel"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(nivel);
            }}
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
            data-action="delete"
            className="cursor-pointer p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors duration-200"
            title="Eliminar nivel"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(nivel);
            }}
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

export default NivelCards;