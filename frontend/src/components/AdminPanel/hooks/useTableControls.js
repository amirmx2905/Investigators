import { useState, useEffect, useRef } from "react";

// Orden fijo de columnas
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
};

// Columnas visibles por defecto
const defaultVisibleColumns = {
  usuarios: ["id", "nombre_usuario", "rol", "vinculado_a", "activo"],
  investigadores: ["id", "nombre", "correo", "area", "nivel_snii", "activo"],
  proyectos: ["id", "nombre", "estado", "lider", "fecha_inicio"],
};

// eslint-disable-next-line no-unused-vars
export const useTableControls = (initialTab = "usuarios") => {
  const storageKey = "adminPanel_tableControls";
  const contentRef = useRef(null);

  // Estado para las configuraciones de tabla
  const [viewMode, setViewMode] = useState("table");
  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Cargar configuraciones guardadas
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(storageKey);
      if (savedSettings) {
        const { viewMode: savedViewMode, visibleColumns: savedVisibleColumns } =
          JSON.parse(savedSettings);

        if (savedViewMode) setViewMode(savedViewMode);
        if (savedVisibleColumns) setVisibleColumns(savedVisibleColumns);
      }
    } catch (e) {
      console.error("Error loading table settings:", e);
    }

    // Detectar si es dispositivo móvil
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768 && viewMode === "table") {
        setViewMode("cards");
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guardar configuraciones
  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        viewMode,
        visibleColumns,
      })
    );
  }, [viewMode, visibleColumns]);

  // Cambiar modo de visualización
  const toggleViewMode = (mode) => {
    if (mode === "table" && isMobile) return;
    setViewMode(mode);
  };

  // Activar/desactivar columnas
  const toggleColumn = (tab, column) => {
    setVisibleColumns((prev) => {
      // Si la columna ya está visible, quitarla
      if (prev[tab].includes(column)) {
        return {
          ...prev,
          [tab]: prev[tab].filter((col) => col !== column),
        };
      }

      // Si no, añadirla y ordenar las columnas según el orden definido
      const updatedColumns = [...prev[tab], column];

      // Ordenar según el orden definido
      const sortedColumns = updatedColumns.sort((a, b) => {
        return columnOrders[tab].indexOf(a) - columnOrders[tab].indexOf(b);
      });

      return {
        ...prev,
        [tab]: sortedColumns,
      };
    });
  };

  // Obtener columnas visibles ordenadas
  const getOrderedVisibleColumns = (tab) => {
    return visibleColumns[tab].sort((a, b) => {
      return columnOrders[tab].indexOf(a) - columnOrders[tab].indexOf(b);
    });
  };

  return {
    viewMode,
    toggleViewMode,
    visibleColumns,
    getOrderedVisibleColumns,
    toggleColumn,
    columnsDropdownOpen,
    setColumnsDropdownOpen,
    contentRef,
    isMobile,
  };
};
