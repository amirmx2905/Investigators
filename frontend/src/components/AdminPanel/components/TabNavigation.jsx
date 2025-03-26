import React from "react";

function TabNavigation({ activeTab, changeTab }) {
  // Datos para las pestañas
  const tabs = [
    {
      id: "usuarios",
      label: "Usuarios",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      id: "investigadores",
      label: "Investigadores",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      id: "proyectos",
      label: "Proyectos",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="mb-6 admin-fadeIn" style={{ animationDelay: "0.2s" }}>
      <div className="flex flex-wrap items-center border-b border-gray-700">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            className={`cursor-pointer flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-300 ${
              activeTab === id
                ? "text-blue-400 border-b-2 border-blue-500 -mb-[1px]"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => changeTab(id)}
          >
            {icon}
            {label}
            
            {/* Indicador animado cuando está activo */}
            {activeTab === id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform origin-left transition-all duration-300"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TabNavigation;