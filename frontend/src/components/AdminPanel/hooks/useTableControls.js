import { useState, useEffect, useRef } from "react";

export const columnOrders = {
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
    "tipo_evento",
    "fecha_inicio",
    "fecha_fin",
    "lugar",
    "empresa_invita",
    "descripcion",
    "investigadores",
  ],
};

const defaultVisibleColumns = {
  usuarios: ["id", "nombre_usuario", "rol", "vinculado_a", "activo"],
  investigadores: [
    "id",
    "nombre",
    "correo",
    "area",
    "nivel_snii",
    "linea",
    "activo",
  ],
  proyectos: ["id", "nombre", "estado", "lider", "fecha_inicio"],
  estudiantes: [
    "id",
    "nombre",
    "correo",
    "area",
    "carrera",
    "tipo_estudiante",
    "investigador",
    "escuela",
    "fecha_inicio",
    "activo",
  ],
  articulos: [
    "id",
    "nombre_articulo",
    "nombre_revista",
    "fecha_publicacion",
    "doi",
    "investigadores",
    "estatus",
  ],
  eventos: [
    "id",
    "nombre_evento",
    "tipo_evento",
    "fecha_inicio",
    "fecha_fin",
    "lugar",
    "investigadores",
  ],
};

const useTableControls = () => {
  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);
  const [viewMode, setViewMode] = useState("table");
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const contentRef = useRef(null);
  const columnToggleRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar dispositivos móviles
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Recuperar configuración guardada
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem("tableConfig");
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setVisibleColumns((prevColumns) => ({
          ...prevColumns,
          ...parsedConfig.visibleColumns,
        }));
        setViewMode(parsedConfig.viewMode || "table");
      }
    } catch (error) {
      console.error("Error al cargar la configuración de tabla:", error);
    }
  }, []);

  // Guardar configuración cuando cambia
  useEffect(() => {
    try {
      localStorage.setItem(
        "tableConfig",
        JSON.stringify({
          visibleColumns,
          viewMode,
        })
      );
    } catch (error) {
      console.error("Error al guardar la configuración de tabla:", error);
    }
  }, [visibleColumns, viewMode]);

  const toggleColumn = (activeTab, column) => {
    setVisibleColumns((prevColumns) => {
      const tabColumns = prevColumns[activeTab] || [];
      const newTabColumns = tabColumns.includes(column)
        ? tabColumns.filter((col) => col !== column)
        : [...tabColumns, column];

      return {
        ...prevColumns,
        [activeTab]: newTabColumns,
      };
    });
  };

  const resetColumns = (activeTab) => {
    setVisibleColumns((prevColumns) => ({
      ...prevColumns,
      [activeTab]: defaultVisibleColumns[activeTab] || [],
    }));
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "table" ? "cards" : "table"));
  };

  const toggleColumnsDropdown = () => {
    setColumnsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
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
  }, []);

  return {
    visibleColumns,
    toggleColumn,
    resetColumns,
    viewMode,
    toggleViewMode,
    columnsDropdownOpen,
    toggleColumnsDropdown,
    columnToggleRef,
    contentRef,
    isMobile,
  };
};

export default useTableControls;
