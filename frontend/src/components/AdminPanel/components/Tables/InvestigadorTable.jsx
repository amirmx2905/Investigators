import React, { useState, useEffect } from "react";

function InvestigadorTable({ investigadores, visibleColumns, onCopy }) {
  const [showTable, setShowTable] = useState(false);
  
  // Efecto de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTable(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Definir etiquetas de columnas
  const columnLabels = {
    id: "ID",
    nombre: "Nombre",
    correo: "Correo",
    especialidad: "Especialidad",
    activo: "Estado"
  };
  
  // Formatear el valor según el tipo de columna
  const formatColumnValue = (column, value) => {
    if (column === "activo") {
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value ? "bg-green-900/60 text-green-300" : "bg-red-900/60 text-red-300"
          }`}
        >
          {value ? "Activo" : "Inactivo"}
        </span>
      );
    }
    
    return value;
  };

  // Si no hay datos, mostrar mensaje
  if (investigadores.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No hay investigadores para mostrar
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
            {investigadores.map((investigador, index) => (
              <tr
                key={investigador.id}
                className="hover:bg-gray-700/50 transition-colors duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {visibleColumns.map((column) => (
                  <td
                    key={column}
                    className="px-4 py-2 whitespace-nowrap text-sm text-gray-200"
                  >
                    {formatColumnValue(column, investigador[column])}
                  </td>
                ))}
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button
                      className="p-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      title="Editar"
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
                      className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                      title="Copiar ID"
                      onClick={() => onCopy && onCopy(investigador.id)}
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
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-1 text-red-400 hover:text-red-300 transition-colors duration-200"
                      title="Eliminar"
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

export default InvestigadorTable;