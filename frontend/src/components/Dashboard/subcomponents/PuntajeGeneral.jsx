import { useEffect, useState, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PuntajeGeneral({ investigadorSeleccionado }) {
  // Eliminar initialPuntajes de los parámetros ya que no lo estamos usando
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [allPuntajes, setAllPuntajes] = useState([]);

  // Función para procesar los datos - definirla primero
  const procesarDatos = useCallback(
    (datos) => {
      // Asegurarnos de que datos es un array
      if (!Array.isArray(datos) || datos.length === 0) {
        setChartData({ labels: [], datasets: [] });
        return;
      }

      // Filtrar por investigador si hay uno seleccionado
      const puntajesFiltrados = investigadorSeleccionado
        ? datos.filter((p) => p.investigador === investigadorSeleccionado)
        : datos;

      // Filtrar investigadores con puntaje 0 o nulo
      const puntajesConValor = puntajesFiltrados.filter(
        (p) => p.puntos_totales !== null && p.puntos_totales > 0
      );

      // Ordenar por puntaje total (de mayor a menor)
      const puntajesOrdenados = [...puntajesConValor].sort(
        (a, b) => b.puntos_totales - a.puntos_totales
      );

      // Limitar a los 10 mejores para evitar sobrecarga visual
      const puntajesTop = puntajesOrdenados.slice(0, 10);

      // Preparar datos para la gráfica
      const data = {
        labels: puntajesTop.map((p) => p.nombre_investigador),
        datasets: [
          {
            label: "Puntaje Total",
            data: puntajesTop.map((p) => p.puntos_totales),
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      };

      setChartData(data);
    },
    [investigadorSeleccionado]
  );

  // Función para obtener todas las páginas de puntajes - definirla después
  const fetchAllPuntajes = useCallback(async () => {
    try {
      setIsLoading(true);

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

      console.log("Total de investigadores obtenidos:", allResults.length);

      // Actualizar el estado y procesar los datos
      setAllPuntajes(allResults);
      procesarDatos(allResults);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener todos los puntajes:", error);
      setIsLoading(false);
    }
  }, [procesarDatos]); // Añadir procesarDatos como dependencia

  // Efecto para cargar todos los datos al inicio
  useEffect(() => {
    fetchAllPuntajes();
  }, [fetchAllPuntajes]);

  // Efecto para procesar datos cuando cambia el investigador seleccionado
  useEffect(() => {
    procesarDatos(allPuntajes);
  }, [investigadorSeleccionado, allPuntajes, procesarDatos]);

  // Mantener las opciones existentes
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y", // Barras horizontales para mejor visualización de nombres
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
          font: {
            size: window.innerWidth < 768 ? 9 : 11,
          },
        },
      },
      title: {
        display: true,
        text: "Top 10 Investigadores por Puntaje",
        color: "rgba(255, 255, 255, 0.9)",
        font: {
          size: window.innerWidth < 768 ? 14 : 18,
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
            return `${context.parsed.x} puntos`;
          },
        },
      },
      subtitle: {
        display: true,
        text: investigadorSeleccionado
          ? "Filtrado por investigador seleccionado"
          : "Mostrando los 10 investigadores con mayor puntaje",
        color: "rgba(255, 255, 255, 0.6)",
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
      padding: {
        top: 5,
        bottom: 5,
        left: 10,
        right: 10,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Puntos",
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            size: 12,
          },
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            size: window.innerWidth < 768 ? 9 : 11,
          },
        },
        grid: {
          color: "rgba(55, 65, 81, 0.3)",
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            weight: "500",
            size: window.innerWidth < 768 ? 9 : 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 relative">
      {/* Botón para actualizar manualmente */}
      <button
        onClick={fetchAllPuntajes}
        className="cursor-pointer absolute top-2 right-2 z-10 p-1.5 bg-blue-600/80 hover:bg-blue-600 rounded-full text-white shadow-lg transition-colors"
        title="Actualizar datos"
      >
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

      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] flex items-center justify-center z-20 rounded">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-blue-400">
              Cargando todos los investigadores...
            </p>
          </div>
        </div>
      )}

      <div className="h-64 sm:h-80 md:h-96">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default PuntajeGeneral;
