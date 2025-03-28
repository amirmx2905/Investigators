import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TabNavigation from "./subcomponents/TabNavigation";
import ColumnSelector from "./subcomponents/ColumnSelector";
import Pagination from "./subcomponents/Pagination";
import {
  UsuarioTable,
  InvestigadorTable,
  ProyectoTable,
} from "./subcomponents/Tables/tables";
import {
  UsuarioCards,
  InvestigadorCards,
  ProyectoCards,
} from "./subcomponents/Cards/cards";

import {
  UsuarioForm,
  InvestigadorForm,
  ProyectoForm,
  DeleteConfirmation,
} from "./subcomponents/Forms/forms";

import { useAdminPanel } from "./hooks/useAdminPanel";
import { useTableControls, columnOrders } from "./hooks/useTableControls";
import { usuarioService } from "../../api/services/usuarioService";
import { investigadorService } from "../../api/services/investigadorService";
import { proyectoService } from "../../api/services/proyectoService";

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
    // eslint-disable-next-line no-unused-vars
    getOrderedVisibleColumns,
  } = useTableControls();

  const columnToggleRef = useRef(null);

  const showNotification = (message) => {
    toast(message, {
      position: "bottom-right",
      autoClose: 3000, 
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false, 
      closeButton: false, 
      progress: undefined,
      theme: "dark",
      style: {
        background: "linear-gradient(to right, #1e40af, #3b82f6)",
        color: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
        fontSize: "16px",
        padding: "12px 16px",
        minHeight: "40px",
        display: "flex",
        alignItems: "center",
      },
      bodyStyle: {
        fontFamily: "inherit",
        fontSize: "16px",
        fontWeight: "500",
      },
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => showNotification("Copiado al portapapeles"))
      .catch(() => showNotification("Error al copiar"));
  };

  useEffect(() => {
    let timer;
    if (!loading) {
      timer = setTimeout(() => setContentReady(true), 50);
    } else {
      setContentReady(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

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
      
      .admin-fadeIn { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
      .no-scrollbar { overflow: hidden; }
      .admin-pulse { animation: pulse 2s infinite; }
      .view-transition { transition: opacity 0.3s ease-out, transform 0.3s ease-out; }
      
      #column-dropdown { position: absolute; z-index: 50; }
      
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
      
      .notification.show { transform: translateY(0); opacity: 1; }
      
      .content-container {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0.3s, opacity 0.3s;
      }
      
      .content-container.ready { visibility: visible; opacity: 1; }
      .pagination-container { min-height: 40px; }
    `;

    document.head.appendChild(styleEl);
    return () => {
      if (document.getElementById("admin-panel-styles")) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);

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

  const renderCreateButton = () => {
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
        className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        onClick={() => handleCreate(type)}
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

  const getTabData = () => {
    let type = "";

    switch (activeTab) {
      case "usuarios":
        type = "usuario";
        break;
      case "investigadores":
        type = "investigador";
        break;
      case "proyectos":
        type = "proyecto";
        break;
      default:
        type = "usuario";
    }

    // Obtener columnas visibles ordenadas según el orden definido
    const orderedColumns = {
      usuarios: sortColumnsByOrder(visibleColumns.usuarios || [], "usuarios"),
      investigadores: sortColumnsByOrder(
        visibleColumns.investigadores || [],
        "investigadores"
      ),
      proyectos: sortColumnsByOrder(
        visibleColumns.proyectos || [],
        "proyectos"
      ),
    };

    const tabConfig = {
      usuarios: {
        title: "Lista de Usuarios",
        items: usuarios || [],
        TableComponent: UsuarioTable,
        CardComponent: UsuarioCards,
        columns: orderedColumns.usuarios,
        onEdit: (item) => handleEdit(type, item),
        onDelete: (item) => handleDeleteClick(type, item),
      },
      investigadores: {
        title: "Lista de Investigadores",
        items: investigadores || [],
        TableComponent: InvestigadorTable,
        CardComponent: InvestigadorCards,
        columns: orderedColumns.investigadores,
        onEdit: (item) => handleEdit(type, item),
        onDelete: (item) => handleDeleteClick(type, item),
      },
      proyectos: {
        title: "Lista de Proyectos",
        items: proyectos || [],
        TableComponent: ProyectoTable,
        CardComponent: ProyectoCards,
        columns: orderedColumns.proyectos,
        onEdit: (item) => handleEdit(type, item),
        onDelete: (item) => handleDeleteClick(type, item),
      },
    };

    return tabConfig[activeTab] || tabConfig.usuarios;
  };

  // Función auxiliar para ordenar columnas
  const sortColumnsByOrder = (columns, tabName) => {
    if (!columns || !Array.isArray(columns)) return [];

    return [...columns].sort((a, b) => {
      const orderA = columnOrders[tabName].indexOf(a);
      const orderB = columnOrders[tabName].indexOf(b);
      if (orderA === -1) return 1;
      if (orderB === -1) return -1;
      return orderA - orderB;
    });
  };

  const {
    title,
    items,
    TableComponent,
    CardComponent,
    columns,
    onEdit,
    onDelete,
  } = getTabData();

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
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 relative">
            <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
            <div
              className="w-16 h-16 rounded-full absolute top-0 left-0 border-4 border-transparent border-b-indigo-500 animate-spin"
              style={{ animationDuration: "1.5s" }}
            ></div>
          </div>
        </div>
      ) : (
        <div className={`content-container ${contentReady ? "ready" : ""}`}>
          <div
            className="bg-gray-800/80 rounded-lg p-6 border border-blue-500/30 admin-fadeIn"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex flex-wrap justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 transform transition-all duration-300">
                {title}
              </h3>

              {renderCreateButton()}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 transform transition-all duration-300">
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
                  handleItemsPerPageChange(Number(e.target.value));
                }}
              >
                {[10, 15, 25, 50].map((value) => (
                  <option key={value} value={value}>
                    {value} por página
                  </option>
                ))}
              </select>
            </div>

            <div ref={contentRef} className="relative min-h-[200px]">
              <div className="view-transition">
                {viewMode === "table" && !isMobile ? (
                  <TableComponent
                    usuarios={activeTab === "usuarios" ? items || [] : []}
                    investigadores={
                      activeTab === "investigadores" ? items || [] : []
                    }
                    proyectos={activeTab === "proyectos" ? items || [] : []}
                    visibleColumns={columns || []}
                    onCopy={copyToClipboard}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <CardComponent
                      items={items || []}
                      onCopy={copyToClipboard}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                )}

                <div className="pagination-container">
                  <Pagination
                    totalItems={totalItems}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    paginate={handlePageChange}
                  />
                </div>
              </div>
            </div>
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
          // Eliminamos el parámetro { type } que no se usa
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
