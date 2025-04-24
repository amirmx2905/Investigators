import React from "react";
import Pagination from "../../subcomponents/Pagination";

const ContentDisplay = ({
  contentRef,
  viewMode,
  isMobile,
  TableComponent,
  CardComponent,
  activeTab,
  items,
  columns,
  onCopy,
  onEdit,
  onDelete,
  totalItems,
  currentPage,
  itemsPerPage,
  handlePageChange,
}) => {
  // Lista de módulos que solo usan tarjetas
  const cardsOnlyModules = ["carreras","especialidades","unidades","lineas","niveles"]; // Alan, aquí puedes agregar más módulos en el futuro  

  const isCardsOnlyModule = cardsOnlyModules.includes(activeTab);

  const renderTable = () => {
    if (!TableComponent || isCardsOnlyModule) {
      return (
        <div className="text-center py-8 text-gray-400">
          Este recurso solo está disponible en vista de tarjetas.
        </div>
      );
    }
    
    return (
      <TableComponent
        usuarios={activeTab === "usuarios" ? items || [] : []}
        investigadores={activeTab === "investigadores" ? items || [] : []}
        proyectos={activeTab === "proyectos" ? items || [] : []}
        estudiantes={activeTab === "estudiantes" ? items || [] : []}
        articulos={activeTab === "articulos" ? items || [] : []}
        eventos={activeTab === "eventos" ? items || [] : []}
        carreras={activeTab === "carreras" ? items || [] : []}
        especialidades={activeTab === "especialidades" ? items || [] : []}
        unidades={activeTab === "unidades" ? items || [] : []}
        lineas={activeTab === "lineas" ? items || [] : []}
        niveles={activeTab === "niveles" ? items || [] : []}
        visibleColumns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  };

  const renderCards = () => {
    if (!CardComponent) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardComponent
          items={items}
          onEdit={onEdit}
          onDelete={onDelete}
          onCopy={onCopy}
        />
      </div>
    );
  };

  const currentViewMode = isCardsOnlyModule ? "cards" : viewMode;

  return (
    <div
      ref={contentRef}
      className="mt-6 view-transition animate-fade-in"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="space-y-6">
        {currentViewMode === "table" && !isMobile ? renderTable() : renderCards()}

        <div className="pagination-container mt-8">
          {totalItems > itemsPerPage && (
            <Pagination
              totalItems={totalItems}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              paginate={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentDisplay;