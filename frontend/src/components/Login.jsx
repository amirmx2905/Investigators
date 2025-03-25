import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (currentUser) {
      navigate("/home");
    }

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
    `;
    document.head.appendChild(style);

    let lastTime = 0;
    const handleMouseMove = (e) => {
      if (window.innerWidth < 768) return;

      const now = Date.now();
      if (now - lastTime < 16) return;
      lastTime = now;

      if (formRef.current) {
        const rect = formRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        setMousePosition({
          x: 0.5 + (x - 0.5) * 0.1,
          y: 0.5 + (y - 0.5) * 0.1,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", checkMobile);

    return () => {
      document.head.removeChild(style);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMobile);
    };
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (!username) {
      isValid = false;
      triggerFieldError("username");
    }

    if (!password) {
      isValid = false;
      triggerFieldError("password");
    }

    if (!isValid) return;

    setIsLoading(true);
    const result = await login(username, password);

    if (result.success) {
      localStorage.removeItem("toastShown");
      setUsername("");
      setPassword("");
      navigate("/home", { state: { loginSuccess: true } });
    } else {
      toast.error("Credenciales inválidas", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        closeButton: false,
      });
      setPassword("");
      setUsername("");
    }
    setIsLoading(false);
  };

  const triggerFieldError = (fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.add("error");
      setTimeout(() => {
        field.classList.remove("error");
      }, 1000);
    }
  };

  const tiltStyle = {
    transform: isMobile
      ? "none"
      : `perspective(1000px) 
              rotateX(${(mousePosition.y - 0.5) * 5}deg) 
              rotateY(${(mousePosition.x - 0.5) * 5}deg)`,
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white relative overflow-hidden px-4 py-8">
      {/* Rejilla de fondo cyber */}
      <div className="cyber-grid"></div>

      {/* Partículas grandes - reducidas para mejorar rendimiento */}
      <div className="particle float-lt md:w-96 md:h-96 w-64 h-64 bg-blue-600 top-10 left-10"></div>
      <div className="particle float-rt md:w-80 md:h-80 w-56 h-56 bg-indigo-600 top-10 right-10"></div>
      <div className="particle float-rb md:w-72 md:h-72 w-48 h-48 bg-purple-600 bottom-10 right-10"></div>
      <div className="particle float-lb md:w-64 md:h-64 w-40 h-40 bg-cyan-600 bottom-10 left-10"></div>

      {/* Partículas medianas - Mostrar en todos los dispositivos */}
      <div className="small-particle float-zigzag md:w-32 md:h-32 w-20 h-20 bg-blue-400 top-1/3 left-1/5"></div>
      <div className="small-particle float-diagonal md:w-28 md:h-28 w-16 h-16 bg-indigo-400 bottom-1/3 right-1/5"></div>

      {/* Partículas pequeñas - Mostrar en todos los dispositivos */}
      <div className="tiny-particle float-circle md:w-16 md:h-16 w-8 h-8 bg-blue-300 top-1/6 left-1/6"></div>
      <div className="tiny-particle float-diagonal md:w-12 md:h-12 w-6 h-6 bg-indigo-300 bottom-1/6 right-1/6"></div>
      <div className="tiny-particle float-diagonal2 md:w-14 md:h-14 w-8 h-8 bg-purple-300 top-2/3 right-1/5"></div>
      <div className="tiny-particle float-circle md:w-10 md:h-10 w-6 h-6 bg-cyan-300 bottom-2/3 left-1/5"></div>

      <div ref={formRef} className="relative z-10" style={tiltStyle}>
        <form
          onSubmit={handleLogin}
          noValidate
          className="bg-gray-800/80 backdrop-blur-md p-6 md:p-10 rounded-lg shadow-2xl w-full sm:w-[400px] md:w-[450px] transition duration-500 glowing-border border border-blue-500/30"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 appear-up">
            Investigators
          </h1>

          <div
            className="mb-5 md:mb-6 appear-up"
            style={{ animationDelay: "0.1s" }}
          >
            <label className="block text-sm font-medium mb-2 text-blue-300">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 field-animation"
              style={{ backdropFilter: "blur(4px)" }}
            />
          </div>

          <div
            className="mb-6 md:mb-8 appear-up"
            style={{ animationDelay: "0.2s" }}
          >
            <label className="block text-sm font-medium mb-2 text-blue-300">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 field-animation"
              style={{ backdropFilter: "blur(4px)" }}
            />
          </div>

          <div className="appear-up" style={{ animationDelay: "0.3s" }}>
            <button
              type="submit"
              disabled={isLoading}
              className={`cursor-pointer w-full bg-blue-600 text-white py-2.5 md:py-3 rounded-lg hover:bg-blue-700 transform hover:scale-105 shadow-lg button-hover-effect h-11 md:h-12 flex items-center justify-center ${
                isLoading ? "button-loading opacity-90" : ""
              }`}
            >
              {isLoading ? (
                <div className="dots flex justify-center">
                  <span className="w-2 h-2 mx-1 bg-white rounded-full inline-block"></span>
                  <span className="w-2 h-2 mx-1 bg-white rounded-full inline-block"></span>
                  <span className="w-2 h-2 mx-1 bg-white rounded-full inline-block"></span>
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;
