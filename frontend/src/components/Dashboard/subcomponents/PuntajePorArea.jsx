/**
 * PuntajePorArea - Componente para visualizar la distribución de puntajes por área de investigación
 *
 * Este componente muestra una gráfica de pastel (pie chart) que representa cómo se distribuyen
 * los puntajes totales entre las diferentes áreas de investigación. Cada sector del pastel
 * corresponde a un área, y el tamaño es proporcional al puntaje acumulado en dicha área.
 */
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2"; // Componente de Chart.js para gráficas tipo pastel
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"; // Componentes necesarios de Chart.js

// Registrar los componentes necesarios de Chart.js para que funcione la gráfica de pastel
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.resumenPorArea - Lista de objetos con el resumen de puntajes por área
 * @returns {JSX.Element} Gráfica de pastel mostrando la distribución de puntajes
 */
function PuntajePorArea({ resumenPorArea }) {
  // Estado para almacenar los datos procesados para la gráfica
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  /**
   * Efecto para procesar los datos de resumen por área y actualizar la gráfica
   * cuando cambia la prop resumenPorArea
   */
  useEffect(() => {
    /**
     * Función para generar colores aleatorios pero consistentes para cada área
     * Usa una paleta predefinida y asigna colores según el índice
     *
     * @param {number} seed - Índice usado para seleccionar el color
     * @returns {string} Valor de color en formato rgba
     */
    function getRandomColor(seed) {
      // Paleta de colores predefinida para mantener coherencia visual
      const colors = [
        "rgba(54, 162, 235, 0.7)", // Azul
        "rgba(75, 192, 192, 0.7)", // Verde azulado
        "rgba(153, 102, 255, 0.7)", // Púrpura
        "rgba(255, 159, 64, 0.7)", // Naranja
        "rgba(255, 99, 132, 0.7)", // Rosa
        "rgba(199, 199, 199, 0.7)", // Gris
        "rgba(83, 102, 255, 0.7)", // Azul púrpura
        "rgba(78, 205, 196, 0.7)", // Turquesa
        "rgba(255, 184, 184, 0.7)", // Salmón
        "rgba(170, 128, 252, 0.7)", // Lavanda
      ];
      // Usar el módulo para ciclar a través de los colores si hay más áreas que colores
      return colors[seed % colors.length];
    }

    // Preparar datos para la gráfica solo si hay datos disponibles
    if (resumenPorArea.length > 0) {
      const data = {
        // Etiquetas para cada sector, mostrando nombre del área y cantidad de investigadores
        labels: resumenPorArea.map(
          (area) => `${area.nombre} (${area.investigadores})`
        ),
        datasets: [
          {
            label: "Puntaje Total",
            // Valores numéricos que determinan el tamaño de cada sector del pastel
            data: resumenPorArea.map((area) => area.puntos_totales),
            // Colores de fondo para cada sector, usando la función getRandomColor
            backgroundColor: resumenPorArea.map((_, index) =>
              getRandomColor(index)
            ),
            // Colores de borde para cada sector, haciendo los bordes más opacos que el fondo
            borderColor: resumenPorArea.map(
              (_, index) => getRandomColor(index).replace("0.7", "1") // Reemplazar la opacidad para bordes más sólidos
            ),
            borderWidth: 1, // Ancho del borde entre sectores
          },
        ],
      };

      // Actualizar el estado con los datos procesados
      setChartData(data);
    }
  }, [resumenPorArea]); // Se recalcula cuando cambia el resumen por área

  /**
   * Configuración de opciones para la gráfica de pastel
   * Define aspectos visuales, posición de la leyenda, formato de tooltips, etc.
   */
  const options = {
    responsive: true, // Se adapta al tamaño del contenedor
    maintainAspectRatio: false, // Permite definir altura personalizada
    plugins: {
      legend: {
        // Posición adaptativa de la leyenda según el ancho de la pantalla
        position: window.innerWidth < 500 ? "bottom" : "right",
        labels: {
          color: "rgba(255, 255, 255, 0.8)", // Color del texto de la leyenda
          // Ancho de los cuadros de color en la leyenda, adaptativo
          boxWidth: window.innerWidth < 768 ? 12 : 15,
          // Espaciado entre elementos de la leyenda, adaptativo
          padding: window.innerWidth < 768 ? 6 : 10,
          font: {
            // Tamaño de fuente adaptable según el ancho de la pantalla
            size: window.innerWidth < 768 ? 9 : 12,
          },
        },
      },
      title: {
        display: true,
        text: "Distribución de Puntaje por Área", // Título de la gráfica
        color: "rgba(255, 255, 255, 0.9)", // Color del título
        font: {
          // Tamaño adaptable para diferentes dispositivos
          size: window.innerWidth < 768 ? 14 : 16,
        },
      },
      tooltip: {
        // Configuración visual del tooltip que aparece al pasar el mouse
        backgroundColor: "rgba(19, 25, 40, 0.9)", // Fondo oscuro
        titleColor: "rgba(255, 255, 255, 0.9)", // Color del título
        bodyColor: "rgba(255, 255, 255, 0.8)", // Color del texto
        borderColor: "rgba(59, 130, 246, 0.5)", // Borde azul
        borderWidth: 1,
        padding: 10,
        callbacks: {
          // Personalizar el texto que muestra el tooltip
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            // Formatear el texto del tooltip para incluir puntaje
            return `${label}: ${value} puntos`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
      {/* Contenedor con altura responsiva para la gráfica */}
      <div className="h-64 sm:h-80">
        {/* Componente de gráfica de pastel de Chart.js */}
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}

export default PuntajePorArea;
