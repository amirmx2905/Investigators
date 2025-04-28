import { Link } from "react-router-dom";

function MobileMenu({
  isOpen,
  isAdmin,
  isAdminPanel,
  // eslint-disable-next-line no-unused-vars
  isHomePage,
  isDashboard,
  onLogout,
  onNavigateToAdmin,
  onNavigateBack,
  onNavigateToDashboard,
}) {
  return (
    <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
      {isOpen && <div className="scanline"></div>}
      <div className="flex flex-col items-center space-y-8 px-6 mt-4">
        <h2
          className={`text-xl font-bold mb-6 relative ${
            isOpen ? "menu-glitch-effect" : ""
          }`}
          data-text="MENU"
        >
          MENU
        </h2>

        {/* Botón de Dashboard */}
        {!isDashboard && (
          <button
            onClick={onNavigateToDashboard}
            className="w-full bg-indigo-600/80 hover:bg-indigo-500/90 text-white py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 button-hover-effect glowing-border backdrop-blur-sm text-center"
          >
            Dashboard
          </button>
        )}

        {/* Botón de Panel Admin */}
        {isAdmin &&
          (isAdminPanel ? (
            <button
              onClick={onNavigateBack}
              className="w-full bg-blue-600/80 hover:bg-blue-500/90 text-white py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 button-hover-effect glowing-border backdrop-blur-sm text-center"
            >
              Regresar
            </button>
          ) : (
            <button
              onClick={onNavigateToAdmin}
              className="w-full bg-blue-600/80 hover:bg-blue-500/90 text-white py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 button-hover-effect glowing-border backdrop-blur-sm text-center"
            >
              Panel de Control
            </button>
          ))}

        {/* Botón de Logout */}
        <button
          onClick={onLogout}
          className="w-full bg-gray-600/80 hover:bg-gray-500/90 text-white py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 button-hover-effect backdrop-blur-sm text-center"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default MobileMenu;
