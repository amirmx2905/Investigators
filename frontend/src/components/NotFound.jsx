import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const requestRef = useRef();
  const previousTimeRef = useRef();
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current && !isMobile) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        setMousePosition(prev => ({
          x: prev.x + (x - prev.x) * 0.1,
          y: prev.y + (y - prev.y) * 0.1
        }));
      }
    };
    
    let throttleTimeout;
    const throttledMouseMove = (e) => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          throttleTimeout = null;
          handleMouseMove(e);
        }, 16); 
      }
    };
    
    window.addEventListener('mousemove', throttledMouseMove);
    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      clearTimeout(throttleTimeout);
    };
  }, [isMobile]);

  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      setMousePosition(prev => ({
        x: prev.x,
        y: prev.y
      }));
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes textShadowPulse {
        0% {
          text-shadow: 0 0 4px rgba(37, 99, 235, 0.5), 0 0 10px rgba(37, 99, 235, 0.5);
          transform: translateY(0px) scale(1);
        }
        50% {
          text-shadow: 0 0 20px rgba(37, 99, 235, 0.8), 0 0 40px rgba(37, 99, 235, 0.6);
          transform: translateY(-10px) scale(1.05);
        }
        100% {
          text-shadow: 0 0 4px rgba(37, 99, 235, 0.5), 0 0 10px rgba(37, 99, 235, 0.5);
          transform: translateY(0px) scale(1);
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translate3d(0, 40px, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }

      .error-code {
        animation: textShadowPulse 3s ease-in-out infinite;
        position: relative;
        z-index: 2;
        will-change: transform, text-shadow;
      }
      
      .fade-in-up {
        animation: fadeInUp 1s ease-out forwards;
        will-change: opacity, transform;
      }
      
      .glitch {
        position: relative;
        isolation: isolate;
        will-change: transform;
      }
      
      .glitch::before,
      .glitch::after {
        content: "404";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        mix-blend-mode: screen;
        will-change: clip-path;
      }
      
      .glitch::before {
        left: 2px;
        text-shadow: -2px 0 #00ffea;
        animation: glitch-anim-1 4s steps(2) infinite alternate-reverse;
      }
      
      .glitch::after {
        left: -2px;
        text-shadow: 3px 0 #ff00c1;
        animation: glitch-anim-2 4.5s steps(2) infinite alternate-reverse;
      }
      
      @keyframes glitch-anim-1 {
        0%, 100% { clip-path: inset(40% 0 40% 0); }
        20% { clip-path: inset(20% 0 60% 0); }
        40% { clip-path: inset(60% 0 20% 0); }
        60% { clip-path: inset(30% 0 30% 0); }
        80% { clip-path: inset(10% 0 50% 0); }
      }
      
      @keyframes glitch-anim-2 {
        0%, 100% { clip-path: inset(70% 0 10% 0); }
        20% { clip-path: inset(10% 0 70% 0); }
        40% { clip-path: inset(50% 0 50% 0); }
        60% { clip-path: inset(40% 0 30% 0); }
        80% { clip-path: inset(30% 0 60% 0); }
      }

      .button-glow {
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        transition: all 0.3s ease;
        will-change: transform, box-shadow;
      }
      
      .button-glow:hover {
        box-shadow: 0 0 30px rgba(59, 130, 246, 0.8);
      }

      .tilt-element {
        transition: transform 0.15s ease-out;
        transform-style: preserve-3d;
        will-change: transform;
      }
      
      .cyber-grid {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: 50px 50px;
        background-image: 
          linear-gradient(to right, rgba(59, 130, 246, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
        z-index: 0;
        transform: perspective(1000px) rotateX(60deg) scale(2.5) translateY(-20%);
        opacity: 0.3;
      }
      
      @media (max-width: 768px) {
        .cyber-grid {
          background-size: 30px 30px;
          transform: perspective(1000px) rotateX(60deg) scale(3) translateY(-20%);
        }
        
        .error-code {
          animation: textShadowPulse 4s ease-in-out infinite;
        }
        
        .glitch::before {
          animation-duration: 3s;
        }
        
        .glitch::after {
          animation-duration: 3.5s;
        }
      }
      
      @media (max-width: 480px) {
        .cyber-grid {
          background-size: 20px 20px;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const tiltStyle = {
    transform: !isMobile 
      ? `perspective(1000px) 
         rotateX(${(mousePosition.y - 0.5) * 8}deg) 
         rotateY(${(mousePosition.x - 0.5) * -8}deg)`
      : 'none'
  };

  const textTiltStyle = {
    transform: !isMobile
      ? `perspective(1000px) 
         rotateX(${(mousePosition.y - 0.5) * 16}deg) 
         rotateY(${(mousePosition.x - 0.5) * -16}deg)`
      : 'none'
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4 py-8 overflow-hidden relative"
    >
      {/* Rejilla de fondo sutil */}
      <div className="cyber-grid"></div>
      
      {/* Contenido principal con efecto 3D */}
      <div 
        className="text-center relative z-10 tilt-element"
        style={tiltStyle}
      >
        <div style={textTiltStyle}>
          <h1 className="text-[100px] sm:text-[140px] md:text-[180px] font-bold text-blue-600 glitch error-code mb-2" style={{lineHeight: '1'}}>404</h1>
        </div>
        
        <div className="fade-in-up mt-2 sm:mt-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Página no encontrada
          </h2>
          <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-10 max-w-xs sm:max-w-md md:max-w-lg mx-auto">
            La página que buscas no existe o ha sido transportada a otra dimensión.
          </p>
          <Link
            to="/home"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition duration-300 transform hover:scale-110 button-glow text-sm sm:text-base"
          >
            Regresar al origen
          </Link>
        </div>
      </div>
      
      {/* Círculos brillantes en las esquinas (mantenidos para dar profundidad) */}
      <div className="absolute top-0 left-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-600 rounded-full filter blur-[80px] sm:blur-[120px] md:blur-[150px] opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-purple-600 rounded-full filter blur-[80px] sm:blur-[120px] md:blur-[150px] opacity-10"></div>
      <div className="absolute bottom-1/3 left-1/3 w-40 sm:w-56 md:w-64 h-40 sm:h-56 md:h-64 bg-indigo-600 rounded-full filter blur-[60px] sm:blur-[90px] md:blur-[120px] opacity-10 hidden sm:block"></div>
    </div>
  );
}

export default NotFound;