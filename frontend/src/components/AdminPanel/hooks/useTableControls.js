import { useState, useEffect, useRef } from "react";

export function useTableControls() {
  const [viewMode, setViewMode] = useState("table");
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const contentRef = useRef(null);

  // Configuración inicial de columnas visibles
  const [visibleColumns, setVisibleColumns] = useState({
    usuarios: ["id", "nombre_usuario", "rol", "activo"],
    investigadores: ["id", "nombre", "correo", "celular", "nivel_snii","especialidad", "activo"],
    proyectos: ["id", "nombre", "estado", "lider", "fecha_inicio", "fecha_fin"],
  });

  // Checa si se está en vista mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      // Automaticamente cambia a vista de tarjetas si se está en vista de tabla y se hace resize a mobile
      if (isMobileView && viewMode === "table") {
        setViewMode("cards");
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [viewMode]);

  // Cambio entre vista de tabla y tarjetas
  const toggleViewMode = (mode) => {
    if (mode === "table" && isMobile) return;
    setViewMode(mode);
  };

  // Activa la visibilidad de cada columna
  const toggleColumn = (tab, column) => {
    setVisibleColumns((prev) => {
      const current = [...prev[tab]];

      if (current.includes(column)) {
        // No se remueve si solo queda una columna
        if (current.length === 1) return prev;
        return { ...prev, [tab]: current.filter((col) => col !== column) };
      } else {
        return { ...prev, [tab]: [...current, column] };
      }
    });
  };

  return {
    viewMode,
    toggleViewMode,
    visibleColumns,
    toggleColumn,
    columnsDropdownOpen,
    setColumnsDropdownOpen,
    contentRef,
    isMobile,
  };
}
