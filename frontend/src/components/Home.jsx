import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

function Home() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const toastShown = localStorage.getItem("toastShown");
    if (location.state?.loginSuccess && !toastShown) {
      toast.success("Inicio de sesión exitoso", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        closeButton: false,
      });
      localStorage.setItem("toastShown", "true");
    }

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes textShadowPulse {
        0% {
          text-shadow: 0 0 4px rgba(37, 99, 235, 0.5), 0 0 10px rgba(37, 99, 235, 0.3);
        }
        50% {
          text-shadow: 0 0 10px rgba(37, 99, 235, 0.7), 0 0 20px rgba(37, 99, 235, 0.5);
        }
        100% {
          text-shadow: 0 0 4px rgba(37, 99, 235, 0.5), 0 0 10px rgba(37, 99, 235, 0.3);
        }
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
      
      @keyframes appearRight {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      .glow-text {
        animation: textShadowPulse 3s ease-in-out infinite;
      }
      
      .appear-up {
        opacity: 0;
        transform: translateY(20px);
        animation: appearUp 0.8s ease-out forwards;
      }
      
      .appear-right {
        opacity: 0;
        transform: translateX(-20px);
        animation: appearRight 0.8s ease-out forwards;
      }
      
      .card-glow {
        box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
        transition: box-shadow 0.3s ease;
      }
      
      .card-glow:hover {
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
      }
      
      .admin-panel {
        background: linear-gradient(135deg, rgba(30, 64, 175, 0.2) 0%, rgba(30, 64, 175, 0.1) 100%);
        backdrop-filter: blur(4px);
        border: 1px solid rgba(59, 130, 246, 0.3);
      }
      
      /* Responsive adjustments */
      @media (max-width: 768px) {
        .glow-text {
          animation: textShadowPulse 3s ease-in-out infinite;
          text-shadow-intensity: 0.7; /* Reduce intensity on mobile */
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      clearTimeout(timer);
      document.head.removeChild(style);
      window.removeEventListener('resize', checkMobile);
    };
  }, [location.state]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4 py-6 md:px-8 md:py-10">
      <h1 
        className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-center glow-text ${isVisible ? 'appear-up' : 'opacity-0'}`} 
        style={{animationDelay: '0.1s'}}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Bienvenido a Investigators
        </span>
      </h1>
      
      <p 
        className={`text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-12 text-gray-300 text-center max-w-xs sm:max-w-xl md:max-w-3xl ${isVisible ? 'appear-up' : 'opacity-0'}`} 
        style={{animationDelay: '0.3s'}}
      >
        El sistema de investigación con tecnología avanzada para analizar y gestionar casos.
      </p>
      
      <div 
        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-xs sm:max-w-2xl md:max-w-4xl ${isVisible ? 'appear-up' : 'opacity-0'}`}
        style={{animationDelay: '0.5s'}}
      >
        <div className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg card-glow border border-blue-500/20">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-blue-300">Análisis de datos</h3>
          <p className="text-sm sm:text-base text-gray-300">
            Explora información y obtén insights mediante nuestras herramientas avanzadas de análisis.
          </p>
        </div>
        
        <div className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg card-glow border border-blue-500/20">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-blue-300">Gestión de casos</h3>
          <p className="text-sm sm:text-base text-gray-300">
            Administra tus investigaciones de forma eficiente con nuestra plataforma integrada.
          </p>
        </div>
      </div>
      
      {currentUser?.role === 'admin' && (
        <div 
          className={`mt-6 sm:mt-8 md:mt-10 p-4 sm:p-5 md:p-6 rounded-lg admin-panel w-full max-w-xs sm:max-w-2xl md:max-w-4xl ${isVisible ? 'appear-up' : 'opacity-0'}`} 
          style={{animationDelay: '0.7s'}}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-blue-300">Acceso Administrativo</h2>
          <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
            Como administrador, tienes acceso a funciones avanzadas a través del Panel de Control.
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-1 sm:space-y-2 text-sm sm:text-base">
            <li>Gestión de usuarios y permisos</li>
            <li>Configuración del sistema</li>
            <li>Auditoría de actividades</li>
            <li>Informes avanzados</li>
          </ul>
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
}

export default Home;