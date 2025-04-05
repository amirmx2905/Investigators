import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

function ColumnSelector({
  activeTab,
  columnsDropdownOpen,
  setColumnsDropdownOpen,
  visibleColumns,
  toggleColumn,
  columnToggleRef,
}) {
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [portalContainer, setPortalContainer] = useState(null);
  const menuRef = useRef(null);

  const columnOrders = {
    usuarios: ["id", "nombre_usuario", "rol", "vinculado_a", "activo"],
    investigadores: [
      "id",
      "nombre",
      "correo",
      "celular",
      "area",
      "especialidad",
      "nivel_snii",
      "linea",
      "activo",
    ],
    proyectos: [
      "id",
      "nombre",
      "estado",
      "lider",
      "fecha_inicio",
      "fecha_fin",
      "explicacion",
      "herramientas",
      "investigadores",
    ],
    estudiantes: [
      "id",
      "nombre",
      "correo",
      "celular",
      "area",
      "carrera",
      "tipo_estudiante",
      "investigador",
      "escuela",
      "fecha_inicio",
      "fecha_termino",
      "activo",
    ],
    articulos: [
      "id",
      "nombre_articulo",
      "nombre_revista",
      "pais_publicacion",
      "fecha_publicacion",
      "doi",
      "abstracto",
      "investigadores",
      "estatus",
    ],
    eventos: [
      "id",
      "nombre_evento",
      "tipo_evento_nombre",
      "fecha_inicio",
      "fecha_fin",
      "lugar",
      "empresa_invita",
      "descripcion",
      "investigadores",
    ],
  };

  const columnLabels = {
    usuarios: {
      id: "ID",
      nombre_usuario: "Usuario",
      rol: "Rol",
      vinculado_a: "Vinculado a",
      activo: "Estado",
    },
    investigadores: {
      id: "ID",
      nombre: "Nombre",
      correo: "Correo",
      celular: "Celular",
      area: "Área",
      especialidad: "Especialidad",
      nivel_snii: "Nivel SNII",
      linea: "Línea",
      activo: "Estado",
    },
    proyectos: {
      id: "ID",
      nombre: "Nombre",
      estado: "Estado",
      lider: "Líder",
      fecha_inicio: "Fecha Inicio",
      fecha_fin: "Fecha Fin",
      explicacion: "Descripción",
      herramientas: "Herramientas",
      investigadores: "Investigadores",
    },
    estudiantes: {
      id: "ID",
      nombre: "Nombre",
      correo: "Correo",
      celular: "Celular",
      area: "Área",
      carrera: "Carrera",
      tipo_estudiante: "Tipo",
      investigador: "Asesor",
      escuela: "Escuela",
      fecha_inicio: "Fecha de Inicio",
      fecha_termino: "Fecha de Término",
      activo: "Estado",
    },
    articulos: {
      id: "ID",
      nombre_articulo: "Título",
      nombre_revista: "Revista",
      pais_publicacion: "País",
      fecha_publicacion: "Fecha",
      doi: "DOI",
      abstracto: "Resumen",
      investigadores: "Autores",
      estatus: "Estado",
    },
    eventos: {
      id: "ID",
      nombre_evento: "Nombre",
      tipo_evento_nombre: "Tipo",
      fecha_inicio: "Fecha Inicio",
      fecha_fin: "Fecha Fin",
      lugar: "Lugar",
      empresa_invita: "Empresa",
      descripcion: "Descripción",
      investigadores: "Participantes",
    },
  };

  useEffect(() => {
    if (!document.getElementById("column-menu-portal")) {
      const portalNode = document.createElement("div");
      portalNode.id = "column-menu-portal";
      document.body.appendChild(portalNode);
      setPortalContainer(portalNode);
    } else {
      setPortalContainer(document.getElementById("column-menu-portal"));
    }

    return () => {
      const portalNode = document.getElementById("column-menu-portal");
      if (portalNode && portalNode.parentNode) {
        portalNode.parentNode.removeChild(portalNode);
      }
    };
  }, []);

  useEffect(() => {
    if (columnsDropdownOpen && columnToggleRef?.current) {
      const rect = columnToggleRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [columnsDropdownOpen, columnToggleRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        columnsDropdownOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        columnToggleRef.current &&
        !columnToggleRef.current.contains(event.target)
      ) {
        setColumnsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [columnsDropdownOpen, setColumnsDropdownOpen, columnToggleRef]);

  const handleColumnToggle = (column) => {
    toggleColumn(activeTab, column);
  };

  return (
    <>
      <button
        ref={columnToggleRef}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-gray-800/70 border border-blue-500/30 text-blue-300 hover:bg-gray-700/70 hover:border-blue-500/50 cursor-pointer transition-all duration-200"
        onClick={(e) => {
          e.stopPropagation();
          setColumnsDropdownOpen(!columnsDropdownOpen);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M3.5 2h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1zm5-10h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1zm5-10h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1z" />
        </svg>
        Columnas
      </button>

      {columnsDropdownOpen &&
        portalContainer &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            className="fixed bg-gray-800 rounded-md shadow-lg border border-blue-500/30 animate-fadeIn w-48"
            id="column-dropdown"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              zIndex: 9999,
              animation: "fadeIn 0.2s ease-out forwards",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <div className="px-4 py-2 text-sm font-medium text-gray-300 border-b border-gray-700">
              Seleccionar columnas
            </div>

            {/* Lista de columnas disponibles */}
            <div>
              {columnOrders[activeTab]?.map((column) => (
                <div
                  key={column}
                  className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleColumnToggle(column);
                  }}
                >
                  <div
                    className="flex items-center w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="w-4 h-4 mr-2 flex items-center justify-center rounded-sm transition-all duration-200"
                      style={{
                        backgroundColor: visibleColumns[activeTab]?.includes(
                          column
                        )
                          ? "#3b82f6"
                          : "transparent",
                        border: visibleColumns[activeTab]?.includes(column)
                          ? "1px solid rgba(96, 165, 250, 0.7)"
                          : "1px solid rgba(59, 130, 246, 0.3)",
                      }}
                    >
                      {visibleColumns[activeTab]?.includes(column) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          fill="white"
                          viewBox="0 0 16 16"
                        >
                          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-300">
                      {columnLabels[activeTab]?.[column]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>,
          portalContainer
        )}
    </>
  );
}

export default ColumnSelector;
