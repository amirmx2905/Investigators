import React, { useState, useEffect, useRef } from "react";

function ProyectoTable({ proyectos, visibleColumns, onEdit, onDelete }) {
  const [showTable, setShowTable] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [showTechModal, setShowTechModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const techModalRef = useRef(null);
  const teamModalRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTable(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        closeModals();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (showTechModal || showTeamModal) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      const tabNavigation = document.querySelector(".admin-fadeIn");
      if (tabNavigation) {
        tabNavigation.style.zIndex = "20";
      }
      if (showTechModal && techModalRef.current) {
        setTimeout(() => {
          techModalRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      } else if (showTeamModal && teamModalRef.current) {
        setTimeout(() => {
          teamModalRef.current.scrollIntoView({
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
  }, [showTechModal, showTeamModal]);

  const openTechModal = (proyecto) => {
    setSelectedProyecto(proyecto);
    setShowTechModal(true);
  };

  const openTeamModal = (proyecto) => {
    setSelectedProyecto(proyecto);
    setShowTeamModal(true);
  };

  const closeModals = () => {
    setShowTechModal(false);
    setShowTeamModal(false);
  };

  const columnLabels = {
    id: "ID",
    nombre: "Nombre",
    estado: "Estado",
    fecha_inicio: "Fecha Inicio",
    fecha_fin: "Fecha Fin",
    lider: "Líder",
    explicacion: "Descripción",
    herramientas: "Herramientas",
    investigadores: "Investigadores",
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

  const formatColumnValue = (column, value, proyecto) => {
    if (column === "id") {
      return (
        <div className="flex items-center">
          <span className="flex items-center justify-center bg-gray-700 text-gray-300 rounded-full h-6 w-6 text-xs font-medium">
            {value}
          </span>
        </div>
      );
    }

    if (column === "estado") {
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full ${getStatusStyles(value)}`}
        >
          {value || "Desconocido"}
        </span>
      );
    }

    if (column === "fecha_inicio" || column === "fecha_fin") {
      if (!value) return "Sin fecha";

      const date = new Date(value);
      if (isNaN(date.getTime())) return value;

      return new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
    }

    if (column === "lider") {
      if (proyecto.lider_nombre) {
        return proyecto.lider_nombre;
      }

      if (value && typeof value === "object" && value.nombre) {
        return value.nombre;
      }

      return "No asignado";
    }

    if (column === "explicacion" || column === "descripcion") {
      if (!value) return "Sin descripción";
      if (value.length > 50) {
        return value.substring(0, 50) + "...";
      }
      return value;
    }

    if (column === "herramientas") {
      if (!proyecto.herramientas || proyecto.herramientas.length === 0) {
        return <span className="text-gray-400">Sin herramientas</span>;
      }

      return (
        <button
          onClick={() => openTechModal(proyecto)}
          className="cursor-pointer p-1 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 rounded transition-colors duration-200"
          title={`Ver ${proyecto.herramientas.length} tecnologías`}
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="ml-1 text-xs font-medium bg-purple-900/40 px-1.5 py-0.5 rounded-full">
              {proyecto.herramientas.length}
            </span>
          </div>
        </button>
      );
    }

    if (column === "investigadores") {
      if (!proyecto.investigadores || proyecto.investigadores.length === 0) {
        return <span className="text-gray-400">Solo líder</span>;
      }

      return (
        <button
          onClick={() => openTeamModal(proyecto)}
          className="cursor-pointer p-1 text-green-400 hover:text-green-300 hover:bg-green-900/20 rounded transition-colors duration-200"
          title={`Ver equipo (${proyecto.investigadores.length + 1} miembros)`}
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="ml-1 text-xs font-medium bg-green-900/40 px-1.5 py-0.5 rounded-full">
              {proyecto.investigadores.length + 1}
            </span>
          </div>
        </button>
      );
    }

    return value !== null && value !== undefined ? value : "—";
  };

  if (!proyectos || proyectos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No hay proyectos para mostrar
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
              {proyectos.map((proyecto, index) => (
                <tr
                  key={proyecto.id}
                  className={`hover:bg-gray-700/50 transition-colors duration-200 ${
                    proyecto.estado?.toLowerCase() === "en progreso"
                      ? "bg-blue-900/10"
                      : proyecto.estado?.toLowerCase() === "concluido"
                      ? "bg-emerald-900/10"
                      : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {visibleColumns.map((column) => (
                    <td
                      key={column}
                      className="px-4 py-2 whitespace-nowrap text-sm text-gray-200"
                    >
                      {formatColumnValue(column, proyecto[column], proyecto)}
                    </td>
                  ))}
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        className="cursor-pointer p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
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
                        className="cursor-pointer p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors duration-200"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Tecnologías */}
      {showTechModal && selectedProyecto && (
        <div
          className="fixed inset-0 z-[99999] overflow-auto bg-gray-900/80 flex items-center justify-center"
          style={{
            animation: "fadeIn 0.2s ease-out forwards",
          }}
          onClick={closeModals}
        >
          <div
            ref={techModalRef}
            className="relative bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] border border-gray-700 my-8"
            style={{
              animation: "scaleIn 0.3s ease-out forwards",
            }}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            {/* Encabezado del modal */}
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-purple-400"
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
                Tecnologías del Proyecto
              </h3>
              <button
                onClick={closeModals}
                className="cursor-pointer text-gray-400 hover:text-white transition-colors focus:outline-none"
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

            {/* Información del proyecto */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-grow">
                  <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Proyecto
                  </h4>
                  <p className="text-blue-300 font-medium text-lg">
                    {selectedProyecto.nombre}
                  </p>
                </div>
                <div className="mt-2 md:mt-0 flex items-center">
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-gray-400">Estado</span>
                    <span
                      className={`text-sm ${
                        selectedProyecto.estado?.toLowerCase() === "en progreso"
                          ? "text-blue-300"
                          : selectedProyecto.estado?.toLowerCase() ===
                            "concluido"
                          ? "text-emerald-300"
                          : selectedProyecto.estado?.toLowerCase() ===
                            "suspendido"
                          ? "text-yellow-300"
                          : selectedProyecto.estado?.toLowerCase() ===
                            "cancelado"
                          ? "text-red-300"
                          : "text-gray-300"
                      }`}
                    >
                      {selectedProyecto.estado || "Desconocido"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <div className="h-1 flex-grow bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500/50 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 overflow-auto max-h-[50vh]">
              {!selectedProyecto.herramientas ||
              selectedProyecto.herramientas.length === 0 ? (
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
                    Sin tecnologías
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Este proyecto no tiene tecnologías registradas
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {selectedProyecto.herramientas.map((herramienta, idx) => (
                    <li
                      key={idx}
                      className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-800/30 hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-lg font-medium text-blue-300 mr-4">
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
                            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                          />
                        </svg>
                      </div>
                      <div className="flex-grow">
                        <p className="text-white font-medium">
                          {typeof herramienta === "object"
                            ? herramienta.nombre
                            : `Herramienta #${herramienta}`}
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
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                            </svg>
                            Tecnología
                          </span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Pie del modal */}
            <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={closeModals}
                className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Equipo */}
      {showTeamModal && selectedProyecto && (
        <div
          className="fixed inset-0 z-[99999] overflow-auto bg-gray-900/80 flex items-center justify-center"
          style={{
            animation: "fadeIn 0.2s ease-out forwards",
          }}
          onClick={closeModals}
        >
          <div
            ref={teamModalRef}
            className="relative bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] border border-gray-700 my-8"
            style={{
              animation: "scaleIn 0.3s ease-out forwards",
            }}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            {/* Encabezado del modal */}
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-400"
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
                Equipo del Proyecto
              </h3>
              <button
                onClick={closeModals}
                className="cursor-pointer text-gray-400 hover:text-white transition-colors focus:outline-none"
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

            {/* Información del proyecto */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-grow">
                  <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Proyecto
                  </h4>
                  <p className="text-blue-300 font-medium text-lg">
                    {selectedProyecto.nombre}
                  </p>
                </div>
                <div className="mt-2 md:mt-0 flex items-center">
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-gray-400">Estado</span>
                    <span
                      className={`text-sm ${
                        selectedProyecto.estado?.toLowerCase() === "en progreso"
                          ? "text-blue-300"
                          : selectedProyecto.estado?.toLowerCase() ===
                            "concluido"
                          ? "text-emerald-300"
                          : selectedProyecto.estado?.toLowerCase() ===
                            "suspendido"
                          ? "text-yellow-300"
                          : selectedProyecto.estado?.toLowerCase() ===
                            "cancelado"
                          ? "text-red-300"
                          : "text-gray-300"
                      }`}
                    >
                      {selectedProyecto.estado || "Desconocido"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <div className="h-1 flex-grow bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500/50 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 overflow-auto max-h-[50vh]">
              <div className="text-sm text-gray-400 bg-gray-800/80 border border-gray-700/50 p-3 mb-4 rounded">
                <div className="flex">
                  <div className="mr-2 text-indigo-400">
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
                        d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  El líder del proyecto dirige y coordina al equipo de
                  investigadores.
                </div>
              </div>

              {/* Líder del proyecto */}
              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
                    />
                  </svg>
                  Líder del Proyecto
                </h5>
                <div className="flex items-center p-3 rounded-lg border border-blue-700/30 bg-blue-900/20">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xl font-medium text-blue-300 mr-4">
                    <span>
                      {selectedProyecto.lider_nombre
                        ? selectedProyecto.lider_nombre.charAt(0)
                        : "?"}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <p className="text-white font-medium">
                      {selectedProyecto.lider_nombre ||
                        (selectedProyecto.lider &&
                        typeof selectedProyecto.lider === "object"
                          ? selectedProyecto.lider.nombre
                          : "No asignado")}
                    </p>
                    <p className="text-xs text-blue-300 mt-0.5">
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
                        Líder del proyecto
                      </span>
                    </p>
                  </div>
                  <div className="flex-shrink-0 bg-blue-900/30 text-blue-300 rounded-md py-1 px-2 text-xs">
                    Líder
                  </div>
                </div>
              </div>

              {/* Investigadores */}
              <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-green-400"
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
                Investigadores Participantes
              </h5>

              {!selectedProyecto.investigadores ||
              selectedProyecto.investigadores.length === 0 ? (
                <div className="text-center py-6 text-gray-400 bg-gray-800/20 border border-gray-700/30 rounded-lg">
                  <svg
                    className="mx-auto h-10 w-10 text-gray-500 mb-2"
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
                  <h3 className="mt-1 text-sm font-medium text-gray-300">
                    No hay investigadores adicionales
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Este proyecto solo cuenta con el líder
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {selectedProyecto.investigadores.map((investigador, idx) => (
                    <li
                      key={idx}
                      className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-800/30 hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600/20 border border-green-500/30 flex items-center justify-center text-sm font-medium text-green-300 mr-4">
                        <span>
                          {typeof investigador === "object" &&
                          investigador.nombre
                            ? investigador.nombre.charAt(0)
                            : idx + 1}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <p className="text-white font-medium">
                          {typeof investigador === "object"
                            ? investigador.nombre
                            : `Investigador #${investigador}`}
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
                            Investigador colaborador
                          </span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Pie del modal */}
            <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={closeModals}
                className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
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

export default ProyectoTable;
