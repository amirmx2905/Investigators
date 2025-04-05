import React, { useState, useEffect } from "react";

function EventoCards({ items, onEdit, onDelete }) {
  // eslint-disable-next-line no-unused-vars
  const [visibleItems, setVisibleItems] = useState([]);
  
  const eventosOrdenados = [...items].sort((a, b) => a.id - b.id);

  useEffect(() => {
    const timer = setTimeout(() => {
      const showItems = [];

      eventosOrdenados.forEach((item, index) => {
        setTimeout(() => {
          showItems.push(item);
          setVisibleItems([...showItems]);
        }, 50 * index);
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [eventosOrdenados]);

  if (!items || items.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-gray-400">
        No hay eventos para mostrar
      </div>
    );
  }

  return (
    <>
      {eventosOrdenados.map((evento, index) => (
        <EventoCard
          key={evento.id}
          evento={evento}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}

function EventoCard({ evento, index, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [showParticipantes, setShowParticipantes] = useState(false);

  useEffect(() => {
    if (!expanded) {
      setShowParticipantes(false);
    }
  }, [expanded]);

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

  const getEventInitial = () => {
    return evento.nombre_evento ? evento.nombre_evento.charAt(0).toUpperCase() : "E";
  };

  const getTipoEventoStyles = (tipo) => {
    if (!tipo) return "bg-gray-900/60 text-gray-300";
    
    const tipoLower = tipo.toLowerCase();
    const tipoMap = {
      "congreso": "bg-purple-900/60 text-purple-300",
      "conferencia": "bg-blue-900/60 text-blue-300",
      "taller": "bg-green-900/60 text-green-300",
      "seminario": "bg-amber-900/60 text-amber-300",
      "curso": "bg-emerald-900/60 text-emerald-300",
      "simposio": "bg-indigo-900/60 text-indigo-300",
      "webinar": "bg-cyan-900/60 text-cyan-300",
      "panel": "bg-rose-900/60 text-rose-300",
      "reunión": "bg-slate-900/60 text-slate-300",
      "reunión de trabajo": "bg-slate-900/60 text-slate-300",
      "jornada": "bg-orange-900/60 text-orange-300",
      "clase": "bg-lime-900/60 text-lime-300",
      "conferencia virtual": "bg-cyan-900/60 text-cyan-300",
      "mesa redonda": "bg-pink-900/60 text-pink-300",
      "foro": "bg-violet-900/60 text-violet-300"
    };
    
    return tipoMap[tipoLower] || "bg-gray-900/60 text-gray-300";
  };

  return (
    <div
      className={`bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-purple-900/20 ${
        expanded
          ? "hover:border-purple-500/50 ring-1 ring-purple-500/20"
          : "hover:border-purple-500/30"
      }`}
      style={{
        animation: "fadeIn 0.5s ease-out forwards",
        animationDelay: `${index * 100}ms`,
        opacity: 0,
      }}
    >
      <div className="p-4">
        <div className="flex items-center mb-2">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl relative">
            {getEventInitial()}
          </div>

          <div className="ml-3 flex-grow min-w-0">
            <h3 className="font-semibold text-white flex items-center space-x-2">
              <span className="truncate">{evento.nombre_evento}</span>
            </h3>
            <span
              className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getTipoEventoStyles(
                evento.tipo_evento_nombre
              )}`}
            >
              {evento.tipo_evento_nombre || "Sin categoría"}
            </span>
          </div>

          {/* Botón de expandir */}
          <button
            onClick={() => setExpanded(!expanded)}
            className={`cursor-pointer ml-2 flex items-center justify-center p-1.5 rounded-full ${
              expanded
                ? "bg-purple-900/40 text-purple-300 hover:bg-purple-800/50"
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

        {/* Badge de ID y fechas (No expandida) */}
        <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 rounded-lg p-2 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-300 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                />
              </svg>
              <span className="text-xs text-gray-400">ID:</span>
              <span className="ml-1.5 text-blue-400 hover:text-blue-300 cursor-pointer">
                {evento.id}
              </span>
            </div>

            {/* Fechas */}
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
                {formatDate(evento.fecha_inicio)} →{" "}
                {formatDate(evento.fecha_fin)}
              </span>
            </div>
          </div>
        </div>

        {/* Tarjetas de info (No expandida) */}
        <div
          className={`transition-all duration-300 ${
            expanded ? "hidden" : "block"
          }`}
        >
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div className="bg-gray-700/40 p-2 rounded">
              <span className="text-gray-400">Lugar:</span>
              <span className="ml-1.5 text-gray-200 block truncate">
                {evento.lugar || "No especificado"}
              </span>
            </div>
            <div className="bg-gray-700/40 p-2 rounded">
              <span className="text-gray-400">Empresa:</span>
              <span className="ml-1.5 text-gray-200 block truncate">
                {evento.empresa_invita || "No especificada"}
              </span>
            </div>
          </div>

          {/* Botón para expandir y ver participantes */}
          {evento.investigadores && Array.isArray(evento.investigadores) && evento.investigadores.length > 0 && (
            <div 
              className="bg-gray-700/40 p-2 rounded mt-2 hover:bg-gray-700/60 transition-colors cursor-pointer"
              onClick={() => {
                setExpanded(true);
                setShowParticipantes(true);
              }}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Participantes:</span>
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {evento.investigadores.length}
                </span>
              </div>
              <div className="mt-1 text-xs text-center text-purple-300 hover:text-purple-200 transition-colors">
                Click para expandir y ver detalles de participantes
              </div>
            </div>
          )}
        </div>

        {/* Contenido expandible */}
        <div
          className={`transition-all duration-300 overflow-hidden space-y-3 ${
            expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* Lugar */}
          <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex items-center justify-between w-full">
            <div className="flex items-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="ml-1.5 text-gray-400">Lugar:</span>
            </div>
            <span className="text-gray-200 font-medium truncate max-w-[60%]">
              {evento.lugar || "No especificado"}
            </span>
          </div>

          {/* Fecha Inicio */}
          <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex items-center justify-between w-full">
            <div className="flex items-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-purple-400"
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
              {formatDate(evento.fecha_inicio)}
            </span>
          </div>

          {/* Fecha Fin */}
          <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex items-center justify-between w-full">
            <div className="flex items-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-purple-400"
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
              {formatDate(evento.fecha_fin)}
            </span>
          </div>

          {/* Empresa */}
          <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex items-center justify-between w-full">
            <div className="flex items-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="ml-1.5 text-gray-400">Empresa:</span>
            </div>
            <span className="text-gray-200 font-medium truncate max-w-[60%]">
              {evento.empresa_invita || "No especificada"}
            </span>
          </div>

          {/* Participantes */}
          <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 flex flex-col w-full">
            <div 
              className="flex items-center flex-shrink-0 mb-1 cursor-pointer"
              onClick={() => setShowParticipantes(!showParticipantes)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="ml-1.5 text-gray-400">Participantes:</span>
              {evento.investigadores && evento.investigadores.length > 0 && (
                <span className="ml-2 text-amber-400 text-xs font-medium bg-amber-900/30 px-2 py-0.5 rounded-full flex items-center">
                  {evento.investigadores.length}
                </span>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-2 text-gray-400 transition-transform duration-300 ${
                  showParticipantes ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={showParticipantes ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            </div>
            
            {/* Lista de participantes (expandible) */}
            <div 
              className={`transition-all duration-300 overflow-hidden ${
                showParticipantes ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="flex flex-wrap gap-1 mt-2">
                {evento.investigadores && evento.investigadores.length > 0 ? (
                  evento.investigadores.map((participante, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-purple-900/40 text-purple-300 rounded-full flex items-center"
                    >
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-[9px] font-medium text-purple-300 mr-1">
                        {i+1}
                      </div>
                      {participante.nombre || "Participante"}
                      {participante.rol_nombre && (
                        <span className="ml-1 text-amber-300 text-[9px] bg-amber-900/30 px-1 py-0.5 rounded">
                          {participante.rol_nombre}
                        </span>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Sin participantes registrados</span>
                )}
              </div>
            </div>
          </div>

          {/* Descripción */}
          {evento.descripcion && (
            <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-2.5 transition-colors duration-200 w-full">
              <div className="flex items-center flex-shrink-0 mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-purple-400"
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
                {evento.descripcion}
              </p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="mt-4 flex justify-end space-x-2 border-t border-gray-700 pt-3">
          <button
            className="cursor-pointer p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 rounded transition-colors duration-200"
            title="Editar evento"
            onClick={() => onEdit(evento)}
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
            title="Eliminar evento"
            onClick={() => onDelete(evento)}
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

export default EventoCards;