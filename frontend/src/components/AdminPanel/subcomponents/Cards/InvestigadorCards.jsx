import React, { useState, useEffect } from "react";
import api from "../../../../api/apiConfig";

function InvestigadorCards({ items, onEdit, onDelete }) {
  const [setVisibleItems] = useState([]);
  const [investigadoresConUsuario, setInvestigadoresConUsuario] = useState([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);

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

        console.log(
          "Investigadores con usuario asignado (cards):",
          idsConUsuario
        );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <>
      {/* Mapear los investigadores */}
      {items.map((investigador, index) => (
        <InvestigadorCard
          key={investigador.id}
          investigador={investigador}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          tieneUsuario={investigadoresConUsuario.includes(investigador.id)}
        />
      ))}
    </>
  );
}

function InvestigadorCard({
  investigador,
  index,
  onEdit,
  onDelete,
  tieneUsuario,
}) {
  const [expanded, setExpanded] = useState(false);

  const getNivelSNII = () => {
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
  };

  const nivelSNII = getNivelSNII();
  const getLineaInvestigacion = () => {
    if (investigador.lineas && investigador.lineas.length > 0) {
      return investigador.lineas[0].nombre;
    }
    return "Sin línea asignada";
  };

  const lineaInvestigacion = getLineaInvestigacion();

  return (
    <div
      className={`bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-blue-900/20 ${
        expanded
          ? "hover:border-blue-500/50 ring-1 ring-blue-500/20"
          : "hover:border-blue-500/30"
      } ${tieneUsuario ? "ring-1 ring-blue-500/30" : ""}`}
      style={{
        animation: "fadeIn 0.5s ease-out forwards",
        animationDelay: `${index * 100}ms`,
        opacity: 0,
      }}
    >
      <div className="p-4">
        {/* Cabecera con foto, nombre y badge */}
        <div className="flex items-center mb-2">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl relative">
            {investigador.nombre
              ? investigador.nombre.charAt(0).toUpperCase()
              : "I"}

            {/* Indicador de estado (activo/inactivo) */}
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

          {/* Botón de expandir/colapsar */}
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

        {/* Badge de ID con indicador si tiene usuario */}
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

        {/* Tarjetas de info (para versión no expandida) */}
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
            {/* Línea de investigación en vista compacta */}
            <div className="bg-gray-700/40 p-2 rounded col-span-2">
              <span className="text-gray-400">Línea:</span>
              <span className="ml-1.5 text-gray-200 block truncate">
                {lineaInvestigacion}
              </span>
            </div>
          </div>
        </div>

        {/* Contenido expandible */}
        <div
          className={`transition-all duration-300 overflow-hidden space-y-3 ${
            expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* Indicador de usuario */}
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

          {/* Detalles en grid */}
          <div className="space-y-2 text-sm">
            {/* Área */}
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

            {/* Especialidad */}
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

            {/* Línea de Investigación */}
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
              <span className={`text-gray-200 font-medium truncate max-w-[60%] ${lineaInvestigacion === "Sin línea asignada" ? "text-gray-400" : ""}`}>
                {lineaInvestigacion}
              </span>
            </div>

            {/* Contacto */}
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

            {/* Correo */}
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

        {/* Botones de acción */}
        <div className="mt-4 flex justify-end space-x-2 border-t border-gray-700 pt-3">
          <button
            className="cursor-pointer p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
            title="Editar investigador"
            onClick={() => onEdit(investigador)}
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
            title="Eliminar investigador"
            onClick={() => onDelete(investigador)}
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

export default InvestigadorCards;