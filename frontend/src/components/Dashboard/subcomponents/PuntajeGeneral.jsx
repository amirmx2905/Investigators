/**
 * PuntajeGeneral - Componente para visualizar los Top 10 investigadores por puntaje total
 *
 * Este componente muestra una gráfica de barras horizontales con los 10 investigadores
 * que tienen el mayor puntaje total. Incluye funcionalidad para filtrar por investigador
 * seleccionado y actualizar datos manualmente. Gestiona la paginación del API para
 * asegurar que se muestren todos los investigadores disponibles.
 */
import { useEffect, useState, useCallback } from "react";
import { Bar } from "react-chartjs-2"; // Componente de Chart.js para gráficas de barras
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"; // Componentes necesarios de Chart.js
import axios from "axios"; // Para realizar peticiones HTTP

// Registrar los componentes necesarios de Chart.js para que funcionen las gráficas
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * @param {Object} props - Propiedades del componente
 * @param {number|null} props.investigadorSeleccionado - ID del investigador seleccionado para filtrar (null para mostrar todos)
 * @returns {JSX.Element} Gráfica de barras con los Top 10 investigadores
 */
function PuntajeGeneral({ investigadorSeleccionado }) {
  // Estado para almacenar los datos procesados para la gráfica
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // Estado para controlar la visualización del indicador de carga
  const [isLoading, setIsLoading] = useState(false);

  // Estado para almacenar todos los puntajes de investigadores (de todas las páginas)
  const [allPuntajes, setAllPuntajes] = useState([]);

  /**
   * Procesa los datos de puntajes para generar la visualización de la gráfica
   * Se ejecuta cuando cambian los datos o el investigador seleccionado
   *
   * @param {Array} datos - Array de objetos con datos de puntajes de investigadores
   */
  const procesarDatos = useCallback(
    (datos) => {
      // Si no hay datos o no es un array, inicializar con valores vacíos
      if (!Array.isArray(datos) || datos.length === 0) {
        setChartData({ labels: [], datasets: [] });
        return;
      }

      // Filtrar por investigador si hay uno seleccionado
      const puntajesFiltrados = investigadorSeleccionado
        ? datos.filter((p) => p.investigador === investigadorSeleccionado)
        : datos;

      // Filtrar investigadores con puntaje 0 o nulo para mostrar solo datos relevantes
      const puntajesConValor = puntajesFiltrados.filter(
        (p) => p.puntos_totales !== null && p.puntos_totales > 0
      );

      // Ordenar por puntaje total (de mayor a menor)
      const puntajesOrdenados = [...puntajesConValor].sort(
        (a, b) => b.puntos_totales - a.puntos_totales
      );

      // Limitar a los 10 mejores para evitar sobrecarga visual
      const puntajesTop = puntajesOrdenados.slice(0, 10);

      // Preparar datos en el formato requerido por Chart.js
      const data = {
        // Etiquetas para el eje Y (nombres de investigadores)
        labels: puntajesTop.map((p) => p.nombre_investigador),
        datasets: [
          {
            label: "Puntaje Total",
            // Valores para el eje X (puntajes)
            data: puntajesTop.map((p) => p.puntos_totales),
            backgroundColor: "rgba(59, 130, 246, 0.8)", // Azul semi-transparente
            borderColor: "rgba(59, 130, 246, 1)", // Borde azul sólido
            borderWidth: 1,
            borderRadius: 4, // Bordes redondeados en las barras
          },
        ],
      };

      // Actualizar el estado con los datos procesados
      setChartData(data);
    },
    [investigadorSeleccionado] // Se recalcula cuando cambia el investigador seleccionado
  );

  /**
   * Obtiene todos los puntajes de investigadores desde el API,
   * manejando la paginación para asegurar que se obtengan todos los registros.
   */
  const fetchAllPuntajes = useCallback(async () => {
    try {
      // Activar indicador de carga
      setIsLoading(true);

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

      console.log("Total de investigadores obtenidos:", allResults.length);

      // Actualizar el estado con todos los puntajes obtenidos
      setAllPuntajes(allResults);

      // Procesar los datos para la visualización
      procesarDatos(allResults);

      // Desactivar indicador de carga
      setIsLoading(false);
    } catch (error) {
      // Manejar errores en la obtención de datos
      console.error("Error al obtener todos los puntajes:", error);
      setIsLoading(false);
    }
  }, [procesarDatos]); // Depende de procesarDatos para actualizar la gráfica

  /**
   * Efecto para cargar todos los datos al iniciar el componente
   */
  useEffect(() => {
    fetchAllPuntajes();
  }, [fetchAllPuntajes]);

  /**
   * Efecto para reprocesar los datos cuando cambia el investigador seleccionado
   * o cuando se actualizan los puntajes
   */
  useEffect(() => {
    procesarDatos(allPuntajes);
  }, [investigadorSeleccionado, allPuntajes, procesarDatos]);

  /**
   * Configuración de opciones para la gráfica de Chart.js
   * Define aspectos visuales, formateo, etiquetas y comportamiento
   */
  const options = {
    responsive: true, // Se adapta al tamaño del contenedor
    maintainAspectRatio: false, // Permite definir altura personalizada
    indexAxis: "y", // Barras horizontales para mejor visualización de nombres
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(255, 255, 255, 0.8)", // Color del texto de la leyenda
          usePointStyle: true, // Usa estilo de punto en vez de rectángulo
          pointStyle: "circle", // Forma circular para los puntos
          padding: 15,
          font: {
            // Tamaño de fuente adaptable según el ancho de la pantalla
            size: window.innerWidth < 768 ? 9 : 11,
          },
        },
      },
      title: {
        display: true,
        text: "Top 10 Investigadores por Puntaje",
        color: "rgba(255, 255, 255, 0.9)", // Color del título
        font: {
          // Tamaño adaptable para diferentes dispositivos
          size: window.innerWidth < 768 ? 14 : 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        // Configuración visual del tooltip que aparece al pasar el mouse
        backgroundColor: "rgba(17, 24, 39, 0.95)", // Fondo oscuro
        titleColor: "rgba(255, 255, 255, 0.95)", // Color del título
        bodyColor: "rgba(255, 255, 255, 0.9)", // Color del texto
        borderColor: "rgba(59, 130, 246, 0.6)", // Borde azul
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8, // Bordes redondeados
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          // Personalizar el texto que muestra el tooltip
          label: function (context) {
            return `${context.parsed.x} puntos`; // Muestra el valor con la unidad
          },
        },
      },
      subtitle: {
        display: true,
        // Texto condicional según si hay un investigador seleccionado
        text: investigadorSeleccionado
          ? "Filtrado por investigador seleccionado"
          : "Mostrando los 10 investigadores con mayor puntaje",
        color: "rgba(255, 255, 255, 0.6)", // Color gris claro
        font: {
          size: 12,
          style: "italic",
        },
        padding: {
          bottom: 10,
        },
      },
    },
    layout: {
      // Espaciado interno del gráfico
      padding: {
        top: 5,
        bottom: 5,
        left: 10,
        right: 10,
      },
    },
    scales: {
      x: {
        // Configuración del eje X (valores/puntajes)
        title: {
          display: true,
          text: "Puntos", // Etiqueta del eje
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            size: 12,
          },
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)", // Color de los números del eje
          font: {
            size: window.innerWidth < 768 ? 9 : 11, // Tamaño adaptable
          },
        },
        grid: {
          color: "rgba(55, 65, 81, 0.3)", // Color de las líneas de cuadrícula
          drawBorder: false, // No mostrar bordes externos
        },
      },
      y: {
        // Configuración del eje Y (nombres de investigadores)
        ticks: {
          color: "rgba(255, 255, 255, 0.8)", // Color del texto
          font: {
            weight: "500", // Peso medio para mejor legibilidad
            size: window.innerWidth < 768 ? 9 : 11, // Tamaño adaptable
          },
        },
        grid: {
          display: false, // Ocultar líneas de cuadrícula horizontales
        },
      },
    },
    animation: {
      // Configuración de la animación al cargar o actualizar
      duration: 1000, // Duración en milisegundos
      easing: "easeOutQuart", // Tipo de efecto de animación
    },
  };

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 relative">
      {/* Botón para actualizar manualmente los datos */}
      <button
        onClick={fetchAllPuntajes}
        className="cursor-pointer absolute top-2 right-2 z-10 p-1.5 bg-blue-600/80 hover:bg-blue-600 rounded-full text-white shadow-lg transition-colors"
        title="Actualizar datos"
      >
        {/* Icono de actualización/recarga */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>

      {/* Overlay de carga que se muestra durante las peticiones */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] flex items-center justify-center z-20 rounded">
          <div className="flex flex-col items-center">
            {/* Indicador de carga animado */}
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-blue-400">
              Cargando todos los investigadores...
            </p>
          </div>
        </div>
      )}

      {/* Contenedor de la gráfica con altura responsiva */}
      <div className="h-64 sm:h-80 md:h-96">
        {/* Componente de gráfica de barras de Chart.js */}
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default PuntajeGeneral;
