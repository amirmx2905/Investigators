import React, { useState } from "react";

function UsuarioCards({ items, onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-gray-400">
        No hay usuarios para mostrar
      </div>
    );
  }

  return (
    <>
      {items.map((usuario, index) => (
        <UserCard
          key={usuario.id}
          usuario={usuario}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}

function UserCard({ usuario, index, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const getVinculacion = () => {
    if (usuario.rol === "investigador" && usuario.investigador_nombre) {
      return {
        text: usuario.investigador_nombre,
        badge: "Investigador",
        color: "from-blue-600 to-indigo-600",
        showText: true,
      };
    } else if (usuario.rol === "estudiante" && usuario.estudiante_nombre) {
      return {
        text: usuario.estudiante_nombre,
        badge: "Estudiante",
        color: "from-emerald-600 to-teal-600",
        showText: true,
      };
    } else if (usuario.rol === "admin") {
      return {
        text: "",
        badge: "Admin",
        color: "from-purple-600 to-fuchsia-600",
        showText: false,
      };
    }
    return {
      text: "",
      badge: "No vinculado",
      color: "from-gray-600 to-gray-500",
      showText: false,
    };
  };

  const getRolColor = () => {
    switch (usuario.rol?.toLowerCase()) {
      case "admin":
        return "bg-purple-900/40 text-purple-300 border-purple-500/30";
      case "investigador":
        return "bg-blue-900/40 text-blue-300 border-blue-500/30";
      case "estudiante":
        return "bg-emerald-900/40 text-emerald-300 border-emerald-500/30";
      default:
        return "bg-gray-700/50 text-gray-300 border-gray-500/30";
    }
  };

  const vinculacion = getVinculacion();
  const rolColor = getRolColor();

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
      {/* Contenido de la tarjeta */}
      <div className="p-4">
        {/* Cabecera con foto, nombre y banner de status/rol */}
        <div className="flex items-center mb-2">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl relative">
            {usuario.nombre_usuario
              ? usuario.nombre_usuario.charAt(0).toUpperCase()
              : "U"}

            {/* Indicador de estado (activo/inactivo) */}
            <span
              className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-gray-800 ${
                usuario.activo ? "bg-green-500" : "bg-red-500"
              }`}
              title={usuario.activo ? "Activo" : "Inactivo"}
            ></span>
          </div>

          <div className="ml-3 flex-grow min-w-0">
            <h3 className="font-semibold text-white flex items-center space-x-2">
              <span className="truncate">{usuario.nombre_usuario}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${rolColor} whitespace-nowrap`}
              >
                {usuario.rol || "Usuario"}
              </span>
            </h3>
            <p className="text-sm text-gray-400 truncate">{usuario.correo}</p>
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

        {/* Badge de usuario */}
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
              {usuario.id}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                usuario.activo
                  ? "bg-green-900/60 text-green-300"
                  : "bg-red-900/60 text-red-300"
              }`}
            >
              {usuario.activo ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>

        {/* Contenido expandible */}
        <div
          className={`transition-all duration-300 overflow-hidden space-y-3 ${
            expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* Tarjeta de vinculación - Responsive */}
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-blue-300 max-[435px]:hidden">
                Vinculación:
              </span>
            </div>
            <div className="flex items-center max-[435px]:mx-auto">
              {vinculacion.showText && (
                <span className="text-gray-300 mr-2 truncate max-w-[120px]">
                  {vinculacion.text}
                </span>
              )}
              <span
                className={`text-xs px-1.5 py-0.5 rounded bg-gradient-to-r ${vinculacion.color} text-white`}
              >
                {vinculacion.badge}
              </span>
            </div>
          </div>

          {/* Detalles en grid */}
          <div className="space-y-2 text-sm">
            {/* Nombre de usuario (si existe) */}
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="ml-1.5 text-gray-400">Usuario:</span>
              </div>
              <span className="text-gray-200 font-medium truncate max-w-[60%]">
                {usuario.nombre_usuario}
              </span>
            </div>

            {/* Rol - Ahora a ancho completo */}
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
                <span className="ml-1.5 text-gray-400">Rol:</span>
              </div>
              <span className="text-gray-200 font-medium truncate max-w-[60%]">
                {usuario.rol}
              </span>
            </div>

            {/* Fecha de creación (si existe) - Ancho completo */}
            {usuario.fecha_creacion && (
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
                  <span className="ml-1.5 text-gray-400">Creado:</span>
                </div>
                <span className="text-gray-200 truncate max-w-[60%]">
                  {new Date(usuario.fecha_creacion).toLocaleDateString(
                    "es-ES",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            )}

            {/* Última actividad (si existe) */}
            {usuario.ultima_actividad && (
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="ml-1.5 text-gray-400">Últ. actividad:</span>
                </div>
                <span className="text-gray-200 truncate max-w-[60%]">
                  {new Date(usuario.ultima_actividad).toLocaleString("es-ES")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="cursor-pointer p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
            title="Editar usuario"
            onClick={() => onEdit(usuario)}
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
            title="Eliminar usuario"
            onClick={() => onDelete(usuario)}
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

export default UsuarioCards;
