import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("toastShown");
    navigate("/");
  };

  useEffect(() => {
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
  }, [location.state]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center animate-fade-in">
        Bienvenido a la Página Principal
      </h1>
      <p className="text-lg mb-8 text-gray-400 text-center">
        Explora las funcionalidades de la aplicación.
      </p>
      <button
        onClick={handleLogout}
        className="cursor-pointer bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition duration-300 transform hover:scale-105"
      >
        Cerrar Sesión
      </button>
      <ToastContainer />
    </div>
  );
}

export default Home;