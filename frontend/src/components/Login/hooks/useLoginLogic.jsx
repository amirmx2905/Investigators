import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

export const useLoginLogic = () => {
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

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMobile);
    };
  }, [currentUser, navigate]);

  const showError = (message) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      closeButton: false,
      style: {
        background: "linear-gradient(to right, #991b1b, #ef4444)",
        color: "white",
        borderRadius: "8px",
        boxShadow:
          "0 4px 12px rgba(239, 68, 68, 0.3), 0 6px 16px rgba(0, 0, 0, 0.4)",
        fontSize: "16px",
        padding: "12px 16px",
        minHeight: "60px",
        display: "flex",
        alignItems: "center",
        zIndex: 9999,
        pointerEvents: "none",
      },
      icon: () => (
        <div className="flex items-center justify-center w-8 h-8 error-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      ),
    });
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
    
    // Aquí está el cambio principal - usar nombre_usuario y contrasena en lugar de username y password
    const result = await login(username, password);

    if (result.success) {
      localStorage.removeItem("toastShown");
      setUsername("");
      setPassword("");
      navigate("/home", { state: { loginSuccess: true } });
    } else {
      showError(result.error || "Credenciales inválidas");
      setPassword("");
    }
    setIsLoading(false);
  };

  const tiltStyle = {
    transform: isMobile
      ? "none"
      : `perspective(1000px) 
              rotateX(${(mousePosition.y - 0.5) * 5}deg) 
              rotateY(${(mousePosition.x - 0.5) * 5}deg)`,
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    isLoading,
    handleLogin,
    mousePosition,
    formRef,
    isMobile,
    showError,
    triggerFieldError,
    tiltStyle,
  };
};