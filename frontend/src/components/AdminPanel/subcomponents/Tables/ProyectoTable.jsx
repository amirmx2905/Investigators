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
    fecha_fin: "Fecha Fin",
    lider: "Líder",
    explicacion: "Descripción"
  };
  
  const getStatusStyles = (status) => {
    const statusMap = {
      'activo': "bg-green-900/60 text-green-300",
      'en progreso': "bg-blue-900/60 text-blue-300",
      'completado': "bg-emerald-900/60 text-emerald-300",
      'suspendido': "bg-yellow-900/60 text-yellow-300",
      'cancelado': "bg-red-900/60 text-red-300"
    };
    
    if (!status) return "bg-gray-900/60 text-gray-300";
    return statusMap[status.toLowerCase()] || "bg-gray-900/60 text-gray-300";
  };
  
  const formatColumnValue = (column, value, proyecto) => {
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
      
      // Formato de fecha localizado
      return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    }
    
    // Manejo específico para el campo lider
    if (column === "lider") {
      // Usar lider_nombre si está disponible desde el backend
      if (proyecto.lider_nombre) {
        return proyecto.lider_nombre;
      }
      
      // Como respaldo, mantener la lógica anterior
      if (value && typeof value === 'object' && value.nombre) {
        return value.nombre;
      }
      
      return "No asignado";
    }
    
    // Manejo para explicación (posible texto largo)
    if (column === "explicacion" || column === "descripcion") {
      if (!value) return "Sin descripción";
      if (value.length > 50) {
        return value.substring(0, 50) + "...";
      }
      return value;
    }
    
    // Valor por defecto para las demás columnas
    return value !== null && value !== undefined ? value : "—";
  };

  // Si no hay proyectos, mostrar mensaje
  if (!proyectos || proyectos.length === 0) {
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
                  proyecto.estado?.toLowerCase() === 'activo' ? 'bg-green-900/10' : 
                  proyecto.estado?.toLowerCase() === 'completado' ? 'bg-blue-900/10' : ''
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
  );
}

export default ProyectoTable;