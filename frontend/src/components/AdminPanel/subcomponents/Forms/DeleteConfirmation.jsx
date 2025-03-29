import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import FormModal from "./FormModal";

function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
  isDeleting,
}) {
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const [trashAnimation, setTrashAnimation] = useState(false);
  const [confirmClicked, setConfirmClicked] = useState(false);

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.id = "delete-confirmation-styles";

    styleElement.innerHTML = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      
      .animate-shake {
        animation: shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
      }
      
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
        100% { transform: translateY(0px); }
      }
      
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      
      @keyframes pulse-red {
        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
        70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
      }
      
      .animate-pulse-red {
        animation: pulse-red 2s infinite;
      }
    `;

    document.head.appendChild(styleElement);

    return () => {
      const existingStyle = document.getElementById(
        "delete-confirmation-styles"
      );
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => setShakeAnimation(true), 200);
    } else {
      document.body.style.overflow = "auto";
      setShakeAnimation(false);
      setTrashAnimation(false);
      setConfirmClicked(false);
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (shakeAnimation) {
      const timer = setTimeout(() => {
        setShakeAnimation(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shakeAnimation]);

  const handleConfirmClick = () => {
    setConfirmClicked(true);
    setTrashAnimation(true);
    setTimeout(() => {
      onConfirm();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={isDeleting ? null : onClose}
      title={`Eliminar ${itemType}`}
      centerContent={true}
    >
      <div className="py-4 flex flex-col items-center">
        {/* Ícono animado */}
        <div
          className={`relative mb-8 transform transition-all duration-500 ${
            shakeAnimation ? "animate-shake" : "animate-float"
          } ${trashAnimation ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
        >
          <div className="relative">
            {/* Círculo de fondo */}
            <div
              className={`absolute inset-0 rounded-full bg-red-500/20 transform transition-all duration-500 animate-pulse-red ${
                confirmClicked ? "scale-[15] opacity-0" : "scale-100"
              }`}
            ></div>

            {/* Ícono de basurero */}
            <div
              className={`relative z-10 bg-red-500/20 p-6 rounded-full transform transition-all duration-300 ${
                confirmClicked ? "rotate-[360deg]" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-16 w-16 text-red-500 transform transition-all duration-500 ${
                  confirmClicked ? "scale-0 opacity-0" : "scale-100"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            {/* Papeles animados */}
            <div
              className={`absolute top-6 -left-4 w-3 h-4 bg-gray-100 rounded-sm origin-bottom transform transition-all duration-500 ${
                trashAnimation
                  ? "opacity-100 -translate-y-10 rotate-[-45deg]"
                  : "opacity-0"
              }`}
            ></div>
            <div
              className={`absolute top-8 left-4 w-4 h-5 bg-gray-200 rounded-sm origin-bottom transform transition-all duration-600 ${
                trashAnimation
                  ? "opacity-100 -translate-y-12 rotate-[-15deg]"
                  : "opacity-0"
              }`}
            ></div>
            <div
              className={`absolute top-6 right-2 w-4 h-5 bg-gray-300 rounded-sm origin-bottom transform transition-all duration-700 ${
                trashAnimation
                  ? "opacity-100 -translate-y-14 rotate-[25deg]"
                  : "opacity-0"
              }`}
            ></div>

            {/* Chispas para efecto visual */}
            <div
              className={`absolute -left-1 top-1/2 h-1.5 w-1.5 rounded-full bg-yellow-300 transition-all duration-300 ${
                trashAnimation
                  ? "opacity-100 -translate-x-8 -translate-y-8"
                  : "opacity-0"
              }`}
            ></div>
            <div
              className={`absolute -right-1 top-1/3 h-2 w-2 rounded-full bg-orange-400 transition-all duration-400 ${
                trashAnimation
                  ? "opacity-100 translate-x-10 -translate-y-6"
                  : "opacity-0"
              }`}
            ></div>
            <div
              className={`absolute left-1/2 -top-1 h-1.5 w-1.5 rounded-full bg-red-300 transition-all duration-500 ${
                trashAnimation ? "opacity-100 -translate-y-10" : "opacity-0"
              }`}
            ></div>
          </div>

          {/* Línea del suelo con animación */}
          <div
            className={`absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 h-[2px] bg-red-500 transition-all duration-500 ${
              confirmClicked ? "w-0" : "w-32"
            }`}
          ></div>
        </div>

        {/* Texto de confirmación */}
        <div className="text-center mb-6 transition-all duration-300">
          <h4 className="text-xl font-medium text-gray-200 mb-2">
            Confirmar eliminación
          </h4>
          <p className="text-gray-400 text-sm mb-4">
            Esta acción no se puede deshacer
          </p>

          <p className="mb-6 text-gray-300 text-lg">
            ¿Estás seguro que deseas eliminar
            <span className="text-red-400"> {itemType.toLowerCase()}</span>
            {itemName && (
              <span className="font-semibold text-yellow-300">
                {" "}
                "{itemName}"
              </span>
            )}
            ?
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="cursor-pointer px-5 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors transform hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-900/50 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
            disabled={isDeleting || confirmClicked}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmClick}
            className={`cursor-pointer px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-red-900/50 flex items-center space-x-2 ${
              confirmClicked ? "scale-95 opacity-90" : ""
            } disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none`}
            disabled={isDeleting || confirmClicked}
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Eliminar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </FormModal>
  );
}

export default DeleteConfirmation;
