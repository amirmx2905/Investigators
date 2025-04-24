import React, { useState, useRef, useEffect } from "react";

// Datos de tabs esenciales (busca en Heroicons para iconos bro)
const TABS_DATA = [
  {
    id: "usuarios",
    label: "Usuarios",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    id: "investigadores",
    label: "Investigadores",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    id: "estudiantes",
    label: "Estudiantes",
    icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z",
  },
  {
    id: "proyectos",
    label: "Proyectos",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    id: "articulos",
    label: "Artículos",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    id: "eventos",
    label: "Eventos",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    id: "carreras",
    label: "Carreras",
    icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z",
  },
  {
    id: "especialidades",
    label: "Especialidades",
    icon: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
  },
  {
    id: "unidades",
    label: "Unidades",
    icon: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
  },
  {
    id: "Jefes_de_area",
    label: "Jefes de Area",
    icon: "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z",
  },
  {
    id: "lineas",
    label: "Líneas de Investigación",
    icon: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
  },
  {
    id: "niveles",
    label: "Niveles educativos",
    icon: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z",
  },
  {
    id: "tipos_estudiante",
    label: "Tipo de Estudiante",
    icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  },
];

const TabIcon = ({ path }) => (
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
      d={path}
    />
  </svg>
);

function TabNavigation({ activeTab, changeTab }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToActiveTab = () => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(
        `[data-tab="${activeTab}"]`
      );
      if (activeElement) {
        const container = scrollContainerRef.current;
        const containerWidth = container.offsetWidth;
        const tabWidth = activeElement.offsetWidth;
        const tabLeft = activeElement.offsetLeft;

        const scrollPosition = tabLeft - containerWidth / 2 + tabWidth / 2;

        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToActiveTab();
    }, 100);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    changeTab(tabId);
  };

  const tabs = TABS_DATA.map((tab) => ({
    ...tab,
    icon: <TabIcon path={tab.icon} />,
  }));

  const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  const scrollTabs = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth * 0.75;

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="mb-6 admin-fadeIn relative md:z-0 z-[9999]"
      style={{ animationDelay: "0.2s" }}
    >
      {/* Versión móviles */}
      <div className="md:hidden relative z-[9999] mb-4" ref={dropdownRef}>
        <button
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 rounded-md border border-gray-700 text-gray-200 hover:bg-gray-700/80 transition-colors"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex items-center gap-2">
            {activeTabData.icon}
            <span>{activeTabData.label}</span>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div
            className="fixed inset-0 bg-gray-900/30 z-[9998]"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg overflow-y-auto z-[9999] max-h-[70vh]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`w-full flex items-center gap-2 px-4 py-3.5 text-left text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-gray-700/70 text-blue-400"
                    : "text-gray-300 hover:bg-gray-700/50"
                }`}
                onClick={() => {
                  handleTabChange(tab.id);
                  setIsDropdownOpen(false);
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Versión escritorio */}
      <div className="hidden md:block z-0 relative">
        <div className="flex justify-between items-center border-b border-gray-700 mb-2">
          <div
            ref={scrollContainerRef}
            className="flex items-center overflow-x-auto no-scrollbar py-1 hide-scrollbar scroll-smooth"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                data-tab={tab.id}
                className={`cursor-pointer flex items-center shrink-0 gap-2 px-4 py-3 font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-blue-400 border-b-2 border-blue-500 -mb-[1px] bg-gray-800/30"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/20"
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-1 pl-1 border-l border-gray-700">
            <button
              className="cursor-pointer p-1 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
              onClick={() => scrollTabs("left")}
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="cursor-pointer p-1 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
              onClick={() => scrollTabs("right")}
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx global="true">{`
        .modal-container,
        div[role="dialog"],
        [class*="z-[99999]"] {
          z-index: 99999 !important;
        }

        @media (max-width: 767px) {
          .admin-fadeIn {
            z-index: 9999;
          }
        }

        @media (min-width: 768px) {
          .admin-fadeIn {
            z-index: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default TabNavigation;
