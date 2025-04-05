export const setupAdminPanelStyles = () => {
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
    
    #column-dropdown { position: absolute; z-index: 20; }
    
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

    /* Estilos específicos para pantallas pequeñas */
    @media (max-width: 639px) {
      .mobile-controls-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      
      .control-button {
        width: 100%;
        justify-content: center;
      }
      
      .mobile-full-width {
        grid-column: 1 / -1;
        width: 100%;
      }
    }
  `;

  document.head.appendChild(styleEl);
  return styleEl;
};
