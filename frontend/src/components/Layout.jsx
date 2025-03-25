import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

function Layout({ children }) {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdminPanel = location.pathname === "/admin";
  const isHomePage = location.pathname === "/home";

  useEffect(() => {
    // Detectar si es dispositivo móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Animaciones para el layout
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
        50% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
        100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
      }
      
      @keyframes appearUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes gradientFlow {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      
      @keyframes subtleTextShadowPulse {
        0% {
          text-shadow: 0 0 2px rgba(59, 130, 246, 0.2), 0 0 5px rgba(147, 197, 253, 0.2);
        }
        50% {
          text-shadow: 0 0 4px rgba(59, 130, 246, 0.3), 0 0 10px rgba(147, 197, 253, 0.3);
        }
        100% {
          text-shadow: 0 0 2px rgba(59, 130, 246, 0.2), 0 0 5px rgba(147, 197, 253, 0.2);
        }
      }
      
      @keyframes energyPulse {
        0% {
          box-shadow: 0 0 0 0 rgba(147, 197, 253, 0);
          transform: scale(1);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(147, 197, 253, 0);
          transform: scale(1.05);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(147, 197, 253, 0);
          transform: scale(1);
        }
      }
      
      @keyframes glitchEffect {
        0% {
          clip-path: inset(30% 0 40% 0);
          transform: translate(-5px, 0);
        }
        20% {
          clip-path: inset(15% 0 60% 0);
          transform: translate(5px, 0);
        }
        40% {
          clip-path: inset(50% 0 20% 0);
          transform: translate(-5px, 0);
        }
        60% {
          clip-path: inset(30% 0 60% 0);
          transform: translate(5px, 0);
        }
        80% {
          clip-path: inset(10% 0 50% 0);
          transform: translate(-5px, 0);
        }
        100% {
          clip-path: inset(50% 0 30% 0);
          transform: translate(0, 0);
        }
      }
      
      @keyframes menuGlitch {
        0% {
          clip-path: inset(40% 0 60% 0);
          transform: translate(-2px, 0);
        }
        20% {
          clip-path: inset(25% 0 75% 0);
          transform: translate(2px, 0);
        }
        40% {
          clip-path: inset(33% 0 66% 0);
          transform: translate(-2px, 0);
        }
        60% {
          clip-path: inset(10% 0 90% 0);
          transform: translate(2px, 0);
        }
        80% {
          clip-path: inset(45% 0 55% 0);
          transform: translate(-2px, 0);
        }
        100% {
          clip-path: inset(50% 0 50% 0);
          transform: translate(0, 0);
        }
      }
      
      @keyframes neonFlicker {
        0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
          box-shadow: 0 0 0.5px #60a5fa, 0 0 2px #60a5fa, 0 0 5px #60a5fa;
        }
        20%, 24%, 55% {
          box-shadow: none;
        }
      }
      
      @keyframes scanline {
        0% {
          transform: translateY(-100%);
        }
        100% {
          transform: translateY(100%);
        }
      }
      
      .logo-animation {
        background: linear-gradient(90deg, #60a5fa, #a78bfa, #93c5fd, #60a5fa);
        background-size: 300% 100%;
        animation: gradientFlow 8s ease infinite, subtleTextShadowPulse 3s ease-in-out infinite;
        will-change: background-position, text-shadow;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        letter-spacing: 0.5px;
        position: relative;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 4px;
        transition: all 0.3s;
      }
      
      .logo-animation:hover {
        transform: scale(1.05);
        letter-spacing: 1px;
      }
      
      .logo-animation:hover::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(96, 165, 250, 0.1);
        border-radius: 4px;
        animation: energyPulse 1s infinite;
        z-index: -1;
      }
      
      .logo-animation:hover::after {
        content: 'Investigators';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #60a5fa, #a78bfa, #93c5fd, #60a5fa);
        background-size: 300% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: glitchEffect 0.5s infinite steps(2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        z-index: -1;
      }
      
      .cyber-grid {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: 50px 50px;
        background-image: 
          linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
        z-index: 0;
        transform: perspective(1000px) rotateX(60deg) scale(2.5) translateY(-10%);
        opacity: 0.3;
        will-change: opacity;
      }
      
      @media (max-width: 768px) {
        .cyber-grid {
          background-size: 30px 30px;
          transform: perspective(1000px) rotateX(60deg) scale(3) translateY(-5%);
        }
        
        .logo-animation:hover {
          transform: scale(1.02);
          letter-spacing: 0.7px;
        }
      }
      
      .glowing-border {
        animation: pulseGlow 4s infinite;
        will-change: box-shadow;
      }
      
      .appear-up {
        animation: appearUp 0.6s ease-out forwards;
      }
      
      .button-hover-effect {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .button-hover-effect:after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: all 0.6s ease;
      }
      
      .button-hover-effect:hover:after {
        left: 100%;
      }
      
      .header-animation {
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        transition: all 0.3s ease;
      }
      
      .header-animation:hover {
        border-bottom-color: rgba(59, 130, 246, 0.4);
      }
      
      .footer-animation {
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(59, 130, 246, 0.2);
        transition: all 0.3s ease;
      }
      
      .footer-animation:hover {
        border-top-color: rgba(59, 130, 246, 0.4);
      }
      
      .mobile-menu {
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        width: 75%;
        max-width: 300px;
        background: rgba(17, 24, 39, 0.95);
        backdrop-filter: blur(10px);
        z-index: 100;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        border-left: 1px solid rgba(59, 130, 246, 0.3);
        display: flex;
        flex-direction: column;
        padding-top: 5rem;
        box-shadow: -5px 0 15px rgba(37, 99, 235, 0.2);
        overflow: hidden;
      }
      
      .mobile-menu::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, #60a5fa, #a78bfa, #60a5fa);
        opacity: 0.8;
        animation: gradientFlow 4s linear infinite;
      }
      
      .mobile-menu::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, 
          rgba(37, 99, 235, 0.03) 0%, 
          rgba(37, 99, 235, 0) 50%, 
          rgba(37, 99, 235, 0.03) 100%);
        pointer-events: none;
      }
      
      .mobile-menu.open {
        transform: translateX(0);
      }
      
      .menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        z-index: 99;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      
      .menu-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }
      
      .hamburger-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 101;
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 8px;
        padding: 10px;
        margin-right: 6px;
        transition: all 0.3s ease;
        background: rgba(30, 64, 175, 0.1);
        width: 46px;
        height: 46px;
      }

      .hamburger-container:hover {
        background: rgba(30, 64, 175, 0.2);
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
      }

      .hamburger-container.open {
        background: rgba(30, 64, 175, 0.25);
        box-shadow: 0 0 12px rgba(59, 130, 246, 0.7);
        animation: neonFlicker 1.5s linear;
      }

      .hamburger {
        display: inline-flex;
        flex-direction: column;
        justify-content: space-between;
        height: 20px;
        width: 26px;
        transition: transform 0.3s ease;
      }
      
      .hamburger span {
        display: block;
        height: 2px;
        width: 100%;
        background: linear-gradient(90deg, #60a5fa, #93c5fd);
        border-radius: 1px;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        transform-origin: center;
      }
      
      .hamburger.open span {
        background: linear-gradient(90deg, #93c5fd, #a78bfa);
      }
      
      .hamburger.open span:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
      }
      
      .hamburger.open span:nth-child(2) {
        opacity: 0;
        transform: scale(0);
      }
      
      .hamburger.open span:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
      }
      
      .menu-glitch-effect {
        overflow: hidden;
        position: relative;
      }
      
      .menu-glitch-effect::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #60a5fa, #a78bfa, #93c5fd);
        background-size: 300% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: menuGlitch 3s infinite steps(2), gradientFlow 8s ease infinite;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.8;
      }
      
      /* Línea de escaneo para menú abierto */
      .scanline {
        position: absolute;
        width: 100%;
        height: 4px;
        background: linear-gradient(to right, 
          transparent, 
          rgba(59, 130, 246, 0.5), 
          transparent
        );
        opacity: 0.3;
        top: 0;
        left: 0;
        animation: scanline 3s linear infinite;
        pointer-events: none;
        z-index: 5;
      }
    `;
    document.head.appendChild(style);

    // Efecto para cerrar menú al redimensionar a desktop
    if (!isMobile && menuOpen) {
      setMenuOpen(false);
    }

    return () => {
      document.head.removeChild(style);
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
      {/* Rejilla de fondo cyber */}
      <div className="cyber-grid fixed inset-0"></div>

      {/* Partículas de luz estáticas - ajustadas para responsividad */}
      <div className="fixed top-0 left-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-600 rounded-full filter blur-[100px] sm:blur-[120px] md:blur-[150px] opacity-10"></div>
      <div className="fixed bottom-0 right-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-purple-600 rounded-full filter blur-[100px] sm:blur-[120px] md:blur-[150px] opacity-10"></div>
      <div className="fixed top-1/2 right-1/4 w-40 sm:w-56 md:w-64 h-40 sm:h-56 md:h-64 bg-indigo-600 rounded-full filter blur-[80px] sm:blur-[100px] md:blur-[120px] opacity-10"></div>
      <div className="fixed bottom-1/3 left-1/4 w-48 sm:w-64 md:w-72 h-48 sm:h-64 md:h-72 bg-cyan-600 rounded-full filter blur-[90px] sm:blur-[110px] md:blur-[130px] opacity-10"></div>

      {/* Overlay del menú móvil */}
      <div
        className={`menu-overlay ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      ></div>

      {/* Menú móvil estilizado */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {menuOpen && <div className="scanline"></div>}
        <div className="flex flex-col items-center space-y-8 px-6 mt-4">
          <h2
            className={`text-xl font-bold mb-6 relative ${
              menuOpen ? "menu-glitch-effect" : ""
            }`}
            data-text="MENU"
          >
            MENU
          </h2>

          {isAdmin() &&
            (isAdminPanel ? (
              <button
                onClick={navigateBack}
                className="w-full bg-blue-600/80 hover:bg-blue-500/90 text-white py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 button-hover-effect glowing-border backdrop-blur-sm text-center"
              >
                Regresar
              </button>
            ) : (
              <button
                onClick={navigateToAdmin}
                className="w-full bg-blue-600/80 hover:bg-blue-500/90 text-white py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 button-hover-effect glowing-border backdrop-blur-sm text-center"
              >
                Panel de Control
              </button>
            ))}

          {isHomePage && (
            <button
              onClick={handleLogout}
              className="w-full bg-gray-600/80 hover:bg-gray-500/90 text-white py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 button-hover-effect backdrop-blur-sm text-center"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>

      {/* Barra superior transparente */}
      <header className="relative z-20 bg-transparent py-3 sm:py-4 shadow-lg header-animation">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6">
          <h1
            className="text-xl sm:text-2xl font-bold logo-animation"
            onClick={navigateToHome}
            title="Ir a Home"
          >
            Investigators
          </h1>

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
              {isAdmin() &&
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

      {/* Contenido principal */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16 sm:pb-20 relative z-10">
        {children}
      </main>

      {/* Barra inferior transparente */}
      <footer className="relative z-20 bg-transparent py-4 sm:py-6 text-center footer-animation">
        <p className="text-sm sm:text-base text-blue-300/80">
          &copy; 2025 Investigators. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}

export default Layout;
