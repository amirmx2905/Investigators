import React, { useState, useEffect } from "react";
import api from "../../../../api/apiConfig";

function LineaCards({ items, onEdit, onDelete }) {
  const [visibleItems, setVisibleItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [lineaDetalle, setLineaDetalle] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  const handleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    
    setExpandedId(id);
    setCargandoDetalle(true);
    
    try {
      const response = await api.get(`/lineas-investigacion/${id}/investigadores/`);
      const investigadoresData = response.data || [];
      
      // Obtener estadísticas si están disponibles
      let estadisticas = {};
      try {
        const statsResponse = await api.get(`/lineas-investigacion/${id}/estadisticas/`);
        estadisticas = statsResponse.data || {};
      } catch (error) {
        console.error(`Error al cargar estadísticas de la línea ${id}:`, error);
      }
      
      // Encontrar la línea en los items
      const lineaActual = items.find(item => item.id === id);
      
      if (lineaActual) {
        setLineaDetalle({
          ...lineaActual,
          investigadores: investigadoresData,
          estadisticas
        });
      }
    } catch (error) {
      console.error(`Error al cargar detalle de la línea ${id}:`, error);
    } finally {
      setCargandoDetalle(false);
    }
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
        No hay líneas de investigación para mostrar
      </div>
    );
  }

  return (
    <>
      {items.map((linea, index) => (
        <LineaCard
          key={linea.id}
          linea={linea}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          expanded={expandedId === linea.id}
          onExpand={() => handleExpand(linea.id)}
          detalle={expandedId === linea.id ? lineaDetalle : null}
          cargandoDetalle={expandedId === linea.id && cargandoDetalle}
        />
      ))}
    </>
  );
}

function LineaCard({ linea, index, onEdit, onDelete, expanded, onExpand, detalle, cargandoDetalle }) {
  return (
    <div
      className={`bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-purple-900/20 ${
        expanded
          ? "hover:border-purple-500/50 ring-1 ring-purple-500/20 col-span-full"
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
            {linea.nombre ? linea.nombre.charAt(0).toUpperCase() : "L"}
          </div>

          <div className="ml-3 flex-grow min-w-0">
            <h3 className="font-semibold text-white flex items-center space-x-2">
              <span className="truncate">{linea.nombre}</span>
            </h3>
            <p className="text-sm text-gray-400 truncate">
              linea de investigación
            </p>
          </div>

          {/* Botón de expandir */}
          <button
            onClick={onExpand}
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

        {/* Badge de ID */}
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span className="text-gray-400">ID:</span>
            <span className="ml-1.5 font-medium text-gray-200">
              {linea.id}
            </span>
          </div>
        </div>

        {/* Contenido expandible */}
        {expanded && (
          <div className="mt-4 border-t border-gray-700 pt-4">
            {cargandoDetalle ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
              </div>
            ) : detalle ? (
              <div className="space-y-6">
                {/* Sección de Investigadores */}
                <div className="space-y-2">
                  <h4 className="text-lg text-white font-medium flex items-center">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Investigadores Asociados
                  </h4>
                  
                  {detalle.investigadores && detalle.investigadores.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {detalle.investigadores.map(investigador => (
                        <div 
                          key={investigador.id}
                          className="bg-gray-800/60 hover:bg-gray-800/80 border border-gray-700 rounded-lg p-3 flex items-center"
                        >
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                            {investigador.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <h5 className="font-medium text-white">{investigador.nombre}</h5>
                            <p className="text-xs text-gray-400">{investigador.correo}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-400 bg-gray-800/30 rounded-lg border border-gray-700/50">
                      No hay investigadores asociados a esta línea
                    </div>
                  )}
                </div>
                
                {/* Aquí puedes agregar más secciones si tienes estadísticas disponibles */}
                {detalle.estadisticas && Object.keys(detalle.estadisticas).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-lg text-white font-medium flex items-center">
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Estadísticas
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(detalle.estadisticas).map(([key, value]) => (
                        <div 
                          key={key}
                          className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 text-center"
                        >
                          <h6 className="text-gray-400 text-sm mb-1">{key}</h6>
                          <p className="text-xl font-semibold text-purple-300">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                No se pudo cargar la información detallada
              </div>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-4 flex justify-end space-x-2 border-t border-gray-700 pt-3">
          <button
            className="cursor-pointer p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
            title="Editar línea"
            onClick={() => onEdit(linea)}
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
            title="Eliminar línea"
            onClick={() => onDelete(linea)}
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

export default LineaCards;