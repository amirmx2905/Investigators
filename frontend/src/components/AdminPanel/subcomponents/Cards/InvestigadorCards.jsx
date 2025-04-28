import React, { useState, useEffect, useRef } from "react";
import api from "../../../../api/apiConfig";

function InvestigadorCards({ items, onEdit, onDelete }) {
  // eslint-disable-next-line no-unused-vars
  const [visibleItems, setVisibleItems] = useState([]);
  const [investigadoresConUsuario, setInvestigadoresConUsuario] = useState([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [investigadorDetalle, setInvestigadorDetalle] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const detalleRef = useRef(null);

  const handleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setInvestigadorDetalle(null);
      document.dispatchEvent(
        new CustomEvent("investigator-pagination-control", {
          detail: { show: true },
        })
      );
      return;
    }

    setExpandedId(id);
    setCargandoDetalle(true);
    document.dispatchEvent(
      new CustomEvent("investigator-pagination-control", {
        detail: { show: false },
      })
    );

    try {
      const response = await api.get(`/investigadores/${id}/detalle/`);
      setInvestigadorDetalle(response.data);
    } catch (error) {
      console.error("Error al cargar detalle del investigador:", error);
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
    setInvestigadorDetalle(null);
    document.dispatchEvent(
      new CustomEvent("investigator-pagination-control", {
        detail: { show: true },
      })
    );
  };

  useEffect(() => {
    const fetchUsuariosAsignados = async () => {
      setCargandoUsuarios(true);
      try {
        const response = await api.get(
          "/usuarios/?page_size=1000&rol=investigador"
        );
        const usuarios = response.data.results || response.data || [];

        const idsConUsuario = usuarios
          .filter((usuario) => usuario.investigador !== null)
          .map((usuario) => usuario.investigador);
        setInvestigadoresConUsuario(idsConUsuario);
      } catch (error) {
        console.error("Error al cargar usuarios asignados:", error);
      } finally {
        setCargandoUsuarios(false);
      }
    };

    fetchUsuariosAsignados();
  }, []);

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
        No hay investigadores para mostrar
      </div>
    );
  }

  if (cargandoUsuarios) {
    return (
      <div className="col-span-full text-center py-8 text-blue-400 flex flex-col items-center">
        <svg
          className="animate-spin h-8 w-8 mb-2 text-blue-400"
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
        Cargando información de usuarios...
      </div>
    );
  }

  if (expandedId !== null) {
    const investigador = items.find((item) => item.id === expandedId);
    if (!investigador) {
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
          <DetalleInvestigador
            investigador={investigadorDetalle || investigador}
            tieneUsuario={investigadoresConUsuario.includes(investigador.id)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {items.map((investigador, index) => (
        <InvestigadorCard
          key={investigador.id}
          investigador={investigador}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          tieneUsuario={investigadoresConUsuario.includes(investigador.id)}
          expanded={false}
          isFullWidth={false}
          onExpand={() => handleExpand(investigador.id)}
        />
      ))}
    </>
  );
}

function DetalleInvestigador({ investigador, tieneUsuario, onEdit, onDelete }) {
  if (!investigador) return null;

  const nivelSNII = getNivelSNII(investigador);
  const lineasInvestigacion = getLineasInvestigacion(investigador);

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
            <div className="flex-shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl md:text-3xl relative shadow-lg mx-auto sm:mx-0">
              {investigador.nombre?.charAt(0).toUpperCase() || "I"}
              <span
                className={`absolute -bottom-1 -right-1 h-4 w-4 md:h-5 md:w-5 rounded-full border-2 border-gray-800 ${
                  investigador.activo ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {investigador.nombre}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start mt-2 gap-2">
                <span
                  className={`text-xs md:text-sm px-2 py-1 rounded-full border ${nivelSNII.color}`}
                >
                  {nivelSNII.badge}
                </span>
                <span
                  className={`text-xs md:text-sm px-2 py-1 rounded-full ${
                    investigador.activo
                      ? "bg-green-900/60 text-green-300"
                      : "bg-red-900/60 text-red-300"
                  }`}
                >
                  {investigador.activo ? "Activo" : "Inactivo"}
                </span>
                {tieneUsuario && (
                  <span className="text-xs md:text-sm px-2 py-1 rounded-full bg-blue-900/60 text-blue-300">
                    Usuario asignado
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 text-gray-300 border-t border-gray-700/50 pt-4 mt-1">
            {investigador.correo && (
              <a
                href={`mailto:${investigador.correo}`}
                className="flex items-center hover:text-blue-300 transition-colors text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {investigador.correo}
              </a>
            )}
            {investigador.celular && (
              <span className="flex items-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {investigador.celular}
              </span>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-center sm:justify-end space-x-3 border-t border-gray-700/50 pt-4">
            <button
              className="cursor-pointer px-3 py-1.5 md:px-4 md:py-2 bg-blue-900/30 text-blue-300 hover:bg-blue-800/40 rounded-md transition-colors duration-200 flex items-center text-sm"
              onClick={() => onEdit(investigador)}
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
              onClick={() => onDelete(investigador)}
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
        {/* Sección 1: Información General */}
        <Section
          title="Información General"
          icon="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          color="from-blue-600/20 to-indigo-600/10"
        >
          {/* Cambio de grid-cols-3 a grid-cols-2 para mantener la disposición 2x2 hasta 1024px */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <InfoCard
              icon="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              label="Área"
              value={investigador.area_nombre || "No asignada"}
            />
            <InfoCard
              icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              label="Unidad"
              value={investigador.unidad_nombre || "No asignada"}
            />
            <InfoCard
              icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              label="Especialidad"
              value={investigador.especialidad_nombre || "No asignada"}
            />
            <InfoCard
              icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              label="Nivel de Educación"
              value={investigador.nivel_edu_nombre || "No registrado"}
            />
          </div>

          {/* Nueva sección para mostrar todas las líneas de investigación */}
          {lineasInvestigacion.count > 0 && (
            <div className="mt-4 bg-gray-700/30 rounded-lg p-3">
              <h4 className="text-white font-medium mb-2 flex items-center">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Líneas de Investigación ({lineasInvestigacion.count})
              </h4>
              <div className="flex flex-wrap gap-2">
                {lineasInvestigacion.items.map((linea, index) => (
                  <span
                    key={linea.id || index}
                    className="bg-purple-900/40 text-purple-300 px-2 py-1 rounded-md text-sm"
                  >
                    {linea.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Sección 2: Jefatura de Área */}
        {investigador.es_jefe_area && (
          <Section
            title="Jefatura de Área"
            icon="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
            color="from-blue-600/20 to-indigo-600/10"
          >
            {investigador.jefe_de_areas &&
            investigador.jefe_de_areas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investigador.jefe_de_areas.map((jefatura, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg overflow-hidden bg-gray-800/50 border ${
                      jefatura.activo ? "border-blue-500/30" : "border-gray-700"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 border-b ${
                        jefatura.activo
                          ? "border-blue-500/30 bg-blue-900/20"
                          : "border-gray-700 bg-gray-700/30"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-white">
                          {jefatura.area_nombre}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            jefatura.activo
                              ? "bg-green-900/60 text-green-300"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {jefatura.activo ? "Actual" : "Anterior"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Desde:</p>
                          <p className="text-gray-200">
                            {formatDate(jefatura.fecha_inicio)}
                          </p>
                        </div>
                        {jefatura.fecha_fin && (
                          <div>
                            <p className="text-gray-400 text-sm">Hasta:</p>
                            <p className="text-gray-200">
                              {formatDate(jefatura.fecha_fin)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No se encontraron datos de jefatura.
              </div>
            )}
          </Section>
        )}

        {/* Sección 3: Proyectos */}
        <Section
          title="Proyectos de Investigación"
          icon="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
          color="from-blue-600/20 to-indigo-600/10"
        >
          {/* Proyectos liderados */}
          {investigador.proyectos_liderados &&
            investigador.proyectos_liderados.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium text-white mb-3 flex items-center">
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
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  Proyectos como Líder
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {investigador.proyectos_liderados.map((proyecto) => (
                    <ProyectoCard
                      key={proyecto.id}
                      proyecto={proyecto}
                      formatDate={formatDate}
                      isLeader={true}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* Proyectos como participante */}
          {investigador.proyectos_participante &&
            investigador.proyectos_participante.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-white mb-3 flex items-center">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Proyectos como Colaborador
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {investigador.proyectos_participante.map((proyecto) => (
                    <ProyectoCard
                      key={proyecto.id}
                      proyecto={proyecto}
                      formatDate={formatDate}
                      isLeader={false}
                    />
                  ))}
                </div>
              </div>
            )}

          {(!investigador.proyectos_liderados ||
            investigador.proyectos_liderados.length === 0) &&
            (!investigador.proyectos_participante ||
              investigador.proyectos_participante.length === 0) && (
              <div className="text-center py-8 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-500 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                No participa en ningún proyecto.
              </div>
            )}
        </Section>

        {/* Sección 4: Eventos */}
        <Section
          title="Eventos"
          icon="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
          color="from-indigo-700/20 to-blue-700/10"
        >
          {investigador.eventos && investigador.eventos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {investigador.eventos.map((evento, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/60 hover:bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden transition-all"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium text-white pr-3">
                        {evento.nombre}
                      </h5>
                      <span className="bg-amber-900/30 text-amber-300 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                        {evento.rol || "Participante"}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-400">
                        <span className="text-purple-300">Tipo: </span>
                        {evento.tipo || "N/A"}
                      </div>
                      <div className="text-gray-400">
                        <span className="text-purple-300">Lugar: </span>
                        {evento.lugar || "N/A"}
                      </div>
                      <div className="col-span-2 text-gray-400 mt-1">
                        <span className="text-purple-300">Fecha: </span>
                        {formatDate(evento.fecha_inicio)}{" "}
                        {evento.fecha_fin &&
                          `- ${formatDate(evento.fecha_fin)}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No ha participado en eventos.
            </div>
          )}
        </Section>

        {/* Sección 5: Artículos */}
        <Section
          title="Artículos"
          icon="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          color="from-amber-600/20 to-orange-600/10"
        >
          {investigador.articulos && investigador.articulos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {investigador.articulos.map((articulo, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/60 hover:bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden transition-all"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium text-white pr-3">
                        {articulo.nombre}
                      </h5>
                      {articulo.es_autor_principal ? (
                        <span className="bg-green-900/30 text-green-300 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                          Autor Principal
                        </span>
                      ) : (
                        <span className="bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                          Coautor ({articulo.orden_autor})
                        </span>
                      )}
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-amber-300">Revista:</span>
                        <span className="text-gray-300 max-w-[65%] text-right truncate">
                          {articulo.revista}
                        </span>
                      </div>
                      <div className="mt-1 text-gray-400">
                        Publicado el {formatDate(articulo.fecha)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No ha publicado artículos.
            </div>
          )}
        </Section>

        {/* Sección 6: Estudiantes Asesorados */}
        <Section
          title="Estudiantes en Asesoría"
          icon="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
          color="from-emerald-600/20 to-green-600/10"
        >
          {investigador.estudiantes && investigador.estudiantes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {investigador.estudiantes.map((estudiante, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/60 hover:bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden transition-all"
                >
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                        {estudiante.nombre
                          ? estudiante.nombre.charAt(0).toUpperCase()
                          : "E"}
                      </div>
                      <div className="ml-3">
                        <h5 className="font-medium text-white line-clamp-1">
                          {estudiante.nombre}
                        </h5>
                        <div className="flex items-center mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-300">
                            {estudiante.tipo_estudiante_nombre || "Estudiante"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Carrera:</span>
                        <span className="text-gray-300">
                          {estudiante.carrera_nombre || "No especificada"}
                        </span>
                      </div>
                      {estudiante.activo !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Estado:</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              estudiante.activo
                                ? "bg-green-900/60 text-green-300"
                                : "bg-red-900/60 text-red-300"
                            }`}
                          >
                            {estudiante.activo ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No asesora a ningún estudiante actualmente.
            </div>
          )}
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

function ProyectoCard({ proyecto, formatDate, isLeader }) {
  return (
    <div
      className={`relative bg-gray-800/60 hover:bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden transition-all ${
        isLeader ? "ring-1 ring-blue-500/30" : ""
      }`}
    >
      <div className="p-4">
        <h5 className="font-medium text-white">{proyecto.nombre}</h5>
        <div className="flex flex-wrap gap-2 mt-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${getStatusStyles(
              proyecto.estado
            )}`}
          >
            {proyecto.estado || "Sin estado"}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-400">
          <div>
            <span className="text-blue-300">Inicio:</span>
            <p className="text-gray-200">{formatDate(proyecto.fecha_inicio)}</p>
          </div>
          <div>
            <span className="text-blue-300">Fin:</span>
            <p className="text-gray-200">
              {proyecto.fecha_fin ? formatDate(proyecto.fecha_fin) : "En curso"}
            </p>
          </div>
          {!isLeader && proyecto.orden_importancia && (
            <div className="col-span-2 mt-1">
              <span className="text-blue-300">Importancia:</span>
              <p className="text-gray-200">{proyecto.orden_importancia}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-gray-700/40 hover:bg-gray-700/50 rounded-md p-4 transition-colors duration-200">
      <div className="flex items-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-blue-400 mr-2"
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

function InvestigadorCard({
  investigador,
  index,
  onEdit,
  onDelete,
  tieneUsuario,
  expanded = false,
  isFullWidth = false,
  onExpand,
}) {
  const nivelSNII = getNivelSNII(investigador);
  const lineasInvestigacion = getLineasInvestigacion(investigador);

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
      } ${tieneUsuario ? "ring-1 ring-blue-500/30" : ""} ${
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
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl relative">
            {investigador.nombre
              ? investigador.nombre.charAt(0).toUpperCase()
              : "I"}
            <span
              className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-gray-800 ${
                investigador.activo ? "bg-green-500" : "bg-red-500"
              }`}
              title={investigador.activo ? "Activo" : "Inactivo"}
            ></span>
          </div>

          <div className="ml-3 flex-grow min-w-0">
            <h3 className="font-semibold text-white flex items-center space-x-2">
              <span className="truncate">{investigador.nombre}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${nivelSNII.color} whitespace-nowrap`}
              >
                {nivelSNII.badge}
              </span>
            </h3>
            <p className="text-sm text-gray-400 truncate">
              {investigador.correo}
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
              {investigador.id}
            </span>

            {tieneUsuario && (
              <span
                className="ml-2 text-blue-400 text-xs flex items-center"
                title="Tiene usuario asignado"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
          </div>
          <div className="flex items-center">
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                investigador.activo
                  ? "bg-green-900/60 text-green-300"
                  : "bg-red-900/60 text-red-300"
              }`}
            >
              {investigador.activo ? "Activo" : "Inactivo"}
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
              <span className="text-gray-400">Especialidad:</span>
              <span className="ml-1.5 text-gray-200 block truncate">
                {investigador.especialidad_nombre || "Sin especialidad"}
              </span>
            </div>
            <div className="bg-gray-700/40 p-2 rounded">
              <span className="text-gray-400">Área:</span>
              <span className="ml-1.5 text-gray-200 block truncate">
                {investigador.area_nombre || "Sin área"}
              </span>
            </div>
            <div className="bg-gray-700/40 p-2 rounded col-span-2">
              <span className="text-gray-400">
                Líneas ({lineasInvestigacion.count}):
              </span>
              <span className="ml-1.5 text-gray-200 block truncate">
                {lineasInvestigacion.text}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-300 overflow-hidden space-y-3 ${
            expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className="bg-gradient-to-r py-2.5 px-3 rounded-md text-white text-sm flex items-center justify-between"
            style={{
              backgroundImage: `linear-gradient(to right, rgb(17, 24, 39, 0.8), rgb(31, 41, 55, 0.8))`,
            }}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 text-blue-400"
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
              <span className="text-blue-300 max-[435px]:hidden">Usuario:</span>
            </div>
            <div className="flex items-center max-[435px]:mx-auto">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  tieneUsuario
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "bg-gradient-to-r from-gray-600 to-gray-500 text-white"
                }`}
              >
                {tieneUsuario ? "Usuario asignado" : "Sin usuario"}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
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
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
                <span className="ml-1.5 text-gray-400">Área:</span>
              </div>
              <span className="text-gray-200 font-medium truncate max-w-[60%]">
                {investigador.area_nombre || "Sin área"}
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="ml-1.5 text-gray-400">Especialidad:</span>
              </div>
              <span className="text-gray-200 font-medium truncate max-w-[60%]">
                {investigador.especialidad_nombre || "Sin especialidad"}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="ml-1.5 text-gray-400">Línea:</span>
              </div>
              <span
                className={`text-gray-200 font-medium truncate max-w-[60%] ${
                  lineasInvestigacion.text === "Sin líneas asignadas"
                    ? "text-gray-400"
                    : ""
                }`}
              >
                {lineasInvestigacion.text}
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="ml-1.5 text-gray-400">Celular:</span>
              </div>
              <span className="text-gray-200 font-medium truncate max-w-[60%]">
                {investigador.celular || "No registrado"}
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="ml-1.5 text-gray-400">Correo:</span>
              </div>
              <span className="text-gray-200 font-medium truncate max-w-[60%]">
                {investigador.correo}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2 border-t border-gray-700 pt-3">
          <button
            data-action="edit"
            className="cursor-pointer p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
            title="Editar investigador"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(investigador);
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
            title="Eliminar investigador"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(investigador);
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

function getNivelSNII(investigador) {
  if (!investigador.nivel_snii || !investigador.nivel_snii_nombre) {
    return {
      badge: "Sin SNII",
      color: "bg-gray-700/50 text-gray-300 border-gray-500/30",
    };
  }

  const nivel = investigador.nivel_snii_nombre.toLowerCase();

  if (nivel.includes("candidato")) {
    return {
      badge: investigador.nivel_snii_nombre,
      color: "bg-cyan-900/40 text-cyan-300 border-cyan-500/30",
    };
  }

  if (/\bnivel i\b/.test(nivel) || nivel === "nivel i") {
    return {
      badge: investigador.nivel_snii_nombre,
      color: "bg-emerald-900/40 text-emerald-300 border-emerald-500/30",
    };
  }

  if (/\bnivel ii\b/.test(nivel) || nivel === "nivel ii") {
    return {
      badge: investigador.nivel_snii_nombre,
      color: "bg-amber-900/40 text-amber-300 border-amber-500/30",
    };
  }

  if (/\bnivel iii\b/.test(nivel) || nivel === "nivel iii") {
    return {
      badge: investigador.nivel_snii_nombre,
      color: "bg-violet-900/40 text-violet-300 border-violet-500/30",
    };
  }

  if (nivel.includes("emérito")) {
    return {
      badge: investigador.nivel_snii_nombre,
      color: "bg-rose-900/40 text-rose-300 border-rose-500/30",
    };
  }

  return {
    badge: investigador.nivel_snii_nombre,
    color: "bg-indigo-900/40 text-indigo-300 border-indigo-500/30",
  };
}

// Reemplazar esta función para obtener todas las líneas de investigación
function getLineasInvestigacion(investigador) {
  if (investigador.lineas && investigador.lineas.length > 0) {
    return {
      count: investigador.lineas.length,
      items: investigador.lineas,
      text: investigador.lineas.map((linea) => linea.nombre).join(", "),
    };
  }
  return {
    count: 0,
    items: [],
    text: "Sin líneas asignadas",
  };
}

function getStatusStyles(status) {
  if (!status) return "bg-gray-700 text-gray-300";

  const statusLower = status.toLowerCase();

  if (
    statusLower.includes("complet") ||
    statusLower.includes("terminad") ||
    statusLower.includes("finaliz")
  ) {
    return "bg-green-900/60 text-green-300";
  }

  if (
    statusLower.includes("progres") ||
    statusLower.includes("curso") ||
    statusLower.includes("desarroll")
  ) {
    return "bg-blue-900/60 text-blue-300";
  }

  if (statusLower.includes("pausa") || statusLower.includes("esper")) {
    return "bg-amber-900/60 text-amber-300";
  }

  if (statusLower.includes("cancel") || statusLower.includes("abandon")) {
    return "bg-red-900/60 text-red-300";
  }

  return "bg-purple-900/60 text-purple-300";
}

export default InvestigadorCards;
