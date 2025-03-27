import React, { useState, useEffect } from "react";

function ProyectoTable({ proyectos, visibleColumns, onEdit, onDelete }) {
  
  const [showTable, setShowTable] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTable(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  const columnLabels = {
    id: "ID",
    nombre: "Nombre",
    estado: "Estado",
    fecha_inicio: "Fecha Inicio",
    fecha_fin: "Fecha Fin"
  };
  
  const formatColumnValue = (column, value) => {
    if (column === "estado") {
      const statusStyles = {
        'activo': "bg-green-900/60 text-green-300",
        'completado': "bg-blue-900/60 text-blue-300",
        'suspendido': "bg-yellow-900/60 text-yellow-300",
        'cancelado': "bg-red-900/60 text-red-300"
      };
      
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            statusStyles[value] || "bg-gray-900/60 text-gray-300"
          }`}
        >
          {value || "Desconocido"}
        </span>
      );
    }
    
    if (column === "fecha_inicio" || column === "fecha_fin") {
      if (!value) return "N/A";
      
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;
      
      return date.toLocaleDateString();
    }
    
    return value;
  };

  if (proyectos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No hay proyectos para mostrar
      </div>
    );
  }

  return (
    <div 
      className={`w-full overflow-hidden transition-all duration-500 ${
        showTable ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Tabla */}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-700">
        {/* Encabezado */}
        <table className="w-full table-auto">
          <thead>
            {/* Fila de encabezado */}
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
          {/* Cuerpo */}
          <tbody className="divide-y divide-gray-700 bg-gray-800/40">
            {proyectos.map((proyecto, index) => (
              <tr
                key={proyecto.id}
                className="hover:bg-gray-700/50 transition-colors duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {visibleColumns.map((column) => (
                  <td
                    key={column}
                    className="px-4 py-2 whitespace-nowrap text-sm text-gray-200"
                  >
                    {formatColumnValue(column, proyecto[column])}
                  </td>
                ))}
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    {/* Botones de acción */}
                    <button
                      className="cursor-pointer p-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
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
                    {/* Botón de eliminar */}
                    <button
                      className="cursor-pointer p-1 text-red-400 hover:text-red-300 transition-colors duration-200"
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
  );
}

export default ProyectoTable;