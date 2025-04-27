/**
 * PuntajePorCategoria - Componente avanzado para visualizar puntajes por categoría específica
 *
 * Este componente muestra la distribución de puntajes dentro de una categoría específica
 * (estudiantes de maestría, doctorado, líneas de investigación, etc.) usando gráficas interactivas.
 * Permite cambiar entre visualización de barras y dona, y filtrar por investigador.
 */
import { useEffect, useState } from "react";
import { puntajeService } from "../../../api/services/puntajeService"; // Servicio para obtener datos
import { Bar, Doughnut } from "react-chartjs-2"; // Componentes para gráficas de barras y dona
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"; // Componentes necesarios de Chart.js
import {
  ChartBarIcon,
  ChartPieIcon,
  ArrowPathIcon,
  AcademicCapIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  DocumentTextIcon,
  CalendarIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline"; // Iconos para la interfaz

// Registrar componentes necesarios de Chart.js para que funcionen las gráficas
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Componente de superposición para mostrar consejos de uso al usuario
 * Se muestra sobre la gráfica hasta que el usuario lo cierra
 *
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onDismiss - Función a ejecutar cuando se cierra el overlay
 * @returns {JSX.Element|null} Overlay con consejos o null si está oculto
 */
function TipOverlay({ onDismiss }) {
  const [visible, setVisible] = useState(true);

  // Si no es visible, no renderizar nada
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-blue-500/50 max-w-md w-full mx-4">
        {/* Título del overlay de consejos */}
        <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-2 sm:mb-3 flex items-center">
          <LightBulbIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
          Consejos
        </h3>

        {/* Lista de consejos para usar la gráfica */}
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start">
            <span className="mr-2 flex-shrink-0">•</span>
            <span className="text-sm md:text-base">
              Haz clic en las etiquetas de la leyenda para mostrar/ocultar áreas
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 flex-shrink-0">•</span>
            <span className="text-sm md:text-base">
              Pasa el cursor sobre las barras para ver detalles
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 flex-shrink-0">•</span>
            <span className="text-sm md:text-base">
              Cambia entre visualización de barras y dona con los botones
            </span>
          </li>
        </ul>

        {/* Botón para cerrar el overlay */}
        <button
          onClick={() => {
            setVisible(false);
            if (onDismiss) onDismiss();
          }}
          className="mt-5 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded transition-colors cursor-pointer"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

/**
 * Componente principal para visualizar puntajes por categoría
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.categoria - Categoría a mostrar (estudiantes_maestria, estudiantes_doctorado, etc.)
 * @param {number|null} props.investigadorSeleccionado - ID del investigador seleccionado (null para mostrar todos)
 * @returns {JSX.Element} Gráfica interactiva de puntajes por categoría
 */
function PuntajePorCategoria({ categoria, investigadorSeleccionado }) {
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);

  // Estado para manejar errores en la carga de datos
  const [error, setError] = useState(null);

  // Estado para almacenar los datos procesados para las gráficas
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // Estado para alternar entre visualización de barras o dona
  const [chartType, setChartType] = useState("bar"); // 'bar' o 'doughnut'

  // Estado para controlar la visibilidad del overlay de consejos
  const [showTip, setShowTip] = useState(true);

  // Estado para indicar que se están actualizando los datos
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Objeto con títulos descriptivos para cada categoría
   * Muestra el propósito de cada categoría en lenguaje amigable para el usuario
   */
  const titulos = {
    estudiantes_maestria: "Puntos por Estudiantes de Maestría",
    estudiantes_doctorado: "Puntos por Estudiantes de Doctorado",
    lineas: "Puntos por Líneas de Investigación",
    proyectos: "Puntos por Proyectos",
    articulos: "Puntos por Artículos",
    eventos: "Puntos por Eventos",
  };

  /**
   * Objeto con iconos correspondientes a cada categoría
   * Proporciona iconos visuales para identificar fácilmente cada categoría
   */
  const iconoCategoria = {
    estudiantes_maestria: (
      <AcademicCapIcon className="h-6 w-6 inline text-blue-400 mr-2" />
    ),
    estudiantes_doctorado: (
      <BookOpenIcon className="h-6 w-6 inline text-purple-400 mr-2" />
    ),
    lineas: (
      <MagnifyingGlassIcon className="h-6 w-6 inline text-green-400 mr-2" />
    ),
    proyectos: (
      <RocketLaunchIcon className="h-6 w-6 inline text-amber-400 mr-2" />
    ),
    articulos: (
      <DocumentTextIcon className="h-6 w-6 inline text-pink-400 mr-2" />
    ),
    eventos: <CalendarIcon className="h-6 w-6 inline text-orange-400 mr-2" />,
  };

  /**
   * Función principal para obtener y procesar datos para las gráficas
   * Maneja la obtención de datos del API, su transformación y preparación para Chart.js
   */
  const fetchDataAndProcess = async () => {
    try {
      setLoading(true);
      if (refreshing) setRefreshing(true);

      // Si la categoría es "total", mostrar mensaje y salir
      // Esta categoría se maneja de forma especial en la interfaz
      if (categoria === "total") {
        setLoading(false);
        setRefreshing(false);
        setChartData({
          bar: { labels: [], datasets: [] },
          doughnut: { labels: [], datasets: [{ data: [] }] },
        });
        return;
      }

      // Obtener datos del servicio API para la categoría seleccionada
      const data = await puntajeService.getStatsPorCategoria(categoria);

      // Arrays y objetos para transformación de datos
      const transformedData = [];
      const areaColors = {}; // Mapeo de área a color
      const areaData = {}; // Datos por área e investigador
      const areaTotals = {}; // Totales por área

      // Paleta de colores con alta saturación para mejor visualización
      const colores = [
        "rgba(59, 130, 246, 0.85)", // blue-500
        "rgba(139, 92, 246, 0.85)", // violet-500
        "rgba(236, 72, 153, 0.85)", // pink-500
        "rgba(16, 185, 129, 0.85)", // emerald-500
        "rgba(245, 158, 11, 0.85)", // amber-500
        "rgba(239, 68, 68, 0.85)", // red-500
        "rgba(99, 102, 241, 0.85)", // indigo-500
        "rgba(20, 184, 166, 0.85)", // teal-500
        "rgba(249, 115, 22, 0.85)", // orange-500
        "rgba(168, 85, 247, 0.85)", // purple-500
      ];

      // Procesar datos por área
      data.forEach((area, areaIndex) => {
        // Asignar color al área (cíclicamente si hay más áreas que colores)
        areaColors[area.nombre] = colores[areaIndex % colores.length];
        areaTotals[area.nombre] = 0;

        // Filtrar por investigador si hay uno seleccionado
        const investigadoresFiltrados = investigadorSeleccionado
          ? area.investigadores.filter(
              (inv) => inv.id === investigadorSeleccionado
            )
          : area.investigadores;

        // Filtrar investigadores con puntaje 0 o nulo para mostrar solo datos relevantes
        const investigadoresConPuntaje = investigadoresFiltrados.filter(
          (inv) => inv.puntaje > 0
        );

        // Si hay investigadores después del filtrado, procesar sus datos
        if (investigadoresConPuntaje.length > 0) {
          // Ordenar por puntaje de mayor a menor para destacar más relevantes
          const ordenados = [...investigadoresConPuntaje].sort(
            (a, b) => b.puntaje - a.puntaje
          );

          // Limitar a los 8 mejores para evitar gráficas con demasiados elementos
          const top = ordenados.slice(0, 8);

          top.forEach((inv) => {
            // Acumular total por área para gráfica de dona
            areaTotals[area.nombre] += inv.puntaje;

            // Guardar datos para transformación
            transformedData.push({
              nombre: inv.nombre,
              area: area.nombre,
              puntaje: inv.puntaje,
            });

            // Inicializar objeto para este investigador si es necesario
            if (!areaData[inv.nombre]) {
              areaData[inv.nombre] = {};
            }

            // Guardar puntaje del investigador en esta área
            areaData[inv.nombre][area.nombre] = inv.puntaje;
          });
        }
      });

      // Obtener nombres únicos de investigadores (para etiquetas del eje X)
      const investigadores = Array.from(
        new Set(transformedData.map((d) => d.nombre))
      );

      // Obtener áreas únicas con puntajes mayores a 0 (para dataset y leyenda)
      const areas = Object.keys(areaTotals).filter(
        (area) => areaTotals[area] > 0
      );

      // Si no hay datos relevantes después del filtrado, salir con datos vacíos
      if (areas.length === 0 || investigadores.length === 0) {
        setLoading(false);
        setRefreshing(false);
        setChartData({
          bar: { labels: [], datasets: [] },
          doughnut: { labels: [], datasets: [{ data: [] }] },
        });
        return;
      }

      // Crear datasets para gráfico de barras (un dataset por área)
      const datasets = areas.map((area) => ({
        label: area,
        data: investigadores.map((inv) =>
          areaData[inv] && areaData[inv][area] ? areaData[inv][area] : 0
        ),
        backgroundColor: areaColors[area],
        borderColor: areaColors[area].replace("0.85", "1"), // Borde más opaco
        borderWidth: 1,
        borderRadius: 4, // Bordes redondeados para las barras
        hoverOffset: 4, // Desplazamiento al pasar el cursor
      }));

      // Dataset para gráfico de dona con totales por área
      const doughnutDataset = {
        labels: areas,
        datasets: [
          {
            data: areas.map((area) => areaTotals[area]),
            backgroundColor: areas.map((area) => areaColors[area]),
            borderColor: areas.map((area) =>
              areaColors[area].replace("0.85", "1")
            ),
            borderWidth: 1,
            hoverOffset: 15, // Mayor desplazamiento al pasar el cursor
          },
        ],
      };

      // Actualizar estado con los datos procesados para ambos tipos de gráficas
      setChartData({
        bar: {
          labels: investigadores,
          datasets: datasets,
        },
        doughnut: doughnutDataset,
      });

      // Finalizar estados de carga
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      // Manejar errores en la carga de datos
      setError("Error al cargar los datos de la categoría");
      setLoading(false);
      setRefreshing(false);
      console.error(err);
    }
  };

  /**
   * Efecto para cargar datos cuando cambia la categoría o el investigador seleccionado
   */
  useEffect(() => {
    fetchDataAndProcess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoria, investigadorSeleccionado]);

  /**
   * Configuración para gráfico de barras
   * Define todos los aspectos visuales, formateo y comportamiento de la gráfica de barras
   */
  const barOptions = {
    // Opciones generales
    responsive: true, // Se adapta al contenedor
    maintainAspectRatio: false, // Permite altura personalizada

    // Configuración de plugins
    plugins: {
      // Leyenda adaptativa según tamaño de pantalla
      legend: {
        position: window.innerWidth < 500 ? "bottom" : "top",
        labels: {
          color: "rgba(255, 255, 255, 0.8)", // Color del texto
          padding: window.innerWidth < 768 ? 8 : 15, // Espaciado adaptativo
          font: {
            size: window.innerWidth < 768 ? 9 : 11, // Tamaño adaptativo
          },
          usePointStyle: true, // Usa círculos en vez de cuadrados
          pointStyle: "circle",
        },
      },

      // Título principal de la gráfica
      title: {
        display: true,
        text: titulos[categoria] || "Análisis por Categoría",
        color: "rgba(255, 255, 255, 0.9)",
        font: {
          size: window.innerWidth < 768 ? 14 : 18, // Tamaño adaptativo
          weight: "bold",
        },
        padding: {
          top: 5,
          bottom: window.innerWidth < 768 ? 10 : 20, // Espaciado adaptativo
        },
      },

      // Configuración de tooltips (información al pasar el cursor)
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)", // Fondo oscuro
        titleColor: "rgba(255, 255, 255, 0.95)", // Color título
        bodyColor: "rgba(255, 255, 255, 0.9)", // Color texto
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
        displayColors: true, // Mostrar colores de las áreas
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          // Personalizar título del tooltip
          title: function (tooltipItems) {
            return tooltipItems[0].label; // Nombre del investigador
          },
          // Personalizar contenido del tooltip
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y} puntos`;
          },
        },
      },

      // Plugin para añadir sombra a las barras
      shadowPlugin: {
        beforeDraw: function (chart) {
          const ctx = chart.ctx;
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;
        },
      },
    },

    // Espaciado interno de la gráfica
    layout: {
      padding: {
        top: 5,
        bottom: 5,
        left: 10,
        right: 10,
      },
    },

    // Configuración de ejes
    scales: {
      // Eje X (nombres de investigadores)
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 0.75)", // Color del texto
          maxRotation: 45, // Rotar etiquetas para evitar solapamiento
          minRotation: 45,
          font: {
            size: window.innerWidth < 768 ? 8 : 11, // Tamaño adaptativo
          },
        },
        grid: {
          color: "rgba(55, 65, 81, 0.3)", // Color de líneas de cuadrícula
          drawBorder: false, // No mostrar borde externo
        },
      },
      // Eje Y (puntajes)
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 0.75)", // Color del texto
          font: {
            size: window.innerWidth < 768 ? 8 : 11, // Tamaño adaptativo
          },
          padding: window.innerWidth < 768 ? 3 : 6, // Espaciado adaptativo
        },
        grid: {
          color: "rgba(55, 65, 81, 0.3)", // Color de líneas de cuadrícula
          drawBorder: false, // No mostrar borde externo
        },
        title: {
          display: true,
          text: "Puntos", // Etiqueta del eje
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 12,
            weight: "500",
          },
          padding: {
            top: 0,
            bottom: 10,
          },
        },
      },
    },

    // Configuración de animaciones
    animation: {
      duration: 1000, // Duración en milisegundos
      easing: "easeOutQuart", // Tipo de transición
    },

    // Espaciado entre barras
    barPercentage: 0.8, // Ancho de las barras (proporción del espacio disponible)
    categoryPercentage: 0.7, // Espacio entre grupos de barras
  };

  /**
   * Configuración para gráfico de dona
   * Define aspectos visuales, formateo y comportamiento de la gráfica circular
   */
  const doughnutOptions = {
    // Opciones generales
    responsive: true, // Se adapta al contenedor
    maintainAspectRatio: false, // Permite altura personalizada

    // Configuración de plugins
    plugins: {
      // Leyenda adaptativa según tamaño de pantalla
      legend: {
        position: window.innerWidth < 768 ? "bottom" : "right",
        labels: {
          color: "rgba(255, 255, 255, 0.8)", // Color del texto
          padding: 15,
          font: {
            size: window.innerWidth < 768 ? 9 : 11, // Tamaño adaptativo
          },
          usePointStyle: true, // Usa círculos en vez de cuadrados
          pointStyle: "circle",
        },
        title: {
          display: true,
          text: "Áreas", // Título de la leyenda
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 13,
            weight: "500",
          },
        },
      },

      // Título principal de la gráfica
      title: {
        display: true,
        text: `${titulos[categoria] || "Análisis por Categoría"} por Área`,
        color: "rgba(255, 255, 255, 0.9)",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },

      // Configuración de tooltips (información al pasar el cursor)
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)", // Fondo oscuro
        titleColor: "rgba(255, 255, 255, 0.95)", // Color título
        bodyColor: "rgba(255, 255, 255, 0.9)", // Color texto
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
          // Personalizar contenido del tooltip con porcentaje
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((context.parsed * 100) / total);
            return `${context.label}: ${context.parsed} puntos (${percentage}%)`;
          },
        },
      },
    },

    // Tamaño del agujero interior (como porcentaje del radio)
    cutout: "60%",

    // Configuración de animaciones
    animation: {
      animateRotate: true, // Animar rotación
      animateScale: true, // Animar escala
    },
  };

  /**
   * Función para actualizar manualmente los datos
   * No usado actualmente (marcado con eslint-disable)
   */
  // eslint-disable-next-line no-unused-vars
  const refreshData = () => {
    fetchDataAndProcess();
  };

  /**
   * Renderizado condicional: Mostrar indicador de carga si estamos cargando datos
   */
  if (loading && !refreshing) {
    return (
      <div className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-5 rounded-lg border border-blue-500/20 min-h-[400px] flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  /**
   * Renderizado condicional: Mostrar mensaje de error si hay algún problema
   */
  if (error) {
    return (
      <div className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-5 rounded-lg border border-blue-500/20 min-h-[400px] flex justify-center items-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  /**
   * Renderizado condicional: Mostrar mensaje informativo si la categoría es "total"
   * Esta categoría se maneja de forma especial indicando que se muestra en otro componente
   */
  if (categoria === "total") {
    return (
      <div className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-5 rounded-lg border border-blue-500/20 min-h-[400px] flex flex-col justify-center items-center">
        <ChartBarIcon className="h-16 w-16 text-blue-500/70 mb-4" />
        <div className="text-gray-300 text-center">
          <h3 className="text-xl font-semibold mb-2">Puntaje Total</h3>
          <p className="text-gray-400">
            El puntaje total se muestra en el gráfico superior "Puntaje General
            por Investigador".
          </p>
        </div>
      </div>
    );
  }

  /**
   * Renderizado condicional: Mostrar mensaje cuando no hay datos disponibles
   */
  if (!chartData.bar || chartData.bar.labels.length === 0) {
    return (
      <div className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-5 rounded-lg border border-blue-500/20 min-h-[400px] flex flex-col justify-center items-center">
        <div className="text-gray-400 text-center">
          <h3 className="text-lg font-semibold mb-2">
            No hay datos disponibles para esta categoría
          </h3>
          <p className="text-sm text-gray-500">
            {investigadorSeleccionado
              ? "El investigador seleccionado no tiene puntajes en esta categoría."
              : "No hay investigadores con puntajes en esta categoría."}
          </p>
        </div>
      </div>
    );
  }

  /**
   * Renderizado principal: Mostrar gráfica cuando hay datos disponibles
   */
  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 relative">
      {/* Cabecera con controles para cambiar el tipo de gráfica */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Título con icono correspondiente a la categoría */}
        <div className="flex items-center">
          <div className="hidden sm:block">{iconoCategoria[categoria]}</div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-200">
            {titulos[categoria] || "Análisis por Categoría"}
          </h3>
        </div>

        {/* Botones para alternar entre tipos de gráfica */}
        <div className="inline-flex bg-gray-700/70 rounded-md p-1">
          <button
            onClick={() => setChartType("bar")}
            className={`flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors cursor-pointer ${
              chartType === "bar"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-600/70"
            }`}
          >
            <ChartBarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
            Barras
          </button>
          <button
            onClick={() => setChartType("doughnut")}
            className={`flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors cursor-pointer ${
              chartType === "doughnut"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-600/70"
            }`}
          >
            <ChartPieIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
            Dona
          </button>
        </div>
      </div>

      {/* Contenedor de la gráfica con altura adaptable */}
      <div className="relative h-[300px] sm:h-[350px] md:h-[450px]">
        {/* Overlay de consejos (solo visible si showTip es true) */}
        {showTip && <TipOverlay onDismiss={() => setShowTip(false)} />}

        {/* Overlay de actualización durante la recarga de datos */}
        {refreshing && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] flex items-center justify-center z-20 rounded">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
              <p className="text-blue-400">Actualizando datos...</p>
            </div>
          </div>
        )}

        {/* Renderizado condicional de la gráfica según el tipo seleccionado */}
        {chartType === "bar" ? (
          <Bar data={chartData.bar} options={barOptions} />
        ) : (
          <Doughnut data={chartData.doughnut} options={doughnutOptions} />
        )}
      </div>

      {/* Nota informativa al pie de la gráfica */}
      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          <span className="text-blue-400 font-medium">Nota:</span> Los datos
          muestran los{" "}
          {chartType === "bar"
            ? "investigadores con mayor puntaje"
            : "puntajes totales"}{" "}
          en la categoría {titulos[categoria]?.toLowerCase() || "seleccionada"}.
          {investigadorSeleccionado
            ? " Filtrando por investigador seleccionado."
            : ""}
        </p>
      </div>

      {/* Estilos CSS para animaciones de texto en el componente TipOverlay */}
      <style jsx="true">{`
        .typing-animation,
        .typing-animation-2,
        .typing-animation-3 {
          overflow: hidden;
          border-right: 0.15em solid transparent;
          white-space: nowrap;
          margin: 0;
          letter-spacing: 0.03em;
          animation: typing 3.5s steps(40, end),
            blink-caret 0.75s step-end infinite;
        }

        .typing-animation-2 {
          animation-delay: 0.8s;
          width: 0;
          animation: typing 3.5s steps(40, end) 0.8s forwards,
            blink-caret 0.75s step-end infinite;
        }

        .typing-animation-3 {
          animation-delay: 1.6s;
          width: 0;
          animation: typing 3.5s steps(40, end) 1.6s forwards,
            blink-caret 0.75s step-end infinite;
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes blink-caret {
          from,
          to {
            border-color: transparent;
          }
          50% {
            border-color: #60a5fa;
          }
        }
      `}</style>
    </div>
  );
}

export default PuntajePorCategoria;
