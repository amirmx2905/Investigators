import React, { useState, useEffect, useRef, memo } from "react";

function HerramientaCards({ items, onEdit, onDelete }) {
  const prevItemsRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    console.log("HerramientaCards recibió items:", items);
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

  const handleEdit = React.useCallback(
    (herramienta) => {
      onEdit(herramienta);
    },
    [onEdit]
  );

  const handleDelete = React.useCallback(
    (herramienta) => {
      onDelete(herramienta);
    },
    [onDelete]
  );

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="w-full flex justify-center items-center p-8 bg-gray-800/60 rounded-lg border border-gray-700">
        <p className="text-gray-400 text-lg">
          No hay herramientas registradas. Crea una nueva usando el botón
          "Nueva Herramienta".
        </p>
      </div>
    );
  }

  return (
    <>
      {items.map((herramienta, index) => (
        <MemoizedHerramientaCard
          key={herramienta.id}
          herramienta={herramienta}
          index={index}
          onEdit={handleEdit}
          onDelete={handleDelete}
          expanded={expandedId === herramienta.id}
          onExpand={() => handleExpand(herramienta.id)}
        />
      ))}
    </>
  );
}

function HerramientaCard({ herramienta, index, onEdit, onDelete, expanded, onExpand }) {
  const getGradientByType = () => {
    // Diferentes gradientes según el tipo de herramienta
    const types = {
      "Software": "from-blue-600 to-indigo-600",
      "Hardware": "from-red-600 to-orange-600",
      "Análisis": "from-green-600 to-teal-600",
      "Simulación": "from-purple-600 to-pink-600"
    };
    
    // Intentar determinar el tipo basado en el nombre
    const tipoNombre = herramienta.tipo_herramienta || "";
    
    for (const [key, value] of Object.entries(types)) {
      if (tipoNombre.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    
    // Valor por defecto
    return "from-indigo-600 to-blue-600";
  };

  const gradientClasses = getGradientByType();

  return (
    <div
      className={`w-full bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-indigo-900/20 mb-4 ${
        expanded ? "ring-1 ring-indigo-500/30" : ""
      }`}
      style={{
        animation: "fadeIn 0.5s ease-out forwards",
        animationDelay: `${index * 100}ms`,
        opacity: 0,
      }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`flex-shrink-0 h-14 w-14 rounded-full bg-gradient-to-br ${gradientClasses} flex items-center justify-center text-white font-bold text-xl`}>
              {herramienta.nombre ? herramienta.nombre.charAt(0).toUpperCase() : "H"}
            </div>
            <div className="ml-3 flex-grow min-w-0">
              <h3 className="text-lg font-semibold text-white">
                {herramienta.nombre}
              </h3>
              <div className="flex items-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-indigo-400"
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
                <span className="text-sm text-gray-400 ml-1.5">
                  {herramienta.tipo_herramienta || "Herramienta"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Badge de ID y tipo */}
        <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 rounded-lg p-2 my-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center">
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
            <span className="text-gray-400 text-sm">ID:</span>
            <span className="ml-1.5 font-medium text-gray-200 text-sm">
              {herramienta.id}
            </span>
          </div>
          
          {herramienta.tipo_herramienta_id && (
            <div className="flex items-center ml-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span className="text-gray-400 text-sm">Tipo ID:</span>
              <span className="ml-1.5 font-medium text-gray-200 text-sm">
                {herramienta.tipo_herramienta_id}
              </span>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="mt-4 flex justify-end space-x-2 border-t border-gray-700 pt-3">
          <button
            className="cursor-pointer p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/20 rounded transition-colors duration-200"
            title="Editar herramienta"
            onClick={() => onEdit(herramienta)}
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
            title="Eliminar herramienta"
            onClick={() => onDelete(herramienta)}
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

const MemoizedHerramientaCard = memo(HerramientaCard);

export default HerramientaCards;