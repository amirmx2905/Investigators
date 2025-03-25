import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout({ children }) {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determinar en qué página estamos actualmente
  const isAdminPanel = location.pathname === "/admin";
  const isHomePage = location.pathname === "/home";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Barra superior */}
      <header className="bg-gray-800 py-4 shadow-lg top-0 left-0 w-full z-10">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">Investigators</h1>
          <div className="flex items-center space-x-4">
            {isAdmin() && (
              isAdminPanel ? (
                <Link
                  to="/home"
                  className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300 transform hover:scale-105"
                >
                  Regresar
                </Link>
              ) : (
                <Link
                  to="/admin"
                  className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300 transform hover:scale-105"
                >
                  Panel de Control
                </Link>
              )
            )}
            
            {/* Mostrar el botón de cerrar sesión solo en la página home */}
            {isHomePage && (
              <button
                onClick={handleLogout}
                className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-300 transform hover:scale-105"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow container mx-auto px-6 pt-8 pb-20">
        {children}
      </main>

      {/* Barra inferior */}
      <footer className="bg-gray-800 py-6 text-center bottom-0 left-0 w-full">
        <p className="text-base text-gray-400">
          &copy; 2025 Investigators. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}

export default Layout;