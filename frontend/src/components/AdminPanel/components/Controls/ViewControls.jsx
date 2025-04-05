import React from "react";
import ColumnSelector from "../../subcomponents/ColumnSelector";

function ViewControls({
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
}) {
  
  const cardsOnlyModules = ["carreras","especialidades","unidades"]; //Alan, Aquí puedes agregar más módulos en el futuro
  
  const isCardsOnlyModule = cardsOnlyModules.includes(activeTab);

  const itemsPerPageOptions = [5, 10, 15, 20, 50];

  return (
    <div className={`flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between items-center mb-6`}>
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        {/* Botnes pa cuando hay tipo tabla y tarjeta*/}
        {!isCardsOnlyModule && (
          <>
            <button
              className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                viewMode === "table"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => toggleViewMode("table")}
              title="Vista de tabla"
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
              <span className={`${isMobile ? "hidden" : "block"}`}>Tabla</span>
            </button>

            <button
              className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                viewMode === "cards"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => toggleViewMode("cards")}
              title="Vista de tarjetas"
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
              <span className={`${isMobile ? "hidden" : "block"}`}>Tarjetas</span>
            </button>
          </>
        )}
        
        {/* Pa cuando solo hay tarjetas*/}
        {isCardsOnlyModule && (
          <div className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-blue-600 text-white">
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
            <span className={`${isMobile ? "hidden" : "block"}`}>Vista de Tarjetas</span>
          </div>
        )}

        {/* Selector de columnas */}
        {viewMode === "table" && !isCardsOnlyModule && (
          <ColumnSelector
            activeTab={activeTab}
            columnsDropdownOpen={columnsDropdownOpen}
            setColumnsDropdownOpen={setColumnsDropdownOpen}
            visibleColumns={visibleColumns}
            toggleColumn={toggleColumn}
            columnToggleRef={columnToggleRef}
          />
        )}
      </div>

      {/* Selector de elementos por página */}
      <div className="flex items-center gap-2">
        <label htmlFor="items-per-page" className="text-sm text-gray-400">
          Mostrar:
        </label>
        <select
          id="items-per-page"
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          className="cursor-pointer px-2 py-1 rounded text-sm bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:border-blue-500"
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ViewControls;