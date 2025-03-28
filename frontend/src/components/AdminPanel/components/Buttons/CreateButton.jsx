import React from 'react';

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
    default:
      type = "usuario";
      label = "Usuario";
  }

  return (
    <button
      className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors w-full sm:w-auto justify-center sm:justify-start"
      onClick={() => onClick(type)}
    >
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
          d="M12 4v16m8-8H4"
        />
      </svg>
      Crear {label}
    </button>
  );
};

export default CreateButton;