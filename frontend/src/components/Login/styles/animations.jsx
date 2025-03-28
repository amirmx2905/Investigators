import { useEffect } from "react";

export const useLoginAnimations = () => {
  useEffect(() => {
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
        opacity: 0.4;
        animation: gridPulse 15s ease infinite;
        will-change: opacity;
      }
      
      @media (max-width: 768px) {
        .cyber-grid {
          background-size: 30px 30px;
          transform: perspective(1000px) rotateX(60deg) scale(3) translateY(-5%);
        }
      }
      
      @keyframes gridPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.5; }
      }
      
      @keyframes floatLT {
        0% { transform: translate(0, 0); }
        25% { transform: translate(-100px, 0); }
        50% { transform: translate(-100px, -100px); }
        75% { transform: translate(0, -100px); }
        100% { transform: translate(0, 0); }
      }
      
      @keyframes floatRT {
        0% { transform: translate(0, 0); }
        25% { transform: translate(100px, 0); }
        50% { transform: translate(100px, -100px); }
        75% { transform: translate(0, -100px); }
        100% { transform: translate(0, 0); }
      }
      
      @keyframes floatLB {
        0% { transform: translate(0, 0); }
        25% { transform: translate(-100px, 0); }
        50% { transform: translate(-100px, 100px); }
        75% { transform: translate(0, 100px); }
        100% { transform: translate(0, 0); }
      }
      
      @keyframes floatRB {
        0% { transform: translate(0, 0); }
        25% { transform: translate(100px, 0); }
        50% { transform: translate(100px, 100px); }
        75% { transform: translate(0, 100px); }
        100% { transform: translate(0, 0); }
      }
      
      @keyframes floatCircle {
        0% { transform: translate(0, 0); }
        25% { transform: translate(70px, 70px); }
        50% { transform: translate(0, 100px); }
        75% { transform: translate(-70px, 70px); }
        100% { transform: translate(0, 0); }
      }
      
      @keyframes floatZigZag {
        0% { transform: translate(0, 0); }
        20% { transform: translate(50px, 50px); }
        40% { transform: translate(-50px, 100px); }
        60% { transform: translate(50px, 150px); }
        80% { transform: translate(-50px, 200px); }
        100% { transform: translate(0, 0); }
      }
      
      @keyframes floatDiagonal {
        0% { transform: translate(0, 0); }
        50% { transform: translate(100px, 100px); }
        100% { transform: translate(0, 0); }
      }
      
      @keyframes floatDiagonal2 {
        0% { transform: translate(0, 0); }
        50% { transform: translate(-100px, 100px); }
        100% { transform: translate(0, 0); }
      }
      
      @media (max-width: 768px) {
        @keyframes floatLT {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-50px, 0); }
          50% { transform: translate(-50px, -50px); }
          75% { transform: translate(0, -50px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes floatRT {
          0% { transform: translate(0, 0); }
          25% { transform: translate(50px, 0); }
          50% { transform: translate(50px, -50px); }
          75% { transform: translate(0, -50px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes floatLB {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-50px, 0); }
          50% { transform: translate(-50px, 50px); }
          75% { transform: translate(0, 50px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes floatRB {
          0% { transform: translate(0, 0); }
          25% { transform: translate(50px, 0); }
          50% { transform: translate(50px, 50px); }
          75% { transform: translate(0, 50px); }
          100% { transform: translate(0, 0); }
        }
      }
      
      .glowing-border {
        animation: pulseGlow 4s infinite;
        will-change: box-shadow;
      }
      
      .appear-up {
        animation: appearUp 0.6s ease-out forwards;
      }
      
      .button-loading .dots span {
        animation: loadingDots 1.4s infinite ease-in-out both;
      }
      
      .button-loading .dots span:nth-child(1) { animation-delay: 0s; }
      .button-loading .dots span:nth-child(2) { animation-delay: 0.2s; }
      .button-loading .dots span:nth-child(3) { animation-delay: 0.4s; }
      
      @keyframes loadingDots {
        0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
      }
      
      .field-animation {
        transition: transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      
      .field-animation:focus {
        transform: scale(1.01);
      }
      
      @media (max-width: 768px) {
        .field-animation:focus {
          transform: scale(1.005);
        }
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
      
      .particle {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.15;
        transition: opacity 0.5s ease;
        will-change: transform;
      }
      
      .small-particle {
        position: absolute;
        border-radius: 50%;
        filter: blur(10px);
        opacity: 0.12;
        transition: opacity 0.5s ease;
        will-change: transform;
      }
      
      .tiny-particle {
        position: absolute;
        border-radius: 50%;
        filter: blur(5px);
        opacity: 0.08;
        transition: opacity 0.5s ease;
        will-change: transform;
      }
      
      .float-lt { animation: floatLT 25s infinite ease-in-out; }
      .float-rt { animation: floatRT 28s infinite ease-in-out; }
      .float-lb { animation: floatLB 26s infinite ease-in-out; }
      .float-rb { animation: floatRB 30s infinite ease-in-out; }
      .float-circle { animation: floatCircle 32s infinite ease-in-out; }
      .float-zigzag { animation: floatZigZag 35s infinite ease-in-out; }
      .float-diagonal { animation: floatDiagonal 22s infinite ease-in-out; }
      .float-diagonal2 { animation: floatDiagonal2 24s infinite ease-in-out; }
      
      .error {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        border-color: #ef4444 !important;
      }
      
      @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
      }
      
      /* Estilos para los toast containers */
      .Toastify__toast-container {
        z-index: 99999 !important;
        position: fixed !important;
      }
      
      .Toastify__toast {
        background: linear-gradient(to right, #1e40af, #3b82f6) !important;
        color: white !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3), 0 6px 16px rgba(0, 0, 0, 0.4) !important;
        padding: 12px 16px !important;
        min-height: 60px !important;
        font-size: 16px !important;
        font-weight: 500 !important;
        margin-bottom: 12px !important;
        pointer-events: none !important; /* Asegurar que no se puedan interactuar con los toasts */
      }
      
      /* Estilos para la barra de progreso */
      .Toastify__progress-bar {
        background: linear-gradient(to right, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.7)) !important;
        height: 3px !important;
        bottom: 0 !important;
        opacity: 0.6 !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
      }
      
      .Toastify__toast--error {
        background: linear-gradient(to right, #991b1b, #ef4444) !important;
      }
      
      /* Ocultar botón de cierre */
      .Toastify__close-button {
        display: none !important;
      }
      
      /* Animación para el icono de check */
      @keyframes checkmark {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      
      .check-icon {
        animation: checkmark 0.5s ease-in-out forwards;
      }
      
      /* Animación para el icono de error */
      @keyframes errormark {
        0% { transform: scale(0) rotate(0deg); opacity: 0; }
        50% { transform: scale(1.2) rotate(8deg); opacity: 1; }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      
      .error-icon {
        animation: errormark 0.5s ease-in-out forwards;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
};
