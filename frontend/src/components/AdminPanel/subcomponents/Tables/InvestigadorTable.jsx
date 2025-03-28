import React, { useState, useEffect } from 'react';
import api from '../../../../api/apiConfig';

function InvestigadorTable({ investigadores, visibleColumns, onEdit, onDelete }) {
  const [showTable, setShowTable] = useState(false);
  const [investigadoresConUsuario, setInvestigadoresConUsuario] = useState([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTable(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Obtener la lista de investigadores con usuario asignado
  useEffect(() => {
    const fetchUsuariosAsignados = async () => {
      setCargandoUsuarios(true);
      try {
        // Solicitar una lista grande de usuarios para evitar problemas de paginación
        const response = await api.get('/usuarios/?page_size=1000&rol=investigador');
        const usuarios = response.data.results || response.data || [];
        
        // Extraer IDs de investigadores que tienen usuario
        const idsConUsuario = usuarios
          .filter(usuario => usuario.investigador !== null)
          .map(usuario => usuario.investigador);
        
        console.log('Investigadores con usuario asignado:', idsConUsuario);
        setInvestigadoresConUsuario(idsConUsuario);
      } catch (error) {
        console.error('Error al cargar usuarios asignados:', error);
      } finally {
        setCargandoUsuarios(false);
      }
    };
    
    fetchUsuariosAsignados();
  }, []);
  
  const columnLabels = {
    id: "ID",
    nombre: "Nombre",
    correo: "Correo",
    celular: "Celular",
    area: "Área",
    especialidad: "Especialidad",
    nivel_snii: "Nivel SNII",
    activo: "Estado"
  };
  
  const formatColumnValue = (column, value, investigador) => {
    // Manejo especial para el ID - Marcar si tiene usuario asignado
    if (column === "id") {
      const tieneUsuario = investigadoresConUsuario.includes(value);
      return (
        <div className="flex items-center">
          <span
            className={`flex items-center justify-center ${
              tieneUsuario 
                ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white" 
                : "bg-gray-700 text-gray-300"
            } rounded-full h-6 w-6 text-xs font-medium`}
            title={tieneUsuario ? "Tiene usuario asignado" : "Sin usuario asignado"}
          >
            {value}
          </span>
          {tieneUsuario && (
            <span className="ml-2 text-xs text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
      );
    }
    
    // Manejo de estado activo/inactivo
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
    
    // Manejo de objetos relacionados (área, especialidad, nivel SNII)
    if (["area", "especialidad", "nivel_snii"].includes(column)) {
      // Si el campo ya viene con un nombre formateado desde el backend
      if (column === "area" && investigador.area_nombre) {
        return investigador.area_nombre;
      }
      
      if (column === "especialidad" && investigador.especialidad_nombre) {
        return investigador.especialidad_nombre;
      }
      
      if (column === "nivel_snii" && investigador.nivel_snii_nombre) {
        return investigador.nivel_snii_nombre;
      }
      
      // Si el valor es un objeto, mostrar la propiedad adecuada
      if (value && typeof value === 'object') {
        if (column === "area" && value.nombre) {
          return value.nombre;
        }
        
        if (column === "especialidad" && value.nombre_especialidad) {
          return value.nombre_especialidad;
        }
        
        if (column === "nivel_snii" && value.nivel) {
          return value.nivel;
        }
        
        // Intentar mostrar alguna propiedad común que pueda existir
        return value.nombre || value.nivel || value.descripcion || JSON.stringify(value);
      }
      
      // Valores predeterminados para valores nulos
      if (value === null || value === undefined) {
        if (column === "especialidad") return "Sin especialidad";
        if (column === "nivel_snii") return "Sin SNII";
        return "No asignado";
      }
    }
    
    // Manejo de celular (si es nulo)
    if (column === "celular" && (value === null || value === "")) {
      return "No registrado";
    }
    
    // Para otros campos, devolver el valor tal cual
    return value;
  };

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
      {cargandoUsuarios && (
        <div className="text-xs text-blue-400 mb-2 flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cargando información de usuarios...
        </div>
      )}
      
      <div className="mb-2 flex items-center text-xs text-gray-400">
        <span className="ml-2 py-4 flex items-center mr-4">
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-full h-4 w-4 mr-1"></span>
          Tiene usuario asignado
        </span>
        <span className="py-4 flex items-center">
          <span className="bg-gray-700 rounded-full h-4 w-4 mr-1"></span>
          Sin usuario asignado
        </span>
      </div>
      
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
                className={`hover:bg-gray-700/50 transition-colors duration-200 ${
                  investigadoresConUsuario.includes(investigador.id) ? 'bg-blue-900/10' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {visibleColumns.map((column) => (
                  <td
                    key={column}
                    className="px-4 py-2 whitespace-nowrap text-sm text-gray-200"
                  >
                    {formatColumnValue(column, investigador[column], investigador)}
                  </td>
                ))}
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button
                      className="cursor-pointer p-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      title="Editar"
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
                      className="cursor-pointer p-1 text-red-400 hover:text-red-300 transition-colors duration-200"
                      title="Eliminar"
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