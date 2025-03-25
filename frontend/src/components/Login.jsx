import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
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

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleLogin}
        noValidate
        className="bg-gray-800 p-10 rounded-lg shadow-lg w-[28rem] transition duration-500"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">Iniciar Sesión</h1>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Usuario</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Iniciar Sesión
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;