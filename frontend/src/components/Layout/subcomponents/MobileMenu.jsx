import { NavLink } from "react-router-dom";

function MobileMenu({
  isOpen,
  isAdmin,
  isAdminPanel,
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
      <div className="flex flex-col items-center px-6 mt-10 w-full">
        <h2
          className={`text-xl font-bold mb-8 relative ${
            isOpen ? "menu-glitch-effect" : ""
          }`}
          data-text="MENU"
        >
          MENU
        </h2>

        <nav className="flex flex-col w-full space-y-5 items-center">
          {/* Enlaces de navegación */}
          <NavLink
            to="/home"
            onClick={onNavigateBack}
            className={({ isActive }) =>
              `py-3 px-4 transition-colors border-b-2 text-center w-full ${
                isActive || isHomePage
                  ? "text-blue-400 border-blue-500 bg-blue-900/20"
                  : "text-gray-300 hover:text-white border-transparent hover:border-blue-500/50 hover:bg-blue-900/10"
              }`
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/dashboard"
            onClick={onNavigateToDashboard}
            className={({ isActive }) =>
              `py-3 px-4 transition-colors border-b-2 text-center w-full ${
                isActive || isDashboard
                  ? "text-blue-400 border-blue-500 bg-blue-900/20"
                  : "text-gray-300 hover:text-white border-transparent hover:border-blue-500/50 hover:bg-blue-900/10"
              }`
            }
          >
            Dashboard
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={onNavigateToAdmin}
              className={({ isActive }) =>
                `py-3 px-4 transition-colors border-b-2 text-center w-full ${
                  isActive || isAdminPanel
                    ? "text-blue-400 border-blue-500 bg-blue-900/20"
                    : "text-gray-300 hover:text-white border-transparent hover:border-blue-500/50 hover:bg-blue-900/10"
                }`
              }
            >
              Panel Admin
            </NavLink>
          )}

          {/* Separador */}
          <div className="border-t border-blue-900/30 my-2 w-full"></div>

          {/* Botón de cerrar sesión */}
          <button
            onClick={onLogout}
            className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 rounded-md transition-colors mt-4 py-3 text-center w-full"
          >
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </div>
  );
}

export default MobileMenu;
