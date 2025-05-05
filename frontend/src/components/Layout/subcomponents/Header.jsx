/* eslint-disable no-unused-vars */
import { NavLink } from "react-router-dom";

function Header({
  isMobile,
  menuOpen,
  toggleMenu,
  navigateToHome,
  isAdmin,
  handleLogout,
}) {
  const navLinkClass = ({ isActive }) =>
    `py-2 px-3 transition-colors ${
      isActive
        ? "text-blue-400 border-b-2 border-blue-500"
        : "text-gray-300 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-blue-900/50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo con imagen de favicon */}
        <div
          className="flex items-center cursor-pointer"
          onClick={navigateToHome}
          title="Ir a Home"
        >
          <img
            src="/favicon.svg"
            alt="Investigators Logo"
            className="h-8 sm:h-9 mr-2 logo-animation-svg"
          />
        </div>

        {/* Menú para dispositivos móviles o escritorio */}
        {isMobile ? (
          <div
            className={`hamburger-menu ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <div className="flex items-center">
            {/* Navegación principal */}
            <nav className="hidden md:flex space-x-6">
              <NavLink to="/home" className={navLinkClass}>
                Inicio
              </NavLink>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass}>
                  Panel Admin
                </NavLink>
              )}
            </nav>

            {/* Botón de cerrar sesión siempre visible */}
            <button
              onClick={handleLogout}
              className="cursor-pointer ml-6 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
