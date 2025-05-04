import { useState, useEffect, useCallback } from "react";
import { investigadorService } from "../../../api/services/investigadorService";
import { usuarioService } from "../../../api/services/usuarioService";
import { proyectoService } from "../../../api/services/proyectoService";
import { estudianteService } from "../../../api/services/estudianteService";
import { articuloService } from "../../../api/services/articuloService";
import { eventoService } from "../../../api/services/eventoService";
import { carreraService } from "../../../api/services/carreraService";
import { especialidadService } from "../../../api/services/especialidadService";
import { unidadService } from "../../../api/services/unidadService";
import { lineaService } from "../../../api/services/lineaService";
import { nivelService } from "../../../api/services/nivelService";
import { tipoestudianteService } from "../../../api/services/tipoestudianteService";
import { roleventoService } from "../../../api/services/roleventoService";
import { jefeareaService } from "../../../api/services/jefeareaService";
import { tipoherramientaService } from "../../../api/services/tipoherramientaService";
import { herramientaService } from "../../../api/services/herramientaService"; // Nueva importación

export const useAdminPanel = (initialResource = "usuarios") => {
  const [resource, setResource] = useState(initialResource);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState(initialResource);

  const [usuarios, setUsuarios] = useState([]);
  const [investigadores, setInvestigadores] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [tiposestudiante, setTiposestudiante] = useState([]);
  const [roleventos, setRoleventos] = useState([]);
  const [jefesareas, setJefesareas] = useState([]);
  const [tipoherramientas, setTipoherramientas] = useState([]);
  const [herramientas, setHerramientas] = useState([]); // Nuevo estado para herramientas

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
          case "especialidades":
            data = await especialidadService.getEspecialidades(
              page,
              pageSize,
              filterOptions
            );
            setEspecialidades(data.results);
            break;
          case "unidades":
            data = await unidadService.getUnidades(
              page,
              pageSize,
              filterOptions
            );
            setUnidades(data.results);
            break;
          case "lineas":
            data = await lineaService.getLineas(
              page,
              pageSize,
              filterOptions
            );
            setLineas(data.results);
            break;
          case "niveles":
            try {
              data = await nivelService.getNiveles(
                page,
                pageSize,
                filterOptions
              );
              setNiveles(data.results || []);
            } catch (err) {
              console.error(`Error al cargar niveles: ${err.message}`);
              // Proporcionar datos vacíos para evitar errores en la UI
              data = { results: [], count: 0, total_pages: 1, current_page: 1 };
              setNiveles([]);
            }
            break;
          case "roleventos":
            try {
              data = await roleventoService.getRolEventos(
                page,
                pageSize,
                filterOptions
              );
              setRoleventos(data.results || []);
            } catch (err) {
              console.error(`Error al cargar roles de eventos: ${err.message}`);
              data = { results: [], count: 0, total_pages: 1, current_page: 1 };
              setRoleventos([]);
            }
            break;
          case "tiposestudiante":
            try {
              data = await tipoestudianteService.getTiposEstudiante(
                page,
                pageSize,
                filterOptions
              );
              console.log("Datos recibidos de tipos estudiante:", data); 
              setTiposestudiante(data.results || []);
            } catch (err) {
              console.error(`Error al cargar tipos de estudiante: ${err.message}`);
              data = { results: [], count: 0, total_pages: 1, current_page: 1 };
              setTiposestudiante([]);
            }
            break;
          case "jefesareas":
            try {
              data = await jefeareaService.getJefesAreas(
                page,
                pageSize,
                filterOptions
              );
              setJefesareas(data.results || []);
            } catch (err) {
              console.error(`Error al cargar jefes de área: ${err.message}`);
              data = { results: [], count: 0, total_pages: 1, current_page: 1 };
              setJefesareas([]);
            }
            break;
          case "tipoherramientas":
            try {
              data = await tipoherramientaService.getTiposHerramienta(
                page,
                pageSize,
                filterOptions
              );
              setTipoherramientas(data.results || []);
            } catch (err) {
              console.error(`Error al cargar tipos de herramienta: ${err.message}`);
              data = { results: [], count: 0, total_pages: 1, current_page: 1 };
              setTipoherramientas([]);
            }
            break;
          case "herramientas": // Nuevo caso para herramientas
            try {
              data = await herramientaService.getHerramientas(
                page,
                pageSize,
                filterOptions
              );
              setHerramientas(data.results || []);
            } catch (err) {
              console.error(`Error al cargar herramientas: ${err.message}`);
              data = { results: [], count: 0, total_pages: 1, current_page: 1 };
              setHerramientas([]);
            }
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
    especialidades,
    unidades,
    lineas,
    niveles,
    tiposestudiante,
    roleventos,
    jefesareas,
    tipoherramientas,
    herramientas, // Exponer el nuevo estado de herramientas
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
