import React from "react";
import ColumnSelector from "../../subcomponents/ColumnSelector";

const ViewControls = ({
  viewMode,
  toggleViewMode,
  isMobile,
  columnsDropdownOpen,
  setColumnsDropdownOpen,
  activeTab,
  visibleColumns,
  toggleColumn,
  columnToggleRef,
  itemsPerPage,
  handleItemsPerPageChange,
}) => {
  return (
    <div className="mb-6">
      {/* Vista para móviles (menor a 640px) */}
      <div className="block sm:hidden mobile-controls-grid">
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-200 control-button ${
            viewMode === "table" && !isMobile
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
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-200 control-button ${
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

        {/* Selector de elementos por página - Ancho completo en móvil */}
        <div className="flex justify-center items-center mobile-full-width mt-3">
          <div className="pt-2 flex items-center">
            <label className="text-sm text-gray-400 mr-2">Mostrar:</label>
            <select
              className="bg-gray-800 border border-gray-700 text-gray-300 rounded-md py-1 px-2 text-sm cursor-pointer transition-colors duration-200 hover:border-blue-500/30"
              value={itemsPerPage}
              onChange={(e) => {
                handleItemsPerPageChange(Number(e.target.value));
              }}
            >
              {[10, 15, 25, 50].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vista para pantallas sm y mayores (>= 640px) */}
      <div className="hidden sm:flex sm:flex-row justify-between items-center">
        {/* Botones de Vista */}
        <div className="flex items-center space-x-2 z-20">
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-200 ${
              viewMode === "table" && !isMobile
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

        {/* Selector de elementos por página */}
        <div className="flex items-center">
          <label className="text-sm text-gray-400 mr-2">Mostrar:</label>
          <select
            className="bg-gray-800 border border-gray-700 text-gray-300 rounded-md py-1 px-2 text-sm cursor-pointer transition-colors duration-200 hover:border-blue-500/30"
            value={itemsPerPage}
            onChange={(e) => {
              handleItemsPerPageChange(Number(e.target.value));
            }}
          >
            {[10, 15, 25, 50].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-400 ml-2">elementos</span>
        </div>
      </div>
    </div>
  );
};

export default ViewControls;
