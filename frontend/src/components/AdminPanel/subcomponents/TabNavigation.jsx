import React, { useState, useRef, useEffect } from "react";

// Datos de tabs esenciales (busca en Heroicons para iconos bro)
const TABS_DATA = [
  { id: "usuarios", label: "Usuarios", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { id: "investigadores", label: "Investigadores", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { id: "proyectos", label: "Proyectos", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }
];

const TabIcon = ({ path }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
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

  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(`[data-tab="${activeTab}"]`);
      if (activeElement) {
        const containerRect = scrollContainerRef.current.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        
        scrollContainerRef.current.scrollLeft = 
          elementRect.left - containerRect.left - (containerRect.width - elementRect.width) / 2;
      }
    }
  }, [activeTab]);

  const tabs = TABS_DATA.map(tab => ({
    ...tab,
    icon: <TabIcon path={tab.icon} />
  }));

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

  const scrollTabs = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += (direction === 'left' ? -200 : 200);
    }
  };

  return (
    <div className="mb-6 admin-fadeIn" style={{ animationDelay: "0.2s", position: "relative", zIndex: "9999" }}>
      {/* Versión móvil - Dropdown select */}
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
            className={`h-5 w-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Overlay */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 bg-gray-900/30 z-[9998]"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
        
        {/* Menú desplegable */}
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
                  changeTab(tab.id);
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

      {/* Versión escritorio - Tabs con scroll horizontal */}
      <div className="hidden md:block">
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
                onClick={() => changeTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Botones de scroll */}
          <div className="flex gap-1 pl-1 border-l border-gray-700">
            <button 
              className="cursor-pointer p-1 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
              onClick={() => scrollTabs('left')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="cursor-pointer p-1 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
              onClick={() => scrollTabs('right')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabNavigation;