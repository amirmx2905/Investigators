import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

import Header from "./subcomponents/Header";
import Footer from "./subcomponents/Footer";
import MobileMenu from "./subcomponents/MobileMenu";
import Backdrop from "./subcomponents/Backdrop";
import MenuOverlay from "./subcomponents/MenuOverlay";

import useLayoutStyles from "./hooks/useLayoutStyles";

function Layout({ children }) {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdminPanel = location.pathname === "/admin";
  const isHomePage = location.pathname === "/home";
  const isDashboard = location.pathname === "/dashboard";

  useLayoutStyles();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (!isMobile && menuOpen) {
      setMenuOpen(false);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [isMobile, menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  const navigateToHome = () => {
    if (location.pathname !== "/home") {
      navigate("/home");
    }
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  const navigateToAdmin = () => {
    navigate("/admin");
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  const navigateToDashboard = () => {
    navigate("/dashboard");
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  const navigateBack = () => {
    navigate("/home");
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white relative overflow-hidden">
      {/* Elementos de fondo */}
      <Backdrop />

      {/* Overlay del menú móvil */}
      <MenuOverlay isOpen={menuOpen} onClose={toggleMenu} />

      {/* Menú móvil */}
      <MobileMenu
        isOpen={menuOpen}
        isAdmin={isAdmin()}
        isAdminPanel={isAdminPanel}
        isHomePage={isHomePage}
        isDashboard={isDashboard}
        onLogout={handleLogout}
        onNavigateToAdmin={navigateToAdmin}
        onNavigateBack={navigateBack}
        onNavigateToDashboard={navigateToDashboard}
      />

      {/* Barra superior */}
      <Header
        isMobile={isMobile}
        menuOpen={menuOpen}
        toggleMenu={toggleMenu}
        navigateToHome={navigateToHome}
        navigateToDashboard={navigateToDashboard}
        isAdmin={isAdmin()}
        isAdminPanel={isAdminPanel}
        isHomePage={isHomePage}
        isDashboard={isDashboard}
        handleLogout={handleLogout}
      />

      {/* Contenido principal */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16 sm:pb-20 relative z-10">
        {children}
      </main>

      {/* Pie de página */}
      <Footer />
    </div>
  );
}

export default Layout;
