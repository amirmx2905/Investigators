import { useEffect, useState } from "react";
import api from "../../../../api/apiConfig";

function EstudianteTable({ estudiantes = [], visibleColumns, onEdit, onDelete }) {
  const [showTable, setShowTable] = useState(false);
  const [estudiantesConUsuario, setEstudiantesConUsuario] = useState([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTable(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchUsuariosAsignados = async () => {
      setCargandoUsuarios(true);
      try {
        const response = await api.get(
          "/usuarios/?page_size=1000&rol=estudiante"
        );
        const usuarios = response.data.results || response.data || [];

        const idsConUsuario = usuarios
          .filter((usuario) => usuario.estudiante !== null)
          .map((usuario) => usuario.estudiante);
        
        console.log("Estudiantes con usuario asignado:", idsConUsuario);
        setEstudiantesConUsuario(idsConUsuario);
      } catch (error) {
        console.error("Error al cargar usuarios asignados:", error);
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
    matricula: "Matrícula",
    area: "Área",
    carrera: "Carrera",
    tipo_estudiante: "Tipo",
    investigador: "Asesor",
    escuela: "Escuela",
    fecha_inicio: "Fecha de Inicio",
    fecha_termino: "Fecha de Término",
    activo: "Estado",
  };

  const formatColumnValue = (column, value, estudiante) => {
    if (column === "activo") {
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value
              ? "bg-green-900/60 text-green-300"
              : "bg-red-900/60 text-red-300"
          }`}
        >
          {value ? "Activo" : "Inactivo"}
        </span>
      );
    }
    
    if (column === "id") {
      const tieneUsuario = estudiantesConUsuario.includes(value);
      return (
        <div className="flex items-center">
          <span
            className={`flex items-center justify-center ${
              tieneUsuario
                ? "bg-gradient-to-r from-emerald-600 to-emerald-400 text-white"
                : "bg-gray-700 text-gray-300"
            } rounded-full h-6 w-6 text-xs font-medium`}
            title={
              tieneUsuario ? "Tiene usuario asignado" : "Sin usuario asignado"
            }
          >
            {value}
          </span>
          {tieneUsuario && (
            <span className="ml-2 text-xs text-emerald-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 inline"
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
      );
    }
    
    if (column === "nombre") {
      return (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-emerald-900/40 flex items-center justify-center">
            <span className="text-emerald-300 font-medium text-sm">
              {value?.charAt(0)?.toUpperCase() || "E"}
            </span>
          </div>
          <span className="ml-2 font-medium">{value}</span>
        </div>
      );
    }
    
    if (column === "area") {
      return estudiante.area_nombre || "Sin asignar";
    }
    
    if (column === "carrera") {
      return estudiante.carrera_nombre || "Sin asignar";
    }
    
    if (column === "tipo_estudiante") {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full border bg-emerald-900/40 text-emerald-300 border-emerald-500/30">
          {estudiante.tipo_estudiante_nombre || "Sin tipo"}
        </span>
      );
    }
    
    if (column === "investigador") {
      return estudiante.investigador_nombre || "Sin asesor";
    }
    
    if (column === "celular" && (value === null || value === "")) {
      return "No registrado";
    }
    
    // Formateo para los nuevos campos
    if (column === "escuela") {
      return value || "No registrado";
    }
    
    if (column === "fecha_inicio" || column === "fecha_termino") {
      if (!value) return column === "fecha_termino" ? "Sin fecha" : "No registrado";
      
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;
      
      return new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
    }
    
    return value || "—";
  };

  if (!estudiantes || estudiantes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No hay estudiantes para mostrar
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
        <div className="text-xs text-emerald-400 mb-2 flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-400"
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
      )}

      {/* Leyenda para los indicadores de usuario */}
      <div className="mb-2 flex items-center text-xs text-gray-400">
        <span className="ml-2 py-4 flex items-center mr-4">
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full h-4 w-4 mr-1"></span>
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
            {estudiantes.map((estudiante, index) => (
              <tr
                key={estudiante.id}
                className={`hover:bg-gray-700/50 transition-colors duration-200 ${
                  estudiantesConUsuario.includes(estudiante.id)
                    ? "bg-emerald-900/10"
                    : ""
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {visibleColumns.map((column) => (
                  <td
                    key={column}
                    className="px-4 py-2 whitespace-nowrap text-sm text-gray-200"
                  >
                    {formatColumnValue(
                      column,
                      estudiante[column],
                      estudiante
                    )}
                  </td>
                ))}
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button
                      className="cursor-pointer p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors duration-200"
                      title="Editar"
                      onClick={() => onEdit(estudiante)}
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
                      onClick={() => onDelete(estudiante)}
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

export default EstudianteTable;