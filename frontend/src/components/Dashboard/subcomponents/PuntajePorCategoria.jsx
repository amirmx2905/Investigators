import { useEffect, useState } from "react";
import { puntajeService } from "../../../api/services/puntajeService";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
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
} from "@heroicons/react/24/outline";

// Registrar componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Componente de instrucciones con animación de escritura mejorado
function TipOverlay({ onDismiss }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
      <div className="bg-gray-800 p-6 rounded-lg border border-blue-500/50 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-blue-400 mb-3 flex items-center">
          <LightBulbIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          Consejos
        </h3>
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

function PuntajePorCategoria({ categoria, investigadorSeleccionado }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartType, setChartType] = useState("bar"); // 'bar' o 'doughnut'
  const [showTip, setShowTip] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Remover total del objeto de títulos
  const titulos = {
    estudiantes_maestria: "Puntos por Estudiantes de Maestría",
    estudiantes_doctorado: "Puntos por Estudiantes de Doctorado",
    lineas: "Puntos por Líneas de Investigación",
    proyectos: "Puntos por Proyectos",
    articulos: "Puntos por Artículos",
    eventos: "Puntos por Eventos",
  };

  // Iconos correspondientes a cada categoría (remover total)
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

  const fetchDataAndProcess = async () => {
    try {
      setLoading(true);
      if (refreshing) setRefreshing(true);

      // Si la categoría es "total", mostrar mensaje y salir
      if (categoria === "total") {
        setLoading(false);
        setRefreshing(false);
        setChartData({
          bar: { labels: [], datasets: [] },
          doughnut: { labels: [], datasets: [{ data: [] }] },
        });
        return;
      }

      const data = await puntajeService.getStatsPorCategoria(categoria);

      // Transformar los datos para la gráfica
      const transformedData = [];
      const areaColors = {};
      const areaData = {};
      const areaTotals = {};

      // Colores para las áreas con más saturación para mejor visualización
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

      // Organizar datos por área para dataset agrupado
      data.forEach((area, areaIndex) => {
        // Asignar color al área
        areaColors[area.nombre] = colores[areaIndex % colores.length];
        areaTotals[area.nombre] = 0;

        // Filtrar por investigador si hay uno seleccionado
        const investigadoresFiltrados = investigadorSeleccionado
          ? area.investigadores.filter(
              (inv) => inv.id === investigadorSeleccionado
            )
          : area.investigadores;

        // Filtrar investigadores con puntaje 0 o nulo
        const investigadoresConPuntaje = investigadoresFiltrados.filter(
          (inv) => inv.puntaje > 0
        );

        // Si hay investigadores después del filtrado, procesar
        if (investigadoresConPuntaje.length > 0) {
          // Ordena por puntaje de mayor a menor
          const ordenados = [...investigadoresConPuntaje].sort(
            (a, b) => b.puntaje - a.puntaje
          );

          // Limitar a los 8 mejores para evitar gráficas muy densas
          const top = ordenados.slice(0, 8);

          top.forEach((inv) => {
            // Acumular total por área
            areaTotals[area.nombre] += inv.puntaje;

            // Guardar los datos para la transformación
            transformedData.push({
              nombre: inv.nombre,
              area: area.nombre,
              puntaje: inv.puntaje,
            });

            // Si esta es la primera vez que vemos este investigador, inicializar
            if (!areaData[inv.nombre]) {
              areaData[inv.nombre] = {};
            }

            // Guardar el puntaje de este investigador en esta área
            areaData[inv.nombre][area.nombre] = inv.puntaje;
          });
        }
      });

      // Obtener los nombres únicos de investigadores
      const investigadores = Array.from(
        new Set(transformedData.map((d) => d.nombre))
      );

      // Obtener las áreas únicas con puntajes mayores a 0
      const areas = Object.keys(areaTotals).filter(
        (area) => areaTotals[area] > 0
      );

      // Si no hay datos relevantes después del filtrado, salir
      if (areas.length === 0 || investigadores.length === 0) {
        setLoading(false);
        setRefreshing(false);
        setChartData({
          bar: { labels: [], datasets: [] },
          doughnut: { labels: [], datasets: [{ data: [] }] },
        });
        return;
      }

      // Crear datasets de Chart.js (un dataset por área)
      const datasets = areas.map((area) => ({
        label: area,
        data: investigadores.map((inv) =>
          areaData[inv] && areaData[inv][area] ? areaData[inv][area] : 0
        ),
        backgroundColor: areaColors[area],
        borderColor: areaColors[area].replace("0.85", "1"),
        borderWidth: 1,
        borderRadius: 4, // Bordes redondeados para las barras
        hoverOffset: 4,
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
            hoverOffset: 15,
          },
        ],
      };

      // Preparar datos para Chart.js
      setChartData({
        bar: {
          labels: investigadores,
          datasets: datasets,
        },
        doughnut: doughnutDataset,
      });

      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      setError("Error al cargar los datos de la categoría");
      setLoading(false);
      setRefreshing(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDataAndProcess();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoria, investigadorSeleccionado]);

  // Configuración para gráfico de barras
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          padding: 15,
          font: {
            size: 11,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: titulos[categoria] || "Análisis por Categoría",
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
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "rgba(255, 255, 255, 0.95)",
        bodyColor: "rgba(255, 255, 255, 0.9)",
        borderColor: "rgba(59, 130, 246, 0.6)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          title: function (tooltipItems) {
            return tooltipItems[0].label;
          },
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y} puntos`;
          },
        },
      },
      // Añadir sombra sutilmente
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
    layout: {
      padding: {
        top: 5,
        bottom: 5,
        left: 10,
        right: 10,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 0.75)",
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
          },
        },
        grid: {
          color: "rgba(55, 65, 81, 0.3)",
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 0.75)",
          font: {
            size: 11,
          },
          padding: 6,
        },
        grid: {
          color: "rgba(55, 65, 81, 0.3)",
          drawBorder: false,
        },
        title: {
          display: true,
          text: "Puntos",
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
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
    // Más espacio entre barras
    barPercentage: 0.8,
    categoryPercentage: 0.7,
  };

  // Opciones para gráfico de dona
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          padding: 15,
          font: {
            size: 11,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
        title: {
          display: true,
          text: "Áreas",
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 13,
            weight: "500",
          },
        },
      },
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
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "rgba(255, 255, 255, 0.95)",
        bodyColor: "rgba(255, 255, 255, 0.9)",
        borderColor: "rgba(59, 130, 246, 0.6)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((context.parsed * 100) / total);
            return `${context.label}: ${context.parsed} puntos (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  // eslint-disable-next-line no-unused-vars
  const refreshData = () => {
    fetchDataAndProcess();
  };

  if (loading && !refreshing) {
    return (
      <div className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-5 rounded-lg border border-blue-500/20 min-h-[400px] flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-5 rounded-lg border border-blue-500/20 min-h-[400px] flex justify-center items-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Si estamos en la categoría "total", mostrar mensaje informativo
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

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 relative">
      {/* Controladores del gráfico - versión simplificada */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        {/* Título con icono */}
        <div className="flex items-center">
          {iconoCategoria[categoria]}
          <h3 className="text-lg font-semibold text-gray-200">
            {titulos[categoria] || "Análisis por Categoría"}
          </h3>
        </div>

        {/* Contenedor central para los botones de tipo de gráfico */}
        <div className="inline-flex bg-gray-700/70 rounded-md p-1">
          <button
            onClick={() => setChartType("bar")}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
              chartType === "bar"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-600/70"
            }`}
          >
            <ChartBarIcon className="h-4 w-4 mr-1.5" />
            Barras
          </button>
          <button
            onClick={() => setChartType("doughnut")}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
              chartType === "doughnut"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-600/70"
            }`}
          >
            <ChartPieIcon className="h-4 w-4 mr-1.5" />
            Dona
          </button>
        </div>
      </div>

      {/* Contenedor del gráfico con más altura */}
      <div className="relative h-[450px]">
        {showTip && <TipOverlay onDismiss={() => setShowTip(false)} />}

        {/* Overlay de actualización */}
        {refreshing && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] flex items-center justify-center z-20 rounded">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
              <p className="text-blue-400">Actualizando datos...</p>
            </div>
          </div>
        )}

        {/* Gráfico */}
        {chartType === "bar" ? (
          <Bar data={chartData.bar} options={barOptions} />
        ) : (
          <Doughnut data={chartData.doughnut} options={doughnutOptions} />
        )}
      </div>

      {/* Nota informativa */}
      <div className="mt-4 pt-3 border-t border-gray-700">
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

      {/* Estilos CSS para animaciones */}
      <style jsx>{`
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
