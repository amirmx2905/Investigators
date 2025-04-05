import React, { useState, useEffect, useRef } from "react";

function EventoTable({ eventos, visibleColumns, onEdit, onDelete }) {
  const [showTable, setShowTable] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [showParticipantesModal, setShowParticipantesModal] = useState(false);
  const [tiposEvento, setTiposEvento] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTable(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (showParticipantesModal) {
      const scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      const tabNavigation = document.querySelector(".admin-fadeIn");
      if (tabNavigation) {
        tabNavigation.style.zIndex = "20";
      }

      if (modalRef.current) {
        setTimeout(() => {
          modalRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }
  }, [showParticipantesModal]);

  useEffect(() => {
    async function fetchTiposEvento() {
      try {
        const { eventoService } = await import("../../../../api/services/eventoService");
        const tipos = await eventoService.getTiposEvento();
        window.tiposEventoCache = tipos;
        setTiposEvento(tipos);
      } catch (error) {
        console.error("Error al cargar tipos de evento:", error);
      }
    }

    if (!window.tiposEventoCache) {
      fetchTiposEvento();
    } else {
      setTiposEvento(window.tiposEventoCache);
    }
  }, []);

  const openModal = (evento) => {
    setSelectedEvento(evento);
    setShowParticipantesModal(true);
  };

  const closeModal = () => {
    setShowParticipantesModal(false);
  };

  const columnLabels = {
    id: "ID",
    nombre_evento: "Nombre",
    tipo_evento_nombre: "Tipo",
    descripcion: "Descripción",
    fecha_inicio: "Fecha Inicio",
    fecha_fin: "Fecha Fin",
    lugar: "Lugar",
    empresa_invita: "Organizado por",
    num_participantes: "Participantes",
    investigadores: "Participantes",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const fecha = new Date(dateString);
      return fecha.toLocaleDateString();
    } catch (e) {
      console.error("Error al formatear la fecha:", e);
      return dateString;
    }
  };

  const getSafeValue = (value) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "object") return JSON.stringify(value);
    return value;
  };

  const formatColumnValue = (column, value, evento) => {
    if (column === "investigadores") {
      const numParticipantes = Array.isArray(value) ? value.length : 0;

      if (!numParticipantes) {
        return <span className="text-gray-400">Sin participantes</span>;
      }

      return (
        <button
          onClick={() => openModal(evento)}
          className="cursor-pointer p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-900/20 rounded transition-colors duration-200"
          title={`Ver ${numParticipantes} participantes`}
        >
          <div className="flex items-center">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="ml-1 text-xs font-medium bg-amber-900/40 px-1.5 py-0.5 rounded-full">
              {numParticipantes}
            </span>
          </div>
        </button>
      );
    }

    if (
      value !== null &&
      typeof value === "object" &&
      !React.isValidElement(value)
    ) {
      return JSON.stringify(value);
    }

    if (column === "id") {
      return (
        <div className="flex items-center">
          <span className="flex items-center justify-center bg-gray-700 text-gray-300 rounded-full h-6 w-6 text-xs font-medium">
            {value}
          </span>
        </div>
      );
    }

    if (column === "nombre_evento") {
      return (
        <div className="font-medium text-blue-300 hover:text-blue-200 transition-colors">
          {value}
        </div>
      );
    }

    if (column === "tipo_evento_nombre") {
      if (evento.tipo_evento_nombre) {
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-indigo-900/40 text-indigo-300">
            {evento.tipo_evento_nombre}
          </span>
        );
      }
      
      if (value) {
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-indigo-900/40 text-indigo-300">
            {value}
          </span>
        );
      }

      if (
        evento.tipo_evento &&
        typeof evento.tipo_evento === "object" &&
        evento.tipo_evento.nombre
      ) {
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-indigo-900/40 text-indigo-300">
            {evento.tipo_evento.nombre}
          </span>
        );
      }

      if (evento.tipo_evento_obj && evento.tipo_evento_obj.nombre) {
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-indigo-900/40 text-indigo-300">
            {evento.tipo_evento_obj.nombre}
          </span>
        );
      }

      if (
        evento.tipo_evento &&
        (typeof evento.tipo_evento === "number" ||
          !isNaN(parseInt(evento.tipo_evento)))
      ) {
        const tipoEncontrado = tiposEvento.find(
          (tipo) => tipo.id === parseInt(evento.tipo_evento)
        );
        
        if (tipoEncontrado) {
          return (
            <span className="px-2 py-1 text-xs rounded-full bg-indigo-900/40 text-indigo-300">
              {tipoEncontrado.nombre}
            </span>
          );
        }
        
        if (window.tiposEventoCache && window.tiposEventoCache.length > 0) {
          const tipoEncontradoCache = window.tiposEventoCache.find(
            (tipo) => tipo.id === parseInt(evento.tipo_evento)
          );

          if (tipoEncontradoCache) {
            return (
              <span className="px-2 py-1 text-xs rounded-full bg-indigo-900/40 text-indigo-300">
                {tipoEncontradoCache.nombre}
              </span>
            );
          }
        }

        return (
          <span className="px-2 py-1 text-xs rounded-full bg-indigo-900/40 text-indigo-300">
            Tipo {evento.tipo_evento}
          </span>
        );
      }

      return (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-700/40 text-gray-300">
          Sin tipo
        </span>
      );
    }

    if (column === "fecha_inicio" || column === "fecha_fin") {
      return formatDate(value);
    }

    if (column === "descripcion") {
      if (!value) return "—";

      return (
        <div className="max-w-md">
          <span className="text-sm text-gray-200 cursor-help" title={value}>
            {value.length > 100 ? `${value.substring(0, 100)}...` : value}
          </span>
        </div>
      );
    }

    if (column === "num_participantes") {
      if (!value || value === 0) {
        return <span className="text-gray-400">Sin participantes</span>;
      }

      return (
        <button
          onClick={() => openModal(evento)}
          className="cursor-pointer p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-900/20 rounded transition-colors duration-200"
          title={`Ver ${value} participantes`}
        >
          <div className="flex items-center">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="ml-1 text-xs font-medium bg-amber-900/40 px-1.5 py-0.5 rounded-full">
              {value}
            </span>
          </div>
        </button>
      );
    }

    return getSafeValue(value);
  };

  if (eventos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No hay eventos para mostrar
      </div>
    );
  }

  return (
    <>
      <div
        className={`w-full overflow-hidden transition-all duration-500 ${
          showTable ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="w-full overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-800/80">
                {visibleColumns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700"
                  >
                    {columnLabels[column] || column}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800/40">
              {eventos.map((evento, index) => (
                <tr
                  key={evento.id}
                  className="hover:bg-gray-700/50 transition-colors duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {visibleColumns.map((column) => (
                    <td
                      key={column}
                      className="px-4 py-2 whitespace-nowrap text-sm text-gray-200"
                    >
                      {formatColumnValue(column, evento[column], evento)}
                    </td>
                  ))}
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        className="cursor-pointer p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
                        title="Editar"
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
                        className="cursor-pointer p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors duration-200"
                        title="Eliminar"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showParticipantesModal && selectedEvento && (
        <div
          className="fixed inset-0 z-[99999] overflow-auto bg-gray-900/80 flex items-center justify-center"
          style={{
            animation: "fadeIn 0.2s ease-out forwards",
          }}
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            className="relative bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] border border-gray-700 my-8"
            style={{
              animation: "scaleIn 0.3s ease-out forwards",
            }}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            <div className="bg-gray-800 px-6 py-5 border-b border-gray-700 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 bg-amber-900/30 rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-amber-400"
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
                </div>
                <h3 className="text-lg font-medium text-white">
                  Participantes del Evento
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="cursor-pointer text-gray-400 hover:text-white p-2 hover:bg-gray-700/50 rounded-full transition-colors focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-grow">
                  <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">
                    Evento
                  </h4>
                  <p className="text-blue-300 font-medium text-lg">
                    {selectedEvento.nombre_evento}
                  </p>
                </div>
                <div className="mt-3 md:mt-0 flex items-center space-x-6">
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Tipo
                    </span>
                    <span className="text-gray-300">
                      {selectedEvento.tipo_evento_nombre || 
                       (selectedEvento.tipo_evento_obj && selectedEvento.tipo_evento_obj.nombre) || 
                       "Sin tipo"}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Fecha
                    </span>
                    <span className="text-amber-300">
                      {formatDate(selectedEvento.fecha_inicio)} -{" "}
                      {formatDate(selectedEvento.fecha_fin)}
                    </span>
                  </div>
                </div>
              </div>
              {selectedEvento.lugar && (
                <div className="mt-3 text-sm">
                  <span className="text-gray-400">Lugar:</span>{" "}
                  {selectedEvento.lugar}
                  {selectedEvento.empresa_invita && (
                    <span className="ml-2">
                      • <span className="text-gray-400">Organizado por:</span>{" "}
                      {selectedEvento.empresa_invita}
                    </span>
                  )}
                </div>
              )}
              <div className="mt-4 flex items-center">
                <div className="h-1 flex-grow bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500/50 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-auto max-h-[50vh]">
              {selectedEvento.investigadores &&
              Array.isArray(selectedEvento.investigadores) &&
              selectedEvento.investigadores.length > 0 ? (
                <>
                  <div className="text-sm text-gray-400 bg-gray-800/80 border border-gray-700/50 p-3 mb-4 rounded">
                    <div className="flex">
                      <div className="mr-2 text-amber-400">
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
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      Cada participante tiene un rol específico en el evento.
                      Los participantes con rol "Ponente" o "Expositor" son los
                      principales.
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {selectedEvento.investigadores.map(
                      (participante, index) => (
                        <li
                          key={`${
                            participante.investigador_id || index
                          }-${index}`}
                          className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-800/30 hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-lg font-medium text-amber-300 mr-4">
                            {index + 1}
                          </div>
                          <div className="flex-grow">
                            <p className="text-white font-medium">
                              {participante.nombre || "Investigador"}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              <span className="inline-flex items-center">
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
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                                Investigador
                              </span>
                            </p>
                          </div>
                          <div className="flex-shrink-0 bg-amber-900/20 text-amber-300 rounded-md py-1 px-2 text-xs">
                            {participante.rol_nombre || "Participante"}
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </>
              ) : (
                <div className="text-center py-10 text-gray-400 bg-gray-800/20 border border-gray-700/30 rounded-lg">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-500 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-300">
                    Sin participantes
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Este evento no tiene participantes registrados
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={closeModal}
                className="cursor-pointer px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx = "true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default EventoTable;