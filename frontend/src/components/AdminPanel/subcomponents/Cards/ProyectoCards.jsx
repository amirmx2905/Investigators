import React, { useState, useEffect } from "react";

function ProyectoCards({ items, onEdit, onDelete }) {
  // eslint-disable-next-line no-unused-vars
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

  if (!items || items.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-gray-400">
        No hay proyectos para mostrar
      </div>
    );
  }

  return (
    <>
      {items.map((proyecto, index) => (
        <ProyectoCard
          key={proyecto.id}
          proyecto={proyecto}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}

function ProyectoCard({ proyecto, index, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const getStatusStyles = (status) => {
    const statusMap = {
      "en proceso": "bg-blue-500/30 text-blue-200 border border-blue-500/40",
      terminado:
        "bg-emerald-500/30 text-emerald-200 border border-emerald-500/40",
      "instalado en sitio":
        "bg-purple-500/30 text-purple-200 border border-purple-500/40",
      suspendido: "bg-amber-500/30 text-amber-200 border border-amber-500/40",
      cancelado: "bg-red-500/30 text-red-200 border border-red-500/40",
    };

    if (!status)
      return "bg-gray-600/40 text-gray-300 border border-gray-500/30";
    return (
      statusMap[status.toLowerCase()] ||
      "bg-gray-600/40 text-gray-300 border border-gray-500/30"
    );
  };

  // eslint-disable-next-line no-unused-vars
  const formatDescription = (text) => {
    if (!text) return "Sin descripción";
    if (text.length > 150) {
      return text.substring(0, 150) + "...";
    }
    return text;
  };

  const descripcionProyecto =
    proyecto.descripcion || proyecto.explicacion || "";

  return (
    <div
      className={`bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-blue-900/20 ${
        expanded
          ? "hover:border-blue-500/50 ring-1 ring-blue-500/20"
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
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-teal-600 flex items-center justify-center text-white font-bold text-xl relative">
            {proyecto.nombre ? proyecto.nombre.charAt(0).toUpperCase() : "P"}
          </div>

          <div className="ml-3 flex-grow min-w-0">
            <h3 className="font-semibold text-white flex items-center space-x-2">
              <span className="truncate">{proyecto.nombre}</span>
            </h3>
            <span
              className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getStatusStyles(
                proyecto.estado
              )}`}
            >
              {proyecto.estado || "Sin estado"}
            </span>
          </div>

          {/* Botón de expandir */}
          <button
            onClick={() => setExpanded(!expanded)}
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

        {/* Badge de ID y duración */}
        <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 rounded-lg p-2 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
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
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1"
                />
              </svg>
              <span className="text-gray-400">ID:</span>
              <span className="ml-1.5 font-medium text-gray-200">
                {proyecto.id}
              </span>
            </div>

            <div className="flex items-center mt-1.5 sm:mt-0">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs text-gray-400">Duración:</span>
              <span className="ml-1.5 text-gray-200 text-xs">
                {formatDate(proyecto.fecha_inicio)} →{" "}
                {formatDate(proyecto.fecha_fin)}
              </span>
            </div>
          </div>
        </div>

        {/* Tarjetas de info (No expandido) */}
        <div
          className={`transition-all duration-300 ${
            expanded ? "hidden" : "block"
          }`}
        >
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div className="bg-gray-700/40 p-2 rounded">
              <span className="text-gray-400">Inicio:</span>
              <span className="ml-1.5 text-gray-200 block truncate">
                {formatDate(proyecto.fecha_inicio)}
              </span>
            </div>
            <div className="bg-gray-700/40 p-2 rounded">
              <span className="text-gray-400">Fin:</span>
              <span className="ml-1.5 text-gray-200 block truncate">
                {formatDate(proyecto.fecha_fin)}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-300 overflow-hidden space-y-3 ${
            expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* Líder del proyecto */}
          <div
            className="bg-gradient-to-r py-2.5 px-3 rounded-md text-white text-sm flex items-center justify-between"
            style={{
              backgroundImage: `linear-gradient(to right, rgb(17, 24, 39, 0.8), rgb(31, 41, 55, 0.8))`,
            }}
          >
            <div className="flex items-center">
              {/* Icono de estrella (liderazgo) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <span className="text-blue-300 max-[435px]:hidden">Líder:</span>
            </div>
            <div className="flex items-center max-[435px]:mx-auto">
              <span
                className={`text-xs px-2 py-1 rounded bg-gradient-to-r ${
                  proyecto.lider_nombre
                    ? "from-blue-600 to-indigo-600 text-white"
                    : "from-gray-600 to-gray-500 text-white"
                }`}
              >
                {proyecto.lider_nombre || "No asignado"}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            {/* Fechas */}
            <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex items-center justify-between w-full">
              <div className="flex items-center flex-shrink-0">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="ml-1.5 text-gray-400">Inicio:</span>
              </div>
              <span className="text-gray-200 font-medium truncate max-w-[60%]">
                {formatDate(proyecto.fecha_inicio)}
              </span>
            </div>

            <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex items-center justify-between w-full">
              <div className="flex items-center flex-shrink-0">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="ml-1.5 text-gray-400">Finalización:</span>
              </div>
              <span className="text-gray-200 font-medium truncate max-w-[60%]">
                {formatDate(proyecto.fecha_fin)}
              </span>
            </div>

            {/* Estado */}
            <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex items-center justify-between w-full">
              <div className="flex items-center flex-shrink-0">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="ml-1.5 text-gray-400">Estado:</span>
              </div>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${getStatusStyles(
                  proyecto.estado
                )}`}
              >
                {proyecto.estado || "Sin estado"}
              </span>
            </div>

            {/* Descripción en vista expandida */}
            {descripcionProyecto && (
              <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 w-full">
                <div className="flex items-center flex-shrink-0 mb-1">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="ml-1.5 text-gray-400">Descripción:</span>
                </div>
                <p className="text-gray-200 text-sm mt-1">
                  {descripcionProyecto}
                </p>
              </div>
            )}

            {/* Herramientas */}
            {proyecto.herramientas && proyecto.herramientas.length > 0 && (
              <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex flex-col w-full">
                <div className="flex items-center flex-shrink-0 mb-1">
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="ml-1.5 text-gray-400">Herramientas:</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {proyecto.herramientas.map((herramienta, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded-full"
                    >
                      {typeof herramienta === "object"
                        ? herramienta.nombre
                        : `Herramienta #${herramienta}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Investigadores */}
            {proyecto.investigadores && proyecto.investigadores.length > 0 && (
              <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex flex-col w-full mb-3">
                <div className="flex items-center flex-shrink-0 mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span className="ml-1.5 text-gray-400">
                    Investigadores participantes:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {proyecto.investigadores.map((investigador, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-green-800/40 text-green-200 px-2 py-1 rounded-full"
                    >
                      {typeof investigador === "object"
                        ? investigador.nombre
                        : `Investigador #${investigador}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-4 flex justify-end space-x-2 border-t border-gray-700 pt-3">
          <button
            className="cursor-pointer p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
            title="Editar proyecto"
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
            title="Eliminar proyecto"
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
  );
}

export default ProyectoCards;
