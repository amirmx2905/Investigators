import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

function Home() {
  const location = useLocation();
  const { currentUser } = useAuth();

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
    <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-160px)] animate-fade-in">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Bienvenido a la Página Principal
      </h1>
      <p className="text-lg mb-8 text-gray-400 text-center">
        Explora las funcionalidades de la aplicación.
      </p>
      
      {currentUser?.role === 'admin' && (
        <p className="mt-4 p-3 bg-blue-600 rounded-lg text-center">
          Tienes acceso a funciones administrativas a través del Panel de Control.
        </p>
      )}
      
      <ToastContainer />
    </div>
  );
}

export default Home;