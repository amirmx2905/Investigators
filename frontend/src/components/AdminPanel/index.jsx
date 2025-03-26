import React, { useEffect, useState} from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importar componentes
import TabNavigation from "./components/TabNavigation";
import ColumnSelector from "./components/ColumnSelector";
import Pagination from "./components/Pagination";
import {
  UsuarioTable,
  InvestigadorTable,
  ProyectoTable,
} from "./components/Tables/tables";
import {
  UsuarioCards,
  InvestigadorCards,
  ProyectoCards,
} from "./components/Cards/cards";

// Importar hooks
import { useAdminPanel } from "./hooks/useAdminPanel";
import { useTableControls } from "./hooks/useTableControls";

function AdminPanel() {
  // Estado local para manejar las notificaciones de copia
  const [notification, setNotification] = useState({ show: false, message: "" });
  
  // Nuevo estado para controlar la animación de contenido
  const [contentReady, setContentReady] = useState(false);
  
  const {
    loading,
    usuarios,
    investigadores,
    proyectos,
    activeTab,
    changeTab,
    isMobile,
  } = useAdminPanel();

  const {
    viewMode,
    toggleViewMode,
    currentPage,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
    visibleColumns,
    toggleColumn,
    columnsDropdownOpen,
    setColumnsDropdownOpen,
    contentRef,
  } = useTableControls();

  const columnToggleRef = React.useRef(null);

  // Función para mostrar notificación 
  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: "" });
    }, 3000);
  };

  // Función para copiar al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        showNotification("Copiado al portapapeles");
      })
      .catch(() => {
        showNotification("Error al copiar");
      });
  };

  // Efecto para manejar la transición de carga a contenido
  useEffect(() => {
    let timer;
    if (!loading) {
      // Retrasamos un poco para asegurar que el spinner de carga se elimine completamente
      timer = setTimeout(() => {
        setContentReady(true);
      }, 50);
    } else {
      setContentReady(false);
    }
    
    return () => clearTimeout(timer);
  }, [loading]);

  // Estilo global para animaciones
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.id = "admin-panel-styles";
    
    styleEl.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
        70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
      }
      
      .admin-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
        opacity: 0; /* Comenzar con opacidad 0 */
      }

      .no-scrollbar {
        overflow: hidden;
      }
      
      .admin-pulse {
        animation: pulse 2s infinite;
      }
      
      .view-transition {
        transition: opacity 0.3s ease-out, transform 0.3s ease-out;
      }
      
      /* Asegura que el dropdown esté por encima */
      #column-dropdown {
        position: absolute;
        z-index: 50;
      }
      
      /* Notificación */
      .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(59, 130, 246, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease-out;
        z-index: 9999;
      }
      
      .notification.show {
        transform: translateY(0);
        opacity: 1;
      }
      
      /* Contenedor invisible hasta que esté listo */
      .content-container {
        visibility: hidden;
        opacity: 0;
      }
      
      .content-container.ready {
        visibility: visible;
        opacity: 1;
      }
    `;
    
    document.head.appendChild(styleEl);
    
    return () => {
      if (document.getElementById("admin-panel-styles")) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);

  // Función para obtener elementos actuales paginados
  const getCurrentItems = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  return (
    <div className="mt-4 pb-10 w-full px-2 sm:px-4 overflow-x-hidden no-scrollbar">
      <h2 
        className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 admin-fadeIn"
        style={{ animationDelay: "0.1s" }}
      >
        Panel de Control Administrativo
      </h2>

      <TabNavigation 
        activeTab={activeTab} 
        changeTab={changeTab} 
      />

      {/* Notificación */}
      <div className={`notification ${notification.show ? 'show' : ''}`}>
        {notification.message}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 relative">
            <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
            <div className="w-16 h-16 rounded-full absolute top-0 left-0 border-4 border-transparent border-b-indigo-500 animate-spin" style={{animationDuration: "1.5s"}}></div>
          </div>
        </div>
      ) : (
        // Aplicamos clase especial para controlar la visibilidad
        <div className={`content-container ${contentReady ? 'ready' : ''}`}>
          <div
            className="bg-gray-800/80 rounded-lg p-6 border border-blue-500/30 admin-fadeIn"
            style={{ animationDelay: "0.3s" }}
          >
            {/* Título de sección */}
            <h3
              className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 transform transition-all duration-300"
            >
              {activeTab === "usuarios" && "Lista de Usuarios"}
              {activeTab === "investigadores" && "Lista de Investigadores"}
              {activeTab === "proyectos" && "Lista de Proyectos"}
            </h3>

            {/* Controles de visualización */}
            <div
              className="flex flex-wrap items-center justify-between gap-2 mb-4 transform transition-all duration-300"
            >
              <div className="flex items-center space-x-2 z-20">
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-200 ${
                    viewMode === "table"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "bg-gray-800/70 border border-blue-500/30 text-blue-300 hover:bg-gray-700/70 hover:border-blue-500/50"
                  } ${isMobile ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => toggleViewMode("table")}
                  disabled={isMobile}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
                  </svg>
                  Tabla
                </button>
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-200 ${
                    viewMode === "cards"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "bg-gray-800/70 border border-blue-500/30 text-blue-300 hover:bg-gray-700/70 hover:border-blue-500/50"
                  }`}
                  onClick={() => toggleViewMode("cards")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2z" />
                    <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2z" />
                  </svg>
                  Tarjetas
                </button>

                {viewMode === "table" && !isMobile && (
                  <div className="relative z-30" ref={columnToggleRef}>
                    <ColumnSelector
                      activeTab={activeTab}
                      columnsDropdownOpen={columnsDropdownOpen}
                      setColumnsDropdownOpen={setColumnsDropdownOpen}
                      visibleColumns={visibleColumns}
                      toggleColumn={toggleColumn}
                      columnToggleRef={columnToggleRef}
                    />
                  </div>
                )}
              </div>

              <select
                className="bg-gray-800 border border-gray-700 text-gray-300 rounded-md py-1 px-2 text-sm cursor-pointer transition-colors duration-200 hover:border-blue-500/30"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[5, 10, 15, 20].map((value) => (
                  <option key={value} value={value}>
                    {value} por página
                  </option>
                ))}
              </select>
            </div>

            {/* Contenido dinámico según la pestaña activa */}
            <div
              ref={contentRef}
              className="relative min-h-[200px]"
            >
              {activeTab === "usuarios" && (
                <div className="view-transition">
                  {viewMode === "table" && !isMobile ? (
                    <UsuarioTable
                      usuarios={getCurrentItems(usuarios)}
                      visibleColumns={visibleColumns.usuarios}
                      onCopy={copyToClipboard}
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <UsuarioCards 
                        items={getCurrentItems(usuarios)}
                        onCopy={copyToClipboard}
                      />
                    </div>
                  )}
                  
                  <Pagination
                    totalItems={usuarios.length}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    paginate={setCurrentPage}
                  />
                </div>
              )}
              
              {activeTab === "investigadores" && (
                <div className="view-transition">
                  {viewMode === "table" && !isMobile ? (
                    <InvestigadorTable
                      investigadores={getCurrentItems(investigadores)}
                      visibleColumns={visibleColumns.investigadores}
                      onCopy={copyToClipboard}
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <InvestigadorCards 
                        items={getCurrentItems(investigadores)}
                        onCopy={copyToClipboard}
                      />
                    </div>
                  )}
                  
                  <Pagination
                    totalItems={investigadores.length}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    paginate={setCurrentPage}
                  />
                </div>
              )}
              
              {activeTab === "proyectos" && (
                <div className="view-transition">
                  {viewMode === "table" && !isMobile ? (
                    <ProyectoTable
                      proyectos={getCurrentItems(proyectos)}
                      visibleColumns={visibleColumns.proyectos}
                      onCopy={copyToClipboard}
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <ProyectoCards 
                        items={getCurrentItems(proyectos)}
                        onCopy={copyToClipboard}
                      />
                    </div>
                  )}
                  
                  <Pagination
                    totalItems={proyectos.length}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    paginate={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ToastContainer limit={3} />
    </div>
  );
}

export default AdminPanel;