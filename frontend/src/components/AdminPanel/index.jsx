import React, { useEffect, useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TabNavigation from "./subcomponents/TabNavigation";
import {
  UsuarioForm,
  InvestigadorForm,
  ProyectoForm,
  DeleteConfirmation,
} from "./subcomponents/Forms/forms";

// Custom hooks
import { useAdminPanel } from "./hooks/useAdminPanel";
import { useTableControls } from "./hooks/useTableControls";

// Services
import { usuarioService } from "../../api/services/usuarioService";
import { investigadorService } from "../../api/services/investigadorService";
import { proyectoService } from "../../api/services/proyectoService";

// Utils and components
import { showNotification, copyToClipboard } from "./utils/notificationsUtils";
import { setupAdminPanelStyles } from "./styles/adminPanelStyles";
import { getTabData } from "./utils/dataUtils";
import CreateButton from "./components/Buttons/CreateButton";
import ViewControls from "./components/Controls/ViewControls";
import ContentDisplay from "./components/Content/ContentDisplay";
import LoadingSpinner from "./components/Loaders/LoadingSpinner";

function AdminPanel() {
  const [contentReady, setContentReady] = useState(false);

  const [formModal, setFormModal] = useState({
    isOpen: false,
    type: null,
    item: null,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null,
    item: null,
  });

  const [isDeleting, setIsDeleting] = useState(false);

  const {
    loading,
    usuarios,
    investigadores,
    proyectos,
    activeTab,
    changeTab,
    refreshData,
    currentPage,
    itemsPerPage,
    totalItems,
    handlePageChange,
    handleItemsPerPageChange,
  } = useAdminPanel();

  const {
    viewMode,
    toggleViewMode,
    visibleColumns,
    toggleColumn,
    columnsDropdownOpen,
    setColumnsDropdownOpen,
    contentRef,
    isMobile,
  } = useTableControls();

  const columnToggleRef = useRef(null);

  // Setup content ready effect
  useEffect(() => {
    let timer;
    if (!loading) {
      timer = setTimeout(() => setContentReady(true), 50);
    } else {
      setContentReady(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  // Setup styles
  useEffect(() => {
    const styleEl = setupAdminPanelStyles();
    return () => {
      if (document.getElementById("admin-panel-styles")) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);

  // CRUD Handlers
  const handleCreate = (type) => {
    setFormModal({
      isOpen: true,
      type,
      item: null,
    });
  };

  const handleEdit = (type, item) => {
    setFormModal({
      isOpen: true,
      type,
      item,
    });
  };

  const handleDeleteClick = (type, item) => {
    setDeleteModal({
      isOpen: true,
      type,
      item,
    });
  };

  const handleConfirmDelete = async () => {
    const { type, item } = deleteModal;

    if (!item || !type) return;

    setIsDeleting(true);

    try {
      if (type === "usuario") {
        await usuarioService.deleteUsuario(item.id);
      } else if (type === "investigador") {
        await investigadorService.deleteInvestigador(item.id);
      } else if (type === "proyecto") {
        await proyectoService.deleteProyecto(item.id);
      }

      refreshData();

      showNotification(
        `${type.charAt(0).toUpperCase() + type.slice(1)} eliminado con éxito`
      );

      setDeleteModal({
        isOpen: false,
        type: null,
        item: null,
      });
    } catch (error) {
      console.error(`Error al eliminar ${type}:`, error);
      showNotification(`Error al eliminar: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    refreshData();

    const actionText = formModal.item ? "actualizado" : "creado";
    showNotification(
      `${
        formModal.type.charAt(0).toUpperCase() + formModal.type.slice(1)
      } ${actionText} con éxito`
    );

    handleCloseForm();
  };

  const handleCloseForm = () => {
    setFormModal({
      isOpen: false,
      type: null,
      item: null,
    });
  };

  // Render form based on type
  const renderForm = () => {
    const { type, item, isOpen } = formModal;

    if (!isOpen) return null;

    switch (type) {
      case "usuario":
        return (
          <UsuarioForm
            isOpen={isOpen}
            onClose={handleCloseForm}
            usuario={item}
            onSuccess={handleFormSuccess}
          />
        );
      case "investigador":
        return (
          <InvestigadorForm
            isOpen={isOpen}
            onClose={handleCloseForm}
            investigador={item}
            onSuccess={handleFormSuccess}
          />
        );
      case "proyecto":
        return (
          <ProyectoForm
            isOpen={isOpen}
            onClose={handleCloseForm}
            proyecto={item}
            onSuccess={handleFormSuccess}
          />
        );
      default:
        return null;
    }
  };

  // Get data for current tab
  const {
    title,
    items,
    TableComponent,
    CardComponent,
    columns,
    onEdit,
    onDelete,
  } = getTabData(activeTab, visibleColumns, usuarios, investigadores, proyectos, handleEdit, handleDeleteClick);

  return (
    <div className="mt-4 pb-10 w-full px-2 sm:px-4 overflow-x-hidden no-scrollbar">
      <h2
        className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 admin-fadeIn"
        style={{ animationDelay: "0.1s" }}
      >
        Panel de Control Administrativo
      </h2>

      <TabNavigation activeTab={activeTab} changeTab={changeTab} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={`content-container ${contentReady ? "ready" : ""}`}>
          <div
            className="bg-gray-800/80 rounded-lg p-6 border border-blue-500/30 admin-fadeIn"
            style={{ animationDelay: "0.3s" }}
          >
            {/* Título y Botón de Crear - Centrados en Móvil */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 transform transition-all duration-300">
                {title}
              </h3>

              <div className="w-full sm:w-auto">
                <CreateButton 
                  activeTab={activeTab} 
                  onClick={handleCreate} 
                />
              </div>
            </div>

            {/* Controles de Visualización */}
            <ViewControls 
              viewMode={viewMode}
              toggleViewMode={toggleViewMode}
              isMobile={isMobile}
              columnsDropdownOpen={columnsDropdownOpen}
              setColumnsDropdownOpen={setColumnsDropdownOpen}
              activeTab={activeTab}
              visibleColumns={visibleColumns}
              toggleColumn={toggleColumn}
              columnToggleRef={columnToggleRef}
              itemsPerPage={itemsPerPage}
              handleItemsPerPageChange={handleItemsPerPageChange}
            />

            {/* Contenido */}
            <ContentDisplay 
              contentRef={contentRef}
              viewMode={viewMode}
              isMobile={isMobile}
              TableComponent={TableComponent}
              CardComponent={CardComponent}
              activeTab={activeTab}
              items={items}
              columns={columns}
              onCopy={copyToClipboard}
              onEdit={onEdit}
              onDelete={onDelete}
              totalItems={totalItems}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {renderForm()}

      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, type: null, item: null })
        }
        onConfirm={handleConfirmDelete}
        itemName={
          deleteModal.item?.nombre || deleteModal.item?.nombre_usuario || ""
        }
        itemType={
          deleteModal.type
            ? deleteModal.type.charAt(0).toUpperCase() +
              deleteModal.type.slice(1)
            : ""
        }
        isDeleting={isDeleting}
      />

      <ToastContainer
        limit={3}
        theme="dark"
        closeButton={false}
        closeOnClick={false}
        draggable={false}
        toastClassName={() =>
          "relative flex p-3 min-h-[70px] rounded-lg justify-between overflow-hidden cursor-default bg-gradient-to-r from-blue-800 to-blue-600 mb-3"
        }
        bodyClassName={() => "text-base font-white font-medium block p-3"}
        icon={() => (
          <div className="flex items-center justify-center w-8 h-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      />
    </div>
  );
}

export default AdminPanel;