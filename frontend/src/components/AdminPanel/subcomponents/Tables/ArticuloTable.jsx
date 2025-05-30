import React, { useState, useEffect, useRef } from "react";

function ArticuloTable({ articulos, visibleColumns, onEdit, onDelete }) {
  const [showTable, setShowTable] = useState(false);
  const [selectedArticulo, setSelectedArticulo] = useState(null);
  const [showAutoresModal, setShowAutoresModal] = useState(false);
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
    if (showAutoresModal) {
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
  }, [showAutoresModal]);

  const openModal = (articulo) => {
    setSelectedArticulo(articulo);
    setShowAutoresModal(true);
  };

  const closeModal = () => {
    setShowAutoresModal(false);
  };

  const columnLabels = {
    id: "ID",
    nombre_articulo: "Título",
    nombre_revista: "Revista",
    pais_publicacion: "País",
    ano_publicacion: "Año",
    fecha_publicacion: "Fecha Publicación",
    doi: "DOI",
    abstracto: "Resumen",
    investigadores: "Autores",
    estatus: "Activo",
    estado: "Estado",
  };

  const formatColumnValue = (column, value, articulo) => {
    if (column === "id") {
      return (
        <div className="flex items-center">
          <span className="flex items-center justify-center bg-gray-700 text-gray-300 rounded-full h-6 w-6 text-xs font-medium">
            {value}
          </span>
        </div>
      );
    }

    if (column === "nombre_articulo") {
      return (
        <div className="font-medium text-blue-300 hover:text-blue-200 transition-colors">
          {value}
        </div>
      );
    }

    if (column === "estatus") {
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value
              ? "bg-green-900/60 text-green-300"
              : "bg-red-900/60 text-red-300"
          }`}
        >
          {value ? "Activo" : "Inactivo"}{" "}
          {/* Cambiado de "Publicado/No Publicado" a "Activo/Inactivo" */}
        </span>
      );
    }

    if (column === "ano_publicacion") {
      return <span className="text-amber-300">{value}</span>;
    }

    if (column === "fecha_publicacion") {
      if (!value) return "—";
      try {
        const fecha = new Date(value);
        return fecha.toLocaleDateString();
      } catch (e) {
        console.error("Error al formatear la fecha:", e);
        return value;
      }
    }

    if (column === "doi") {
      if (!value) return "—";
      return (
        <a
          href={`https://doi.org/${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          {value}
        </a>
      );
    }

    if (column === "abstracto") {
      if (!value) return "—";

      return (
        <div className="max-w-md">
          <span className="text-sm text-gray-200 cursor-help" title={value}>
            {value.length > 100 ? `${value.substring(0, 100)}...` : value}
          </span>
        </div>
      );
    }

    if (column === "investigadores") {
      if (!articulo.autores || articulo.autores.length === 0) {
        return <span className="text-gray-400">Sin autores</span>;
      }

      return (
        <button
          onClick={() => openModal(articulo)}
          className="cursor-pointer p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-900/20 rounded transition-colors duration-200"
          title={`Ver ${articulo.autores.length} autores`}
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
              {articulo.autores.length}
            </span>
          </div>
        </button>
      );
    }

    if (column === "estado") {
      let bgColor, textColor;

      switch (value) {
        case "En Proceso":
          bgColor = "bg-blue-900/60";
          textColor = "text-blue-300";
          break;
        case "Terminado":
          bgColor = "bg-yellow-900/60";
          textColor = "text-yellow-300";
          break;
        case "En Revista":
          bgColor = "bg-purple-900/60";
          textColor = "text-purple-300";
          break;
        case "Publicado":
          bgColor = "bg-green-900/60";
          textColor = "text-green-300";
          break;
        default:
          bgColor = "bg-gray-900/60";
          textColor = "text-gray-300";
      }

      return (
        <span
          className={`px-2 py-1 text-xs rounded-full ${bgColor} ${textColor}`}
        >
          {value}
        </span>
      );
    }

    return value || "—";
  };

  if (articulos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No hay artículos para mostrar
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
              {articulos.map((articulo, index) => (
                <tr
                  key={articulo.id}
                  className="hover:bg-gray-700/50 transition-colors duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {visibleColumns.map((column) => (
                    <td
                      key={column}
                      className="px-4 py-2 whitespace-nowrap text-sm text-gray-200"
                    >
                      {formatColumnValue(column, articulo[column], articulo)}
                    </td>
                  ))}
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        className="cursor-pointer p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
                        title="Editar"
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
                        className="cursor-pointer p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors duration-200"
                        title="Eliminar"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Autores */}
      {showAutoresModal && selectedArticulo && (
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
            {/* Encabezado del modal */}
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-amber-400"
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
                Autores del Artículo
              </h3>
              <button
                onClick={closeModal}
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

            {/* Información del artículo */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-grow">
                  <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Artículo
                  </h4>
                  <p className="text-blue-300 font-medium text-lg">
                    {selectedArticulo.nombre_articulo}
                  </p>
                </div>
                <div className="mt-2 md:mt-0 flex items-center">
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-gray-400">Revista</span>
                    <span className="text-gray-300">
                      {selectedArticulo.nombre_revista}
                    </span>
                  </div>
                  <div className="flex flex-col ml-6 text-right">
                    <span className="text-xs text-gray-400">Año</span>
                    <span className="text-amber-300">
                      {selectedArticulo.ano_publicacion ||
                        (selectedArticulo.fecha_publicacion
                          ? new Date(
                              selectedArticulo.fecha_publicacion
                            ).getFullYear()
                          : "—")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <div className="h-1 flex-grow bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500/50 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 overflow-auto max-h-[50vh]">
              {selectedArticulo.autores &&
              selectedArticulo.autores.length > 0 ? (
                <>
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
                      El orden indica la posición del autor en la publicación.
                      El autor con orden 1 es el autor principal.
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {[...selectedArticulo.autores]
                      .sort((a, b) => a.orden_autor - b.orden_autor)
                      .map((autor, index) => (
                        <li
                          key={`${autor.investigador}-${index}`}
                          className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-800/30 hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-lg font-medium text-indigo-300 mr-4">
                            {autor.orden_autor}
                          </div>
                          <div className="flex-grow">
                            <p className="text-white font-medium">
                              {autor.investigador_nombre}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {autor.orden_autor === 1 ? (
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
                                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2 2m0 0l2 2m-2-2l-2 2m-2 2l2 2m0 0l2 2m-2-2l-2 2"
                                    />
                                  </svg>
                                  Autor principal
                                </span>
                              ) : (
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
                                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                  </svg>
                                  Coautor
                                </span>
                              )}
                            </p>
                          </div>
                          {autor.orden_autor === 1 && (
                            <div className="flex-shrink-0 bg-green-900/20 text-green-400 rounded-md py-1 px-2 text-xs">
                              Principal
                            </div>
                          )}
                        </li>
                      ))}
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
                    Sin autores
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Este artículo no tiene autores registrados
                  </p>
                </div>
              )}
            </div>

            {/* Pie del modal */}
            <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={closeModal}
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

export default ArticuloTable;
