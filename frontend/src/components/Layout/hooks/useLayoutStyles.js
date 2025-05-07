import { useEffect } from "react";

function useLayoutStyles() {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "layout-styles";

    style.innerHTML = `
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
        50% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
        100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
      }
      
      @keyframes scanline {
        0% {
          transform: translateY(-100%);
        }
        100% {
          transform: translateY(100%);
        }
      }
      
      /* Estilo para el favicon SVG en el header */
      .logo-animation-svg {
        filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.5));
        transition: all 0.3s ease;
      }
      
      .logo-animation-svg:hover {
        filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.8));
        transform: scale(1.05) rotate(5deg);
      }
      
      /* Estilos para la rejilla de fondo */
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
      }
      
      .glowing-border {
        animation: pulseGlow 4s infinite;
        will-change: box-shadow;
      }
      
      /* Estilos para los botones */
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
      
      /* Estilos para el header y footer */
      .header-animation {
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        transition: all 0.3s ease;
      }
      
      .footer-animation {
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(59, 130, 246, 0.2);
        transition: all 0.3s ease;
      }
      
      /* Estilos para el menú móvil */
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
      
      /* Estilos para el botón hamburguesa */
      .hamburger-menu {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 36px;
        height: 30px;
        cursor: pointer;
        z-index: 110;
        position: relative;
        padding: 5px;
        border-radius: 6px;
        background: rgba(30, 64, 175, 0.15);
        border: 1px solid rgba(59, 130, 246, 0.4);
        transition: all 0.3s ease;
        margin-right: 8px;
      }
      
      .hamburger-menu:hover {
        background: rgba(30, 64, 175, 0.25);
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
      }
      
      .hamburger-menu.open {
        background: rgba(30, 64, 175, 0.3);
        box-shadow: 0 0 12px rgba(59, 130, 246, 0.8);
      }
      
      .hamburger-menu span {
        display: block;
        height: 3px;
        width: 100%;
        background: linear-gradient(90deg, #60a5fa, #93c5fd);
        border-radius: 3px;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
      }
      
      .hamburger-menu.open span:first-child {
        transform: translateY(9px) rotate(45deg);
      }
      
      .hamburger-menu.open span:nth-child(2) {
        opacity: 0;
        transform: scale(0);
      }
      
      .hamburger-menu.open span:last-child {
        transform: translateY(-9px) rotate(-45deg);
      }
      
      /* Efecto de escaneo para el menú */
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

    return () => {
      if (document.getElementById("layout-styles")) {
        document.head.removeChild(style);
      }
    };
  }, []);
}

export default useLayoutStyles;
