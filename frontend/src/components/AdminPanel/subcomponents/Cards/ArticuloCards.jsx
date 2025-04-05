import React, { useState, useEffect } from "react";

function ArticuloCards({ items, onEdit, onDelete }) {
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

  if (items.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-gray-400">
        No hay artículos para mostrar
      </div>
    );
  }

  return (
    <>
      {items.map((articulo, index) => (
        <ArticuloCard
          key={articulo.id}
          articulo={articulo}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}

function ArticuloCard({ articulo, index, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      console.error("Error al formatear la fecha:", e);
      return dateString;
    }
  };

  // Ordenar autores por orden_autor si existen
  const autoresOrdenados = articulo.autores
    ? [...articulo.autores].sort((a, b) => a.orden_autor - b.orden_autor)
    : [];

  return (
    <div
      className={`bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-indigo-900/20 ${
        expanded
          ? "hover:border-indigo-500/50 ring-1 ring-indigo-500/20"
          : "hover:border-indigo-500/30"
      }`}
      style={{
        animation: "fadeIn 0.5s ease-out forwards",
        animationDelay: `${index * 100}ms`,
        opacity: 0,
      }}
    >
      <div className="p-4">
        {/* Cabecera con título y badge */}
        <div className="flex items-center mb-2">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
            {articulo.id}
          </div>

          <div className="ml-3 flex-grow min-w-0">
            <h3 className="font-semibold text-white text-lg">
              {articulo.nombre_articulo}
            </h3>
            <p className="text-sm text-gray-400 truncate">
              {articulo.nombre_revista}
            </p>
          </div>

          {/* Botón de expandir/colapsar */}
          <button
            onClick={() => setExpanded(!expanded)}
            className={`cursor-pointer ml-2 flex items-center justify-center p-1.5 rounded-full ${
              expanded
                ? "bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/50"
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

        {/* Badge de estado */}
        <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 rounded-lg p-2 mb-3 flex items-center justify-between">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-amber-300 font-medium">
              {articulo.ano_publicacion}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                articulo.estatus
                  ? "bg-green-900/60 text-green-300"
                  : "bg-red-900/60 text-red-300"
              }`}
            >
              {articulo.estatus ? "Publicado" : "No Publicado"}
            </span>
          </div>
        </div>

        {/* Tarjetas de info (para versión no expandida) */}
        <div
          className={`transition-all duration-300 ${
            expanded ? "hidden" : "block"
          }`}
        >
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div className="bg-gray-700/40 p-2 rounded">
              <span className="text-gray-400">País:</span>
              <span className="ml-1.5 text-gray-200 block truncate">
                {articulo.pais_publicacion || "No especificado"}
              </span>
            </div>
            <div className="bg-gray-700/40 p-2 rounded">
              <span className="text-gray-400">Fecha:</span>
              <span className="ml-1.5 text-gray-200 block truncate">
                {formatDate(articulo.fecha_publicacion)}
              </span>
            </div>

            {/* DOI en vista compacta */}
            {articulo.doi && (
              <div className="bg-gray-700/40 p-2 rounded col-span-2">
                <span className="text-gray-400">DOI:</span>
                <a
                  href={`https://doi.org/${articulo.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1.5 text-blue-400 hover:text-blue-300 transition-colors block truncate"
                >
                  {articulo.doi}
                </a>
              </div>
            )}

            {/* Abstracto en vista compacta */}
            {articulo.abstracto && (
              <div className="bg-gray-700/40 p-2 rounded col-span-2">
                <span className="text-gray-400">Resumen:</span>
                <p className="text-gray-200 text-sm mt-1 line-clamp-2">
                  {articulo.abstracto}
                </p>
              </div>
            )}

            {/* Botón para expandir y ver autores */}
            {autoresOrdenados.length > 0 && (
              <div className="bg-gray-700/40 p-2 rounded col-span-2 hover:bg-gray-700/60 transition-colors cursor-pointer" onClick={() => setExpanded(true)}>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Autores:</span>
                  <span className="text-amber-400 text-xs font-medium bg-amber-900/30 px-2 py-0.5 rounded-full flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {autoresOrdenados.length}
                  </span>
                </div>
                <div className="mt-1 text-xs text-center text-indigo-300 hover:text-indigo-200 transition-colors">
                  Click para expandir y ver detalles de autores
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contenido expandible */}
        <div
          className={`transition-all duration-300 overflow-hidden space-y-3 ${
            expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* Datos detallados */}
          <div className="space-y-2 text-sm">
            {/* Título completo */}
            <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex flex-col w-full">
              <div className="flex items-center flex-shrink-0 mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-indigo-400"
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
                <span className="ml-1.5 text-gray-400">Título completo:</span>
              </div>
              <span className="text-gray-200 font-medium">
                {articulo.nombre_articulo}
              </span>
            </div>

            {/* Abstracto en vista expandida */}
            {articulo.abstracto && (
              <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex flex-col w-full">
                <div className="flex items-center flex-shrink-0 mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  <span className="ml-1.5 text-gray-400">Resumen:</span>
                </div>
                <p className="text-gray-200 text-sm mt-1">
                  {articulo.abstracto}
                </p>
              </div>
            )}

            {/* Revista */}
            <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex items-center justify-between w-full">
              <div className="flex items-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span className="ml-1.5 text-gray-400">Revista:</span>
              </div>
              <span className="text-gray-200 font-medium truncate max-w-[60%]">
                {articulo.nombre_revista}
              </span>
            </div>

            {/* País */}
            <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex items-center justify-between w-full">
              <div className="flex items-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="ml-1.5 text-gray-400">País:</span>
              </div>
              <span className="text-gray-200 font-medium truncate max-w-[60%]">
                {articulo.pais_publicacion || "No especificado"}
              </span>
            </div>

            {/* Fecha */}
            <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex items-center justify-between w-full">
              <div className="flex items-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-indigo-400"
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
                <span className="ml-1.5 text-gray-400">Fecha:</span>
              </div>
              <span className="text-gray-200 font-medium truncate max-w-[60%]">
                {formatDate(articulo.fecha_publicacion)}
              </span>
            </div>

            {/* Año */}
            <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex items-center justify-between w-full">
              <div className="flex items-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="ml-1.5 text-gray-400">Año:</span>
              </div>
              <span className="text-amber-300 font-medium truncate max-w-[60%]">
                {articulo.ano_publicacion || "No especificado"}
              </span>
            </div>

            {/* DOI */}
            {articulo.doi && (
              <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex items-center justify-between w-full">
                <div className="flex items-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <span className="ml-1.5 text-gray-400">DOI:</span>
                </div>
                <a
                  href={`https://doi.org/${articulo.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors truncate max-w-[60%]"
                >
                  {articulo.doi}
                </a>
              </div>
            )}

            {/* Autores expandidos */}
            <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex flex-col w-full">
              <div className="flex items-center flex-shrink-0 mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-indigo-400"
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
                <span className="ml-1.5 text-gray-400">Autores:</span>
                {autoresOrdenados.length > 0 && (
                  <span className="ml-2 text-amber-400 text-xs font-medium bg-amber-900/30 px-2 py-0.5 rounded-full">
                    {autoresOrdenados.length}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {autoresOrdenados.length > 0 ? (
                  autoresOrdenados.map((autor, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-indigo-900/40 text-indigo-300 rounded-full"
                    >
                      {autor.orden_autor}. {autor.investigador_nombre}
                      {autor.orden_autor === 1 && (
                        <span className="ml-1 text-green-300 text-[9px] bg-green-900/30 px-1 py-0.5 rounded">
                          Principal
                        </span>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Sin autores registrados</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-4 flex justify-end space-x-2 border-t border-gray-700 pt-3">
          <button
            className="cursor-pointer p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
            title="Editar artículo"
            onClick={() => onEdit(articulo)}
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
            title="Eliminar artículo"
            onClick={() => onDelete(articulo)}
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

export default ArticuloCards;