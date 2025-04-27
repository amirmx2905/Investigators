import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowPathIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import axios from "axios";

import { puntajeService } from "../../api/services/puntajeService";
import DashboardHeader from "./subcomponents/DashboardHeader";
import InvestigadorSelector from "./subcomponents/InvestigadorSelector";
import PuntajeGeneral from "./subcomponents/PuntajeGeneral";
import PuntajePorArea from "./subcomponents/PuntajePorArea";
import PuntajePorCategoria from "./subcomponents/PuntajePorCategoria";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [puntajes, setPuntajes] = useState([]);
  const [resumenPorArea, setResumenPorArea] = useState([]);
  const [investigadorSeleccionado, setInvestigadorSeleccionado] =
    useState(null);
  // Cambiar la categoría seleccionada por defecto de "total" a "estudiantes_maestria"
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    "estudiantes_maestria"
  );
  // eslint-disable-next-line no-unused-vars
  const [actualizando, setActualizando] = useState(false);

  const categorias = [
    { id: "estudiantes_maestria", nombre: "Estudiantes Maestría" },
    { id: "estudiantes_doctorado", nombre: "Estudiantes Doctorado" },
    { id: "lineas", nombre: "Líneas de Investigación" },
    { id: "proyectos", nombre: "Proyectos" },
    { id: "articulos", nombre: "Artículos" },
    { id: "eventos", nombre: "Eventos" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Función para obtener todos los investigadores (todas las páginas)
        const fetchAllInvestigadores = async () => {
          // Obtener la primera página para ver cuántas páginas hay en total
          const response = await axios.get("/api/puntajes/");
          const firstPageData = response.data;

          // Guardar los resultados de la primera página
          let allResults = [...firstPageData.results];

          // Si hay más páginas, obtenerlas
          if (firstPageData.total_pages > 1) {
            const additionalRequests = [];

            // Crear solicitudes para todas las páginas adicionales
            for (let page = 2; page <= firstPageData.total_pages; page++) {
              additionalRequests.push(axios.get(`/api/puntajes/?page=${page}`));
            }

            // Ejecutar todas las solicitudes en paralelo
            const additionalResponses = await Promise.all(additionalRequests);

            // Agregar los resultados de cada página adicional
            additionalResponses.forEach((response) => {
              allResults = [...allResults, ...response.data.results];
            });
          }

          return allResults;
        };

        // Cargar todos los puntajes (todas las páginas)
        const puntajesData = await fetchAllInvestigadores();

        // Asegurar que puntajes sea un array
        if (Array.isArray(puntajesData)) {
          setPuntajes(puntajesData);
          console.log("Total de investigadores cargados:", puntajesData.length);
        } else {
          // Si no es un array, inicializar como array vacío
          console.error("Formato de respuesta inesperado:", puntajesData);
          setPuntajes([]);
        }

        // Cargar resumen por área
        const resumenData = await puntajeService.getResumenPorArea();
        if (Array.isArray(resumenData)) {
          setResumenPorArea(resumenData);
        } else if (
          resumenData &&
          resumenData.results &&
          Array.isArray(resumenData.results)
        ) {
          setResumenPorArea(resumenData.results);
        } else {
          setResumenPorArea([]);
        }

        setLoading(false);
        // Limpiar cualquier error previo cuando la carga es exitosa
        setError(null);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        // Establecer el mensaje de error
        setError("Error al cargar los datos. Por favor, intente nuevamente.");
        setLoading(false);
        // Mostrar toast de error
        toast.error("Error al cargar datos. Intente nuevamente.", {
          position: "bottom-right",
        });
      }
    };

    fetchData();
  }, []);

  // eslint-disable-next-line no-unused-vars
  const recalcularPuntajes = async () => {
    try {
      setActualizando(true);
      await puntajeService.recalcularTodos();

      // Recargar datos
      const puntajesData = await puntajeService.getAll();
      // Mismo tratamiento que arriba
      if (Array.isArray(puntajesData)) {
        setPuntajes(puntajesData);
      } else if (
        puntajesData &&
        puntajesData.results &&
        Array.isArray(puntajesData.results)
      ) {
        setPuntajes(puntajesData.results);
      } else {
        setPuntajes([]);
      }

      const resumenData = await puntajeService.getResumenPorArea();
      if (Array.isArray(resumenData)) {
        setResumenPorArea(resumenData);
      } else if (
        resumenData &&
        resumenData.results &&
        Array.isArray(resumenData.results)
      ) {
        setResumenPorArea(resumenData.results);
      } else {
        setResumenPorArea([]);
      }

      toast.success("Puntajes actualizados correctamente");
      setActualizando(false);
      // Limpiar errores previos
      setError(null);
    } catch (err) {
      // Establecer el mensaje de error
      setError(
        "Error al actualizar los puntajes. Por favor, intente nuevamente."
      );
      toast.error("Error al actualizar los puntajes");
      setActualizando(false);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

  // Modificar el layout principal para ser más responsivo
  return (
    <div className="py-4 sm:py-6 px-2 sm:px-0">
      <ToastContainer position="bottom-right" theme="dark" />

      <DashboardHeader
        title="Dashboard Estadístico"
        subtitle="Análisis de desempeño de investigadores"
        icon={<ChartBarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Gráfica de Puntaje General */}
        <PuntajeGeneral
          puntajes={puntajes}
          investigadorSeleccionado={investigadorSeleccionado}
        />

        {/* Gráfica de Puntaje por Área */}
        <PuntajePorArea resumenPorArea={resumenPorArea} />
      </div>

      {/* Selector de categoría */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Categoría de Análisis:
        </label>
        <div className="flex flex-wrap gap-2">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaSeleccionada(cat.id)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full transition-colors cursor-pointer ${
                categoriaSeleccionada === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Gráficas por categoría */}
      <PuntajePorCategoria
        categoria={categoriaSeleccionada}
        investigadorSeleccionado={investigadorSeleccionado}
      />
    </div>
  );
}

export default Dashboard;
