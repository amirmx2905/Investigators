/**
 * Dashboard - Componente principal para la visualización de estadísticas de investigadores
 *
 * Este componente actúa como el contenedor principal para todas las visualizaciones y controles
 * del dashboard estadístico. Gestiona el estado global, la carga de datos, la selección de
 * investigadores y categorías, y orquesta la comunicación entre subcomponentes.
 */
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify"; // Para notificaciones tipo toast
import "react-toastify/dist/ReactToastify.css"; // Estilos para las notificaciones
import { ArrowPathIcon, ChartBarIcon } from "@heroicons/react/24/outline"; // Iconos de la UI
import axios from "axios"; // Cliente HTTP para peticiones al API

// Servicios y componentes
import { puntajeService } from "../../api/services/puntajeService"; // Servicio para comunicación con el API
import DashboardHeader from "./subcomponents/DashboardHeader"; // Encabezado del dashboard
import InvestigadorSelector from "./subcomponents/InvestigadorSelector"; // Selector de investigadores
import PuntajeGeneral from "./subcomponents/PuntajeGeneral"; // Gráfico de puntajes generales
import PuntajePorArea from "./subcomponents/PuntajePorArea"; // Gráfico de distribución por área
import PuntajePorCategoria from "./subcomponents/PuntajePorCategoria"; // Gráfico por categoría seleccionada

/**
 * Componente principal del Dashboard
 *
 * Coordina la carga de datos, gestiona el estado global y renderiza
 * todos los subcomponentes de visualización.
 *
 * @returns {JSX.Element} Dashboard completo con todas las visualizaciones
 */
function Dashboard() {
  // Estado para controlar la carga inicial de datos
  const [loading, setLoading] = useState(true);

  // Estado para manejar errores en la carga o actualización de datos
  const [error, setError] = useState(null);

  // Estado para almacenar los puntajes de todos los investigadores
  const [puntajes, setPuntajes] = useState([]);

  // Estado para almacenar el resumen de puntajes por área de investigación
  const [resumenPorArea, setResumenPorArea] = useState([]);

  // Estado para el investigador seleccionado en el filtro principal
  const [investigadorSeleccionado, setInvestigadorSeleccionado] =
    useState(null);

  // Estado para la categoría seleccionada en el análisis detallado
  // Por defecto muestra estudiantes_maestria en lugar de total
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    "estudiantes_maestria"
  );

  // Estado para indicar cuando se está actualizando/recalculando datos
  // eslint-disable-next-line no-unused-vars
  const [actualizando, setActualizando] = useState(false);

  /**
   * Listado de categorías disponibles para análisis
   * Cada categoría tiene un id que corresponde al endpoint del API y un nombre legible
   */
  const categorias = [
    { id: "estudiantes_maestria", nombre: "Estudiantes Maestría" },
    { id: "estudiantes_doctorado", nombre: "Estudiantes Doctorado" },
    { id: "lineas", nombre: "Líneas de Investigación" },
    { id: "proyectos", nombre: "Proyectos" },
    { id: "articulos", nombre: "Artículos" },
    { id: "eventos", nombre: "Eventos" },
  ];

  /**
   * Efecto para cargar todos los datos iniciales al montar el componente
   * Obtiene puntajes y resumen por área desde el API
   */
  useEffect(() => {
    /**
     * Función asíncrona para obtener y procesar los datos del API
     */
    const fetchData = async () => {
      try {
        setLoading(true);

        /**
         * Función interna para obtener todos los investigadores gestionando paginación
         * Obtiene todas las páginas de resultados y las combina en un solo array
         *
         * @returns {Array} Todos los investigadores de todas las páginas
         */
        const fetchAllInvestigadores = async () => {
          // Obtener la primera página para ver cuántas páginas hay en total
          const response = await axios.get("/api/puntajes/");
          const firstPageData = response.data;

          // Guardar los resultados de la primera página
          let allResults = [...firstPageData.results];

          // Si hay más páginas, obtenerlas todas
          if (firstPageData.total_pages > 1) {
            const additionalRequests = [];

            // Crear solicitudes para todas las páginas adicionales
            for (let page = 2; page <= firstPageData.total_pages; page++) {
              additionalRequests.push(axios.get(`/api/puntajes/?page=${page}`));
            }

            // Ejecutar todas las solicitudes en paralelo para mayor eficiencia
            const additionalResponses = await Promise.all(additionalRequests);

            // Agregar los resultados de cada página adicional al array total
            additionalResponses.forEach((response) => {
              allResults = [...allResults, ...response.data.results];
            });
          }

          return allResults;
        };

        // Cargar todos los puntajes (todas las páginas)
        const puntajesData = await fetchAllInvestigadores();

        // Verificar y procesar los datos de puntajes
        if (Array.isArray(puntajesData)) {
          setPuntajes(puntajesData);
          console.log("Total de investigadores cargados:", puntajesData.length);
        } else {
          // Si la respuesta no es un array, inicializar con array vacío
          console.error("Formato de respuesta inesperado:", puntajesData);
          setPuntajes([]);
        }

        // Cargar resumen por área
        const resumenData = await puntajeService.getResumenPorArea();

        // Manejar diferentes formatos de respuesta para mayor robustez
        if (Array.isArray(resumenData)) {
          setResumenPorArea(resumenData);
        } else if (
          resumenData &&
          resumenData.results &&
          Array.isArray(resumenData.results)
        ) {
          // Si la respuesta tiene un objeto con propiedad 'results', usar ese array
          setResumenPorArea(resumenData.results);
        } else {
          // Si no hay datos o el formato es inesperado, inicializar como array vacío
          setResumenPorArea([]);
        }

        // Finalizar carga y limpiar errores previos
        setLoading(false);
        setError(null);
      } catch (err) {
        // Manejar errores en la carga de datos
        console.error("Error al cargar datos:", err);
        setError("Error al cargar los datos. Por favor, intente nuevamente.");
        setLoading(false);

        // Mostrar notificación de error al usuario
        toast.error("Error al cargar datos. Intente nuevamente.", {
          position: "bottom-right",
        });
      }
    };

    // Ejecutar la función de carga de datos
    fetchData();
  }, []); // Este efecto solo se ejecuta al montar el componente

  /**
   * Función para recalcular puntajes en el backend y actualizar datos
   * Esta función es llamada cuando el usuario solicita una actualización manual
   *
   * @async
   */
  // eslint-disable-next-line no-unused-vars
  const recalcularPuntajes = async () => {
    try {
      // Activar indicador de carga
      setActualizando(true);

      // Solicitar recálculo de todos los puntajes en el backend
      await puntajeService.recalcularTodos();

      // Recargar datos actualizados
      const puntajesData = await puntajeService.getAll();

      // Procesar datos de puntajes con manejo de diferentes formatos
      if (Array.isArray(puntajesData)) {
        setPuntajes(puntajesData);
      } else if (
        puntajesData &&
        puntajesData.results &&
        Array.isArray(puntajesData.results)
      ) {
        // Si la respuesta tiene un objeto con propiedad 'results', usar ese array
        setPuntajes(puntajesData.results);
      } else {
        // Si no hay datos o el formato es inesperado, inicializar como array vacío
        setPuntajes([]);
      }

      // Recargar datos de resumen por área
      const resumenData = await puntajeService.getResumenPorArea();

      // Procesar datos de resumen con manejo de diferentes formatos
      if (Array.isArray(resumenData)) {
        setResumenPorArea(resumenData);
      } else if (
        resumenData &&
        resumenData.results &&
        Array.isArray(resumenData.results)
      ) {
        // Si la respuesta tiene un objeto con propiedad 'results', usar ese array
        setResumenPorArea(resumenData.results);
      } else {
        // Si no hay datos o el formato es inesperado, inicializar como array vacío
        setResumenPorArea([]);
      }

      // Mostrar notificación de éxito al usuario
      toast.success("Puntajes actualizados correctamente");

      // Finalizar actualización y limpiar errores previos
      setActualizando(false);
      setError(null);
    } catch (err) {
      // Manejar errores en la actualización de datos
      setError(
        "Error al actualizar los puntajes. Por favor, intente nuevamente."
      );

      // Mostrar notificación de error al usuario
      toast.error("Error al actualizar los puntajes");

      // Finalizar actualización y registrar error en consola
      setActualizando(false);
      console.error(err);
    }
  };

  /**
   * Renderizado condicional: Muestra indicador de carga mientras se cargan los datos iniciales
   */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  /**
   * Renderizado condicional: Muestra mensaje de error y botón para reintentar
   * si ocurrió algún problema durante la carga de datos
   */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  /**
   * Renderizado principal del dashboard cuando los datos están disponibles
   */
  return (
    <div className="py-4 sm:py-6 px-2 sm:px-0">
      {/* Contenedor para las notificaciones toast */}
      <ToastContainer position="bottom-right" theme="dark" />

      {/* Encabezado principal del dashboard */}
      <DashboardHeader
        title="Dashboard Estadístico"
        subtitle="Análisis de desempeño de investigadores"
        icon={<ChartBarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />}
      />

      {/* Fila con controles de filtrado y selección */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Selector de investigadores para filtrar las visualizaciones */}
        <InvestigadorSelector
          investigadores={
            Array.isArray(puntajes)
              ? puntajes.map((p) => ({
                  id: p.investigador,
                  nombre: p.nombre_investigador,
                }))
              : []
          }
          onSelect={setInvestigadorSeleccionado}
          selectedId={investigadorSeleccionado}
        />
      </div>

      {/* Grid con gráficas principales: Puntaje General y Distribución por Área */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Gráfica de Puntaje General - Muestra top 10 investigadores por puntaje */}
        <PuntajeGeneral
          puntajes={puntajes}
          investigadorSeleccionado={investigadorSeleccionado}
        />

        {/* Gráfica de Puntaje por Área - Muestra distribución por áreas de investigación */}
        <PuntajePorArea resumenPorArea={resumenPorArea} />
      </div>

      {/* Selector de categoría para análisis detallado */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Categoría de Análisis:
        </label>
        <div className="flex flex-wrap gap-2">
          {/* Botones para cada categoría disponible */}
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaSeleccionada(cat.id)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full transition-colors cursor-pointer ${
                categoriaSeleccionada === cat.id
                  ? "bg-blue-600 text-white" // Estilo para categoría seleccionada
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600" // Estilo para categorías no seleccionadas
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfica detallada por categoría seleccionada */}
      <PuntajePorCategoria
        categoria={categoriaSeleccionada}
        investigadorSeleccionado={investigadorSeleccionado}
      />
    </div>
  );
}

export default Dashboard;
