// Import necessary services and libraries
import { useState, useEffect, useCallback } from "react";
import { investigadorService } from "../../../api/services/investigadorService";
import { usuarioService } from "../../../api/services/usuarioService";
import { proyectoService } from "../../../api/services/proyectoService";
import { estudianteService } from "../../../api/services/estudianteService";
import { articuloService } from "../../../api/services/articuloService";
import { eventoService } from "../../../api/services/eventoService";
import { carreraService } from "../../../api/services/carreraService";

export const useAdminPanel = (initialResource = "usuarios") => {
  const [resource, setResource] = useState(initialResource);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState(initialResource);

  // State for each resource, add here for each new resource
  const [usuarios, setUsuarios] = useState([]);
  const [investigadores, setInvestigadores] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [carreras, setCarreras] = useState([]);

  const [isMobile, setIsMobile] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

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

  // Fetch data based on the resource type
  const fetchData = useCallback(
    async (
      resourceType = resource,
      page = currentPage,
      pageSize = itemsPerPage,
      filterOptions = filters
    ) => {
      setLoading(true);
      setError(null);

      try {
        let data;

        switch (resourceType) {
          case "investigadores":
            data = await investigadorService.getInvestigadores(
              page,
              pageSize,
              filterOptions
            );
            setInvestigadores(data.results);
            break;
          case "usuarios":
            data = await usuarioService.getUsuarios(
              page,
              pageSize,
              filterOptions
            );
            setUsuarios(data.results);
            break;
          case "proyectos":
            data = await proyectoService.getProyectos(
              page,
              pageSize,
              filterOptions
            );
            setProyectos(data.results);
            break;
          case "estudiantes":
            data = await estudianteService.getEstudiantes(
              page,
              pageSize,
              filterOptions
            );
            setEstudiantes(data.results);
            break;
          case "articulos":
            data = await articuloService.getArticulos(
              page,
              pageSize,
              filterOptions
            );
            setArticulos(data.results);
            break;
          case "eventos":
            data = await eventoService.getEventos(
              page,
              pageSize,
              filterOptions
            );
            setEventos(data.results);
            break;
          case "carreras":
            data = await carreraService.getCarreras(
              page,
              pageSize,
              filterOptions
            );
            setCarreras(data.results);
            break;
          default:
            throw new Error("Recurso no soportado");
        }

        setItems(data.results);
        setTotalItems(data.count);
        setTotalPages(data.total_pages);
        setCurrentPage(data.current_page || page);
      } catch (err) {
        setError(err.message || "Ocurrió un error al cargar los datos");
        console.error("Error en useAdminPanel:", err);
      } finally {
        setLoading(false);
      }
    },
    [resource, currentPage, itemsPerPage, filters]
  );

  useEffect(() => {
    fetchData(resource, currentPage, itemsPerPage, filters);
  }, [
    resource,
    currentPage,
    itemsPerPage,
    filters,
    sortField,
    sortDirection,
    fetchData,
  ]);

  const refreshData = useCallback(() => {
    return fetchData(activeTab, currentPage, itemsPerPage, filters);
  }, [activeTab, currentPage, itemsPerPage, filters, fetchData]);

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
    estudiantes,
    articulos,
    eventos,
    carreras,
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
    refreshData,
    fetchData,
  };
};

export default useAdminPanel;
