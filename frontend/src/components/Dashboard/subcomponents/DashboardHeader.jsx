/**
 * DashboardHeader - Componente para mostrar el encabezado del dashboard
 *
 * Este componente renderiza un encabezado estilizado para las secciones del dashboard,
 * incluyendo un ícono, un título principal con gradiente de color y un subtítulo opcional.
 *
 * @param {Object} props - Las propiedades del componente
 * @param {string} props.title - El texto principal del encabezado
 * @param {string} props.subtitle - Texto secundario que proporciona contexto adicional (opcional)
 * @param {ReactNode} props.icon - Elemento de ícono SVG para mostrar junto al título
 * @returns {JSX.Element} Encabezado del dashboard estilizado
 */
function DashboardHeader({ title, subtitle, icon }) {
  return (
    <div className="mb-4 sm:mb-8">
      {/* Contenedor del título e ícono */}
      <div className="flex items-center mb-2 sm:mb-3">
        {/* Ícono del encabezado (pasado como prop) */}
        {icon}

        {/* Título principal con efecto de gradiente */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold ml-2 sm:ml-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          {title}
        </h1>
      </div>

      {/* Subtítulo condicional (solo se muestra si la prop subtitle existe) */}
      {subtitle && (
        <p className="text-gray-400 text-xs sm:text-sm md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default DashboardHeader;
