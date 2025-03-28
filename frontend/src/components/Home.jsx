import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Home() {
  const location = useLocation();
  const navigate = useNavigate(); 
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

    // Controlamos la animación de entrada con un pequeño delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Si llegamos desde login, limpiamos el estado para evitar comportamientos no deseados
    if (location.state?.loginSuccess) {
      navigate("/home", { replace: true, state: {} });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, [location.state, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4 py-6 md:px-8 md:py-10">
      {/* Título principal con efecto de aparición */}
      <h1 
        className={`
          text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-center
          transition-all duration-700 ease-out transform
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
        `} 
        style={{transitionDelay: '100ms'}}
      >
        <span className=" p-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 
                        hover:bg-gradient-to-l hover:scale-105 inline-block transition-all duration-300">
          Bienvenido a Investigators
        </span>
      </h1>
      
      {/* Descripción con efecto de aparición retrasado */}
      <p 
        className={`
          text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-12 text-gray-300 text-center 
          max-w-xs sm:max-w-xl md:max-w-3xl 
          transition-all duration-700 ease-out transform
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
        `} 
        style={{transitionDelay: '300ms'}}
      >
        El sistema de investigación con tecnología avanzada para analizar y gestionar casos.
      </p>
      
      {/* Grid de características con efecto de aparición */}
      <div 
        className={`
          grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full 
          max-w-xs sm:max-w-2xl md:max-w-4xl 
          transition-all duration-700 ease-out transform
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
        `}
        style={{transitionDelay: '500ms'}}
      >
        {/* Tarjeta de Análisis de datos */}
        <div className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg 
                       hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300 
                       border border-blue-500/20 hover:border-blue-500/40
                       hover:-translate-y-1">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-blue-300">Análisis de datos</h3>
          <p className="text-sm sm:text-base text-gray-300">
            Explora información y obtén insights mediante nuestras herramientas avanzadas de análisis.
          </p>
        </div>
        
        {/* Tarjeta de Gestión de casos */}
        <div className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg 
                       hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300 
                       border border-blue-500/20 hover:border-blue-500/40
                       hover:-translate-y-1">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-blue-300">Gestión de casos</h3>
          <p className="text-sm sm:text-base text-gray-300">
            Administra tus investigaciones de forma eficiente con nuestra plataforma integrada.
          </p>
        </div>
      </div>
      
      {/* Panel de administrador condicional */}
      {currentUser?.role === 'admin' && (
        <div 
          className={`
            mt-6 sm:mt-8 md:mt-10 p-4 sm:p-5 md:p-6 rounded-lg w-full 
            max-w-xs sm:max-w-2xl md:max-w-4xl 
            bg-blue-900/20 backdrop-blur-sm border border-blue-500/30 hover:border-blue-500/50
            transition-all duration-700 ease-out transform hover:shadow-lg
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
          `} 
          style={{transitionDelay: '700ms'}}
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
    </div>
  );
}

export default Home;