import React, { useState, useEffect, useRef, memo } from "react";
import api from "../../../../api/apiConfig";

function AreaCards({ items, onEdit, onDelete }) {
  const prevItemsRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [visibleItems, setVisibleItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [areaDetalle, setAreaDetalle] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const detalleRef = useRef(null);

  const handleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setAreaDetalle(null);
      document.dispatchEvent(
        new CustomEvent("area-pagination-control", {
          detail: { show: true },
        })
      );
      return;
    }

    setExpandedId(id);
    setCargandoDetalle(true);
    document.dispatchEvent(
      new CustomEvent("area-pagination-control", {
        detail: { show: false },
      })
    );

    try {
      const response = await api.get(`/areas/${id}/`);
      setAreaDetalle(response.data);
    } catch (error) {
      console.error("Error al cargar detalle del área:", error);
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
    setAreaDetalle(null);
    document.dispatchEvent(
      new CustomEvent("area-pagination-control", {
        detail: { show: true },
      })
    );
  };

  useEffect(() => {
    if (JSON.stringify(prevItemsRef.current) !== JSON.stringify(items)) {
      prevItemsRef.current = items;
    }
  }, [items]);

  useEffect(() => {
    if (Array.isArray(items)) {
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
    } else {
      setVisibleItems([]);
    }
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="w-full flex justify-center items-center p-8 bg-gray-800/60 rounded-lg border border-gray-700">
        <p className="text-gray-400 text-lg">
          No hay áreas registradas. Crea una nueva área usando el botón 
          "Nueva Área".
        </p>
      </div>
    );
  }

  if (expandedId !== null) {
    const area = items.find((item) => item.id === expandedId);
    if (!area) {
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
          <div className="bg-gray-800/80 border border-blue-500/30 rounded-lg p-8 flex justify-center">
            <svg
              className="animate-spin h-12 w-12 text-blue-500"
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
          <DetalleArea
            area={areaDetalle || area}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {items.map((area, index) => (
        <AreaCard
          key={area.id}
          area={area}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          expanded={false}
          isFullWidth={false}
          onExpand={() => handleExpand(area.id)}
        />
      ))}
    </>
  );
}

function DetalleArea({ area, onEdit, onDelete }) {
  if (!area) return null;

  return (
    <div className="bg-gray-800/80 border border-blue-500/30 rounded-lg overflow-hidden shadow-xl">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/20 to-emerald-900/20"></div>
        <div className="relative p-4 md:p-6 flex flex-col gap-5">
          {/* Información principal */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold text-2xl md:text-3xl relative shadow-lg mx-auto sm:mx-0">
              {area.nombre?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {area.nombre || "Área sin nombre"}
              </h2>
              <p className="text-gray-300 mt-1">
                ID: {area.id} • Unidad: {area.unidad_nombre || "Sin asignar"}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start mt-2 gap-2">
                <span className="text-sm px-2 py-1 rounded-full bg-teal-900/60 text-teal-300">
                  {area.unidad_nombre || "Sin unidad asignada"}
                </span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-center sm:justify-end space-x-3 border-t border-gray-700/50 pt-4">
            <button
              className="cursor-pointer px-3 py-1.5 md:px-4 md:py-2 bg-blue-900/30 text-blue-300 hover:bg-blue-800/40 rounded-md transition-colors duration-200 flex items-center text-sm"
              onClick={() => onEdit(area)}
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
              onClick={() => onDelete(area)}
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
        {/* Sección: Información Detallada */}
        <Section
          title="Información del Área"
          icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          color="from-teal-600/20 to-emerald-600/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InfoCard
              icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              label="Nombre"
              value={area.nombre || "No asignado"}
            />
            <InfoCard
              icon="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              label="Unidad"
              value={area.unidad_nombre || "No asignada"}
            />
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
    <div className="relative">
      <div className={`bg-gradient-to-r ${color} rounded-lg p-5`}>
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gray-800/50 rounded-lg mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-teal-400"
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
          </div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-start p-3 bg-gray-800/40 rounded-lg">
      <div className="flex-shrink-0 p-1.5 bg-gray-700/50 rounded-md mr-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-teal-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d={icon}
          />
        </svg>
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-white font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function AreaCard({
  area,
  index,
  onEdit,
  onDelete,
  expanded = false,
  isFullWidth = false,
  onExpand,
}) {
  const handleCardClick = (e) => {
    // No expandir si se hizo clic en un botón
    if (e.target.closest("[data-action]")) {
      return;
    }
    onExpand();
  };

  return (
    <div
      className={`${
        isFullWidth ? "col-span-full" : ""
      } w-full bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-teal-900/20 mb-4 cursor-pointer ${
        expanded ? "ring-1 ring-teal-500/50" : ""
      }`}
      style={{
        animation: "fadeIn 0.5s ease-out forwards",
        animationDelay: `${index * 100}ms`,
        opacity: 0,
      }}
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gradient-to-br from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xl relative">
              {area.nombre ? area.nombre.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="ml-3 flex-grow min-w-0">
              <h3 className="font-semibold text-white truncate">
                {area.nombre || "Área sin nombre"}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {area.unidad_nombre || "Sin unidad asignada"}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ${
            expanded ? "hidden" : "block"
          }`}
        >
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div className="bg-gray-700/40 p-2 rounded">
              <span className="text-gray-400">Unidad:</span>
              <span className="ml-1.5 text-gray-200 block truncate">
                {area.unidad_nombre || "Sin asignar"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2 border-t border-gray-700 pt-3">
          <button
            data-action="edit"
            className="cursor-pointer p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
            title="Editar área"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(area);
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
            title="Eliminar área"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(area);
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

const MemoizedAreaCard = memo(AreaCard);

export default AreaCards;