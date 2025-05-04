import React, { useState, useEffect, useRef } from "react";
import api from "../../../../api/apiConfig";

function JefeareaCards({ items, onEdit, onDelete }) {
  // eslint-disable-next-line no-unused-vars
  const [visibleItems, setVisibleItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [jefeAreaDetalle, setJefeAreaDetalle] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const detalleRef = useRef(null);

  const handleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setJefeAreaDetalle(null);
      document.dispatchEvent(
        new CustomEvent("jefearea-pagination-control", {
          detail: { show: true },
        })
      );
      return;
    }

    setExpandedId(id);
    setCargandoDetalle(true);
    document.dispatchEvent(
      new CustomEvent("jefearea-pagination-control", {
        detail: { show: false },
      })
    );

    try {
      const response = await api.get(`/jefesareas/${id}/`);
      setJefeAreaDetalle(response.data);
    } catch (error) {
      console.error("Error al cargar detalle del jefe de área:", error);
    } finally {
      setCargandoDetalle(false);
    }
  };

  useEffect(() => {
    if (expandedId !== null && detalleRef.current) {
      setTimeout(() => {
        const rect = detalleRef.current.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const absoluteTop = rect.top + scrollTop - 16;
        window.scrollTo({
          top: absoluteTop,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [expandedId, cargandoDetalle]);

  const handleClose = () => {
    setExpandedId(null);
    setJefeAreaDetalle(null);
    document.dispatchEvent(
      new CustomEvent("jefearea-pagination-control", {
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
        No hay jefes de área para mostrar
      </div>
    );
  }

  if (expandedId !== null) {
    const jefeArea = items.find((item) => item.id === expandedId);
    if (!jefeArea) {
      setExpandedId(null);
      return null;
    }

    return (
      <div className="col-span-full" ref={detalleRef}>
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
        {cargandoDetalle ? (
          <div className="p-6 bg-gray-800 rounded-lg border border-blue-500/30 flex justify-center items-center">
            <svg
              className="animate-spin h-10 w-10 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : (
          <DetalleJefeArea
            jefeArea={jefeAreaDetalle || jefeArea}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {items.map((jefeArea, index) => (
        <JefeAreaCard
          key={jefeArea.id}
          jefeArea={jefeArea}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          expanded={false}
          isFullWidth={false}
          onExpand={() => handleExpand(jefeArea.id)}
        />
      ))}
    </>
  );
}

function DetalleJefeArea({ jefeArea, onEdit, onDelete }) {
  if (!jefeArea) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-800/80 border border-blue-500/30 rounded-lg overflow-hidden shadow-xl">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-indigo-900/20"></div>
        <div className="relative p-4 md:p-6 flex flex-col gap-5">
          {/* Información principal */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl md:text-3xl relative shadow-lg mx-auto sm:mx-0">
              {jefeArea.area_nombre?.charAt(0).toUpperCase() || "A"}
              <span
                className={`absolute -bottom-1 -right-1 h-4 w-4 md:h-5 md:w-5 rounded-full border-2 border-gray-800 ${
                  jefeArea.activo ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {jefeArea.area_nombre || "Área sin nombre"}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start mt-2 gap-2">
                <span className="text-sm px-2 py-1 rounded-full bg-indigo-900/60 text-indigo-300">
                  {jefeArea.investigador_nombre || "Investigador sin nombre"}
                </span>
                <span
                  className={`text-xs md:text-sm px-2 py-1 rounded-full ${
                    jefeArea.activo
                      ? "bg-green-900/60 text-green-300"
                      : "bg-red-900/60 text-red-300"
                  }`}
                >
                  {jefeArea.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-center sm:justify-end space-x-3 border-t border-gray-700/50 pt-4">
            <button
              className="cursor-pointer px-3 py-1.5 md:px-4 md:py-2 bg-blue-900/30 text-blue-300 hover:bg-blue-800/40 rounded-md transition-colors duration-200 flex items-center text-sm"
              onClick={() => onEdit(jefeArea)}
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
              onClick={() => onDelete(jefeArea)}
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

      {/* Contenedor de secciones con scroll */}
      <div className="p-6 grid grid-cols-1 gap-8">
        {/* Sección: Información de Jefatura */}
        <Section
          title="Información de Jefatura"
          icon="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          color="from-purple-600/20 to-indigo-600/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InfoCard
              icon="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              label="Área"
              value={jefeArea.area_nombre || "No asignada"}
            />
            <InfoCard
              icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              label="Investigador"
              value={jefeArea.investigador_nombre || "No asignado"}
            />
            <InfoCard
              icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              label="Fecha de inicio"
              value={formatDate(jefeArea.fecha_inicio)}
            />
            <InfoCard
              icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              label="Fecha de fin"
              value={jefeArea.fecha_fin ? formatDate(jefeArea.fecha_fin) : "Actualmente en el cargo"}
            />
          </div>

          {/* Estado de la jefatura */}
          <div className="mt-6 bg-gray-700/30 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-3 md:mb-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-8 w-8 mr-3 ${
                  jefeArea.activo ? "text-green-400" : "text-red-400"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {jefeArea.activo ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
              <div>
                <h4 className="text-lg font-medium text-white">
                  Estado de la jefatura
                </h4>
                <p className="text-gray-300">
                  {jefeArea.activo
                    ? "Jefatura activa actualmente"
                    : "Jefatura inactiva (histórica)"}
                </p>
              </div>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                jefeArea.activo
                  ? "bg-green-900/40 text-green-300 border border-green-500/30"
                  : "bg-red-900/40 text-red-300 border border-red-500/30"
              }`}
            >
              {jefeArea.activo ? "ACTIVO" : "INACTIVO"}
            </span>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
  color = "from-gray-700/30 to-gray-800/30",
}) {
  return (
    <section className="rounded-lg overflow-hidden">
      <div
        className={`bg-gradient-to-r ${color} p-4 border-b border-gray-700 flex items-center`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <div className="p-4 bg-gray-900/30 rounded-b-lg">{children}</div>
    </section>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-4 transition-colors duration-200">
      <div className="flex items-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-purple-400 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={icon}
          />
        </svg>
        <span className="text-gray-400">{label}:</span>
      </div>
      <span className="text-gray-200 font-medium">{value}</span>
    </div>
  );
}

function JefeAreaCard({
  jefeArea,
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

  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-purple-900/20 ${
        expanded
          ? "hover:border-purple-500/50 ring-1 ring-purple-500/20"
          : "hover:border-purple-500/30"
      } ${
        isFullWidth ? "col-span-full" : ""
      }`}
      style={{
        animation: "fadeIn 0.5s ease-out forwards",
        animationDelay: `${index * 100}ms`,
        opacity: 0,
        cursor: "pointer",
      }}
      onClick={handleCardClick}
    >
      <div className={`p-4 ${isFullWidth ? "max-w-4xl mx-auto" : ""}`}>
        <div className="flex items-center mb-2">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl relative">
            {jefeArea.area_nombre
              ? jefeArea.area_nombre.charAt(0).toUpperCase()
              : "A"}
            <span
              className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-gray-800 ${
                jefeArea.activo ? "bg-green-500" : "bg-red-500"
              }`}
              title={jefeArea.activo ? "Activo" : "Inactivo"}
            ></span>
          </div>

          <div className="ml-3 flex-grow min-w-0">
            <h3 className="font-semibold text-white truncate">
              {jefeArea.area_nombre || "Área sin nombre"}
            </h3>
            <p className="text-sm text-gray-400 truncate">
              {jefeArea.investigador_nombre || "Investigador sin asignar"}
            </p>
          </div>
        </div>

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
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1"
              />
            </svg>
            <span className="text-gray-400">ID:</span>
            <span className="ml-1.5 font-medium text-gray-200">
              {jefeArea.id}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                jefeArea.activo
                  ? "bg-green-900/60 text-green-300"
                  : "bg-red-900/60 text-red-300"
              }`}
            >
              {jefeArea.activo ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ${
            expanded ? "hidden" : "block"
          }`}
        >
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div className="bg-gray-700/40 p-2 rounded">
              <span className="text-gray-400">Fecha de inicio:</span>
              <span className="ml-1.5 text-gray-200 block truncate">
                {formatDate(jefeArea.fecha_inicio)}
              </span>
            </div>
            <div className="bg-gray-700/40 p-2 rounded">
              <span className="text-gray-400">Fecha de fin:</span>
              <span className="ml-1.5 text-gray-200 block truncate">
                {jefeArea.fecha_fin ? formatDate(jefeArea.fecha_fin) : "En cargo"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2 border-t border-gray-700 pt-3">
          <button
            data-action="edit"
            className="cursor-pointer p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
            title="Editar jefe de área"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(jefeArea);
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
            title="Eliminar jefe de área"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(jefeArea);
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

export default JefeareaCards;