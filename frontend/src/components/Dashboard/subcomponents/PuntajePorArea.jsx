import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function PuntajePorArea({ resumenPorArea }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // Función para generar colores aleatorios
    function getRandomColor(seed) {
      const colors = [
        "rgba(54, 162, 235, 0.7)",
        "rgba(75, 192, 192, 0.7)",
        "rgba(153, 102, 255, 0.7)",
        "rgba(255, 159, 64, 0.7)",
        "rgba(255, 99, 132, 0.7)",
        "rgba(199, 199, 199, 0.7)",
        "rgba(83, 102, 255, 0.7)",
        "rgba(78, 205, 196, 0.7)",
        "rgba(255, 184, 184, 0.7)",
        "rgba(170, 128, 252, 0.7)",
      ];
      return colors[seed % colors.length];
    }

    // Preparar datos para la gráfica
    if (resumenPorArea.length > 0) {
      const data = {
        labels: resumenPorArea.map(
          (area) => `${area.nombre} (${area.investigadores})`
        ),
        datasets: [
          {
            label: "Puntaje Total",
            data: resumenPorArea.map((area) => area.puntos_totales),
            backgroundColor: resumenPorArea.map((_, index) =>
              getRandomColor(index)
            ),
            borderColor: resumenPorArea.map((_, index) =>
              getRandomColor(index).replace("0.7", "1")
            ),
            borderWidth: 1,
          },
        ],
      };

      setChartData(data);
    }
  }, [resumenPorArea]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          boxWidth: 15,
          padding: 10,
        },
      },
      title: {
        display: true,
        text: "Distribución de Puntaje por Área",
        color: "rgba(255, 255, 255, 0.9)",
        font: {
          size: 16,
        },
      },
      tooltip: {
        backgroundColor: "rgba(19, 25, 40, 0.9)",
        titleColor: "rgba(255, 255, 255, 0.9)",
        bodyColor: "rgba(255, 255, 255, 0.8)",
        borderColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value} puntos`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-5 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
      <div className="h-80">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}

export default PuntajePorArea;
