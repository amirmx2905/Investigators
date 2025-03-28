import React from 'react';
import Pagination from '../../subcomponents/Pagination';

const ContentDisplay = ({
  contentRef,
  viewMode,
  isMobile,
  // eslint-disable-next-line no-unused-vars
  TableComponent,
  // eslint-disable-next-line no-unused-vars
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
  handlePageChange
}) => {
  // Render table component
  const renderTable = () => {
    return (
      <TableComponent
        usuarios={activeTab === "usuarios" ? items || [] : []}
        investigadores={activeTab === "investigadores" ? items || [] : []}
        proyectos={activeTab === "proyectos" ? items || [] : []}
        visibleColumns={columns || []}
        onCopy={onCopy}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  };

  // Render card component
  const renderCards = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardComponent
          items={items || []}
          onCopy={onCopy}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    );
  };

  return (
    <div ref={contentRef} className="relative min-h-[200px]">
      <div className="view-transition">
        {viewMode === "table" && !isMobile ? renderTable() : renderCards()}

        {/* Paginación */}
        <div className="mt-8 pt-4 border-t border-gray-700/50 flex justify-center">
          <Pagination
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            paginate={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentDisplay;