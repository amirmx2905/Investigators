import { useEffect, useState } from "react";
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

// Registrar componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PuntajeGeneral({ puntajes, investigadorSeleccionado }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // Asegurarnos de que puntajes es un array
    if (!Array.isArray(puntajes) || puntajes.length === 0) {
      setChartData({ labels: [], datasets: [] });
      return;
    }

    // Filtrar por investigador si hay uno seleccionado
    const puntajesFiltrados = investigadorSeleccionado
      ? puntajes.filter((p) => p.investigador === investigadorSeleccionado)
      : puntajes;

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
          backgroundColor: "rgba(59, 130, 246, 0.8)", // Azul más saturado
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
          borderRadius: 4, // Barras con bordes redondeados
        },
      ],
    };

    setChartData(data);
  }, [puntajes, investigadorSeleccionado]);

  // Modificar las opciones para mejor responsividad
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

  // Modificar la altura y configuración responsiva
  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
      <div className="h-64 sm:h-80 md:h-96">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default PuntajeGeneral;
