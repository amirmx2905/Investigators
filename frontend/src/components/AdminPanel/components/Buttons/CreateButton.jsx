import React from "react";

const CreateButton = ({ activeTab, onClick }) => {
  let type = "";
  let label = "";

  switch (activeTab) {
    case "usuarios":
      type = "usuario";
      label = "Usuario";
      break;
    case "investigadores":
      type = "investigador";
      label = "Investigador";
      break;
    case "proyectos":
      type = "proyecto";
      label = "Proyecto";
      break;
    case "estudiantes":
      type = "estudiante";
      label = "Estudiante";
      break;
    case "articulos":
      type = "articulo";
      label = "Artículo";
      break;
    case "eventos":
      type = "evento";
      label = "Evento";
      break;
    case "carreras":
      type = "carrera";
      label = "Carrera";
      break;
    case "especialidades":
      type = "especialidad";
      label = "Especialidad";
      break;
    default:
      type = "";
      label = "";
  }

  return (
    <button
      className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md shadow-md hover:shadow-lg hover:shadow-blue-900/30 transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start border border-blue-500/30 hover:border-blue-400/50 hover:scale-105"
      onClick={() => onClick(type)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" opacity="0.5"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
      Crear {label}
    </button>
  );
};

export default CreateButton;