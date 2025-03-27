import { useState, useEffect, useCallback } from "react";
import { investigadorService } from "../../../api/services/investigadorService";
import { usuarioService } from "../../../api/services/usuarioService";
import { proyectoService } from "../../../api/services/proyectoService";

export const useAdminPanel = (initialResource = "usuarios") => {
  const [resource, setResource] = useState(initialResource);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para la navegación por pestañas
  const [activeTab, setActiveTab] = useState(initialResource);

  // Estados para los datos específicos de cada recurso
  const [usuarios, setUsuarios] = useState([]);
  const [investigadores, setInvestigadores] = useState([]);
  const [proyectos, setProyectos] = useState([]);

  // Estados para detección de dispositivo móvil
  const [isMobile, setIsMobile] = useState(false);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Estados de filtrado y ordenación
  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let data;

      switch (resource) {
        case "investigadores":
          data = await investigadorService.getInvestigadores(
            currentPage,
            itemsPerPage,
            filters
          );
          setInvestigadores(data.results);
          break;
        case "usuarios":
          data = await usuarioService.getUsuarios(
            currentPage,
            itemsPerPage,
            filters
          );
          setUsuarios(data.results);
          break;
        case "proyectos":
          data = await proyectoService.getProyectos(
            currentPage,
            itemsPerPage,
            filters
          );
          setProyectos(data.results);
          break;
        default:
          throw new Error("Recurso no soportado");
      }

      setItems(data.results);
      setTotalItems(data.count);
      setTotalPages(data.total_pages);
      setCurrentPage(data.current_page);
    } catch (err) {
      setError(err.message || "Ocurrió un error al cargar los datos");
      console.error("Error en useAdminPanel:", err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, currentPage, itemsPerPage, filters, sortField, sortDirection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const changeItemsPerPage = useCallback((newItemsPerPage) => {
    setItemsPerPage(Number(newItemsPerPage));
    setCurrentPage(1);
  }, []);

  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const changeSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
      setCurrentPage(1);
    },
    [sortField, sortDirection]
  );

  const changeResource = useCallback((newResource) => {
    setResource(newResource);
    setActiveTab(newResource);
    setCurrentPage(1);
    setFilters({});
    setSortField(null);
    setSortDirection("asc");
  }, []);

  const changeTab = useCallback((tab) => {
    setActiveTab(tab);
    setResource(tab);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback(
    (pageNumber) => {
      paginate(pageNumber);
    },
    [paginate]
  );

  const handleItemsPerPageChange = useCallback(
    (newValue) => {
      changeItemsPerPage(newValue);
    },
    [changeItemsPerPage]
  );

  return {
    resource,
    items,
    loading,
    error,
    activeTab,
    changeTab,
    usuarios,
    investigadores,
    proyectos,
    isMobile,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    filters,
    sortField,
    sortDirection,
    paginate,
    handlePageChange,
    changeItemsPerPage,
    handleItemsPerPageChange,
    applyFilters,
    changeSort,
    changeResource,
    refreshData: fetchData,
  };
};

export default useAdminPanel;
