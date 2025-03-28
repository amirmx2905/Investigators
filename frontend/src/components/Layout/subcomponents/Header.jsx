import { Link } from "react-router-dom";

function Header({
  isMobile,
  menuOpen,
  toggleMenu,
  navigateToHome,
  isAdmin,
  isAdminPanel,
  isHomePage,
  handleLogout
}) {
  return (
    <header className="relative bg-transparent py-3 sm:py-4 shadow-lg header-animation">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6">
        {/* Logo */}
        <h1
          className="text-xl sm:text-2xl font-bold logo-animation"
          onClick={navigateToHome}
          title="Ir a Home"
        >
          Investigators
        </h1>

        {/* Menú para dispositivos móviles o escritorio */}
        {isMobile ? (
          <div
            className={`hamburger-container ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
          >
            <div className={`hamburger ${menuOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            {isAdmin &&
              (isAdminPanel ? (
                <Link
                  to="/home"
                  className="bg-blue-600/80 hover:bg-blue-500/90 text-white py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 button-hover-effect glowing-border backdrop-blur-sm"
                >
                  Regresar
                </Link>
              ) : (
                <Link
                  to="/admin"
                  className="bg-blue-600/80 hover:bg-blue-500/90 text-white py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 button-hover-effect glowing-border backdrop-blur-sm"
                >
                  Panel de Control
                </Link>
              ))}

            {/* Mostrar el botón de cerrar sesión solo en la página home */}
            {isHomePage && (
              <button
                onClick={handleLogout}
                className="cursor-pointer bg-gray-600/80 hover:bg-gray-500/90 text-white py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 button-hover-effect backdrop-blur-sm"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;