import { useState, useRef, useCallback } from "react";

export function useTableControls() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [viewMode, setViewMode] = useState("table");
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({
    usuarios: ["id", "nombre_usuario", "rol", "activo"],
    investigadores: ["id", "nombre", "correo", "activo"],
    proyectos: ["id", "nombre", "estado", "fecha_inicio"],
  });

  const contentRef = useRef(null);

  // Cambiar entre vista de tabla y tarjetas sin animación
  const toggleViewMode = useCallback(
    (mode) => {
      if (mode === viewMode) return;
      setViewMode(mode);
    },
    [viewMode]
  );

  // Función para mostrar/ocultar columnas
  const toggleColumn = useCallback((tab, column) => {
    setVisibleColumns((prev) => {
      const current = [...prev[tab]];

      // No permitir quitar la última columna
      if (current.includes(column)) {
        if (current.length > 1) {
          return { ...prev, [tab]: current.filter((col) => col !== column) };
        }
        return prev;
      } else {
        return { ...prev, [tab]: [...current, column] };
      }
    });
  }, []);

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    viewMode,
    toggleViewMode,
    visibleColumns,
    toggleColumn,
    columnsDropdownOpen,
    setColumnsDropdownOpen,
    contentRef,
  };
}
