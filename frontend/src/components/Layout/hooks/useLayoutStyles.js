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
