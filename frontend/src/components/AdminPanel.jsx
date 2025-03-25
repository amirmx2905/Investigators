import { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUsuarios, getInvestigadores, getProyectos } from '../api';

function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [investigadores, setInvestigadores] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [activeTab, setActiveTab] = useState('usuarios');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Estados para visualización de columnas
  const [visibleColumns, setVisibleColumns] = useState({
    usuarios: ['id', 'nombre_usuario', 'rol', 'activo'],
    investigadores: ['id', 'nombre', 'correo', 'activo'],
    proyectos: ['id', 'nombre', 'estado', 'fecha_inicio']
  });
  
  // Estado para togglear entre vista tabla y tarjetas en móvil
  const [viewMode, setViewMode] = useState('table');

  // Ref para detectar clics fuera del dropdown de columnas
  const columnToggleRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Forzar el modo cards en móvil
      if (mobile) {
        setViewMode('cards');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Manejador para cerrar el dropdown de columnas al hacer clic fuera
    const handleClickOutside = (event) => {
      if (columnToggleRef.current && !columnToggleRef.current.contains(event.target)) {
        // Cerrar el dropdown si está abierto y el clic fue fuera
        const dropdownElement = columnToggleRef.current.querySelector('.column-toggle-dropdown');
        if (dropdownElement) {
          // Encontrar el componente ColumnToggle y llamar a su setIsOpen(false)
          const toggleButtons = document.querySelectorAll('.column-toggle-button');
          toggleButtons.forEach(button => {
            if (!button.contains(event.target)) {
              // Forzar cierre del dropdown
              const dropdowns = document.querySelectorAll('.column-toggle-dropdown');
              dropdowns.forEach(dropdown => {
                dropdown.parentNode.removeChild(dropdown);
              });
            }
          });
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
        50% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
        100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
      }
      
      @keyframes appearUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .tab-glow {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .tab-glow:after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: all 0.6s ease;
      }
      
      .tab-glow:hover:after {
        left: 100%;
      }
      
      .active-tab {
        background: linear-gradient(90deg, #3b82f6, #4f46e5);
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
      }
      
      .appear-up {
        opacity: 0;
        animation: appearUp 0.6s ease-out forwards;
      }
      
      .fade-in {
        animation: fadeIn 0.4s ease-out forwards;
      }
      
      .panel-shadow {
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.3);
        backdrop-filter: blur(4px);
      }
      
      .table-header {
        background: linear-gradient(90deg, rgba(31, 41, 55, 0.8), rgba(30, 58, 138, 0.8));
        border-bottom: 1px solid rgba(59, 130, 246, 0.3);
        position: sticky;
        top: 0;
        z-index: 10;
      }
      
      .table-row:hover {
        background-color: rgba(59, 130, 246, 0.1);
      }
      
      .status-badge {
        box-shadow: 0 0 5px currentColor;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .cyber-spinner {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 3px solid rgba(59, 130, 246, 0.1);
        border-top-color: rgba(59, 130, 246, 0.8);
        animation: spin 1s linear infinite;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
      }
      
      /* Responsive table styles */
      @media (max-width: 768px) {
        .responsive-table {
          display: block;
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        .status-badge {
          box-shadow: 0 0 3px currentColor;
        }
        
        .panel-shadow {
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.15);
        }
        
        /* Deshabilitar opción de tabla en móvil */
        .view-toggle-table-button {
          opacity: 0.5;
          pointer-events: none;
          cursor: not-allowed;
        }
      }
      
      @media (max-width: 640px) {
        .cyber-spinner {
          width: 40px;
          height: 40px;
        }
        
        .tab-glow {
          min-width: 80px;
          text-align: center;
        }
      }
      
      /* Optimized styles for very small screens */
      @media (max-width: 480px) {
        .mobile-tabs {
          flex-direction: column;
          width: 100%;
        }
        
        .mobile-tabs button {
          width: 100%;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .mobile-tabs button:last-child {
          border-bottom: none;
        }
        
        .card-compact {
          padding: 0.75rem;
        }
      }
      
      /* Card view styling */
      .data-card {
        background: rgba(31, 41, 55, 0.7);
        border-radius: 0.5rem;
        border: 1px solid rgba(59, 130, 246, 0.2);
        padding: 1rem;
        margin-bottom: 1rem;
        transition: all 0.3s ease;
        backdrop-filter: blur(4px);
      }
      
      .data-card:hover {
        border-color: rgba(59, 130, 246, 0.4);
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.1);
        transform: translateY(-2px);
      }
      
      .data-card-label {
        font-size: 0.75rem;
        color: #93c5fd;
        margin-bottom: 0.25rem;
        font-weight: 500;
      }
      
      .data-card-value {
        font-size: 0.875rem;
        color: white;
        margin-bottom: 0.75rem;
        word-break: break-word;
      }
      
      /* Pagination styling */
      .pagination-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1.5rem;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      
      .pagination-button {
        background: rgba(31, 41, 55, 0.7);
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: #93c5fd;
        padding: 0.4rem 0.7rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        transition: all 0.3s ease;
        min-width: 2.5rem;
        text-align: center;
      }
      
      .pagination-button:hover {
        background: rgba(55, 65, 81, 0.7);
        border-color: rgba(59, 130, 246, 0.6);
      }
      
      .pagination-button.active {
        background: linear-gradient(90deg, #3b82f6, #4f46e5);
        color: white;
        border-color: transparent;
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
      }
      
      .pagination-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      /* Column toggle */
      .column-toggle {
        position: relative;
      }
      
      .column-toggle-button {
        background: rgba(31, 41, 55, 0.7);
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: #93c5fd;
        padding: 0.5rem 0.75rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .column-toggle-button:hover {
        background: rgba(55, 65, 81, 0.7);
        border-color: rgba(59, 130, 246, 0.6);
      }
      
      .column-toggle-dropdown {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        background: rgba(31, 41, 55, 0.9);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 0.375rem;
        padding: 0.75rem;
        width: 200px;
        z-index: 50;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
      }
      
      .column-checkbox {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
        padding: 0.375rem 0.5rem;
        border-radius: 0.25rem;
        transition: all 0.2s ease;
      }
      
      .column-checkbox:hover {
        background: rgba(59, 130, 246, 0.1);
      }
      
      .column-checkbox input {
        accent-color: #3b82f6;
        width: 1rem;
        height: 1rem;
      }
      
      .view-toggle-button {
        background: rgba(31, 41, 55, 0.7);
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: #93c5fd;
        padding: 0.5rem 0.75rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .view-toggle-button:hover {
        background: rgba(55, 65, 81, 0.7);
        border-color: rgba(59, 130, 246, 0.6);
      }
      
      .view-toggle-button.active {
        background: linear-gradient(90deg, #3b82f6, #4f46e5);
        color: white;
        border-color: transparent;
      }
    `;
    document.head.appendChild(style);
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [usuariosData, investigadoresData, proyectosData] = await Promise.all([
          getUsuarios(),
          getInvestigadores(),
          getProyectos()
        ]);

        setUsuarios(usuariosData);
        setInvestigadores(investigadoresData);
        setProyectos(proyectosData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('Error al cargar los datos', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          closeButton: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      document.head.removeChild(style);
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [viewMode]);

  // Cambiar la página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Toggle columna visible/invisible
  const toggleColumn = (tab, column) => {
    setVisibleColumns(prev => {
      const current = [...prev[tab]];
      
      if (current.includes(column)) {
        if (current.length > 1) { // Evitar que todas las columnas sean ocultadas
          return { ...prev, [tab]: current.filter(col => col !== column) };
        }
        return prev;
      } else {
        return { ...prev, [tab]: [...current, column] };
      }
    });
  };

  // Toggle entre vista tabla y tarjetas
  const toggleViewMode = (mode) => {
    // Solo permitir cambiar a tabla si no estamos en móvil
    if (mode === 'table' && isMobile) {
      return;
    }
    setViewMode(mode);
  };

  // Obtener los items de la página actual
  const getCurrentItems = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Componente de paginación
  const Pagination = ({ totalItems }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Determinar qué números de página mostrar
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4 && startPage > 1) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination-container">
        <button 
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          &laquo;
        </button>
        <button 
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          &lt;
        </button>
        
        {startPage > 1 && (
          <>
            <button onClick={() => paginate(1)} className="pagination-button">1</button>
            {startPage > 2 && <span className="text-gray-400">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
            <button onClick={() => paginate(totalPages)} className="pagination-button">{totalPages}</button>
          </>
        )}
        
        <button 
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          &gt;
        </button>
        <button 
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          &raquo;
        </button>
      </div>
    );
  };

  // Toggle de columnas visibles
  const ColumnToggle = ({ tab }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Determinar las columnas disponibles según el tab activo
    const columns = {
      usuarios: [
        { id: 'id', label: 'ID' },
        { id: 'nombre_usuario', label: 'Usuario' },
        { id: 'rol', label: 'Rol' },
        { id: 'activo', label: 'Estado' }
      ],
      investigadores: [
        { id: 'id', label: 'ID' },
        { id: 'nombre', label: 'Nombre' },
        { id: 'correo', label: 'Correo' },
        { id: 'activo', label: 'Estado' }
      ],
      proyectos: [
        { id: 'id', label: 'ID' },
        { id: 'nombre', label: 'Nombre' },
        { id: 'estado', label: 'Estado' },
        { id: 'fecha_inicio', label: 'Fecha' }
      ]
    };
    
    return (
      <div className="column-toggle ml-auto" ref={columnToggleRef}>
        <button 
          className="column-toggle-button" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3.5 2h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1zm5-10h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1zm5-10h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1z"/>
          </svg>
          Columnas
        </button>
        {isOpen && (
          <div className="column-toggle-dropdown fade-in">
            {columns[tab].map(column => (
              <label key={column.id} className="column-checkbox">
                <input 
                  type="checkbox"
                  checked={visibleColumns[tab].includes(column.id)}
                  onChange={() => toggleColumn(tab, column.id)}
                />
                <span>{column.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Vista alternativa de tarjetas para móviles
  const renderUsuarioCards = (items) => {
    return getCurrentItems(items).map(usuario => (
      <div key={usuario.id} className="data-card">
        <div className="data-card-label">ID</div>
        <div className="data-card-value">{usuario.id}</div>
        
        <div className="data-card-label">Usuario</div>
        <div className="data-card-value">{usuario.nombre_usuario}</div>
        
        <div className="data-card-label">Rol</div>
        <div className="data-card-value">{usuario.rol}</div>
        
        <div className="data-card-label">Estado</div>
        <div className="data-card-value">
          {usuario.activo ? (
            <span className="bg-green-500 text-white px-1.5 py-0.5 rounded-full text-xs status-badge">
              Activo
            </span>
          ) : (
            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs status-badge">
              Inactivo
            </span>
          )}
        </div>
      </div>
    ));
  };

  const renderInvestigadorCards = (items) => {
    return getCurrentItems(items).map(investigador => (
      <div key={investigador.id} className="data-card">
        <div className="data-card-label">ID</div>
        <div className="data-card-value">{investigador.id}</div>
        
        <div className="data-card-label">Nombre</div>
        <div className="data-card-value">{investigador.nombre}</div>
        
        <div className="data-card-label">Correo</div>
        <div className="data-card-value">{investigador.correo}</div>
        
        <div className="data-card-label">Estado</div>
        <div className="data-card-value">
          {investigador.activo ? (
            <span className="bg-green-500 text-white px-1.5 py-0.5 rounded-full text-xs status-badge">
              Activo
            </span>
          ) : (
            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs status-badge">
              Inactivo
            </span>
          )}
        </div>
      </div>
    ));
  };

  const renderProyectoCards = (items) => {
    return getCurrentItems(items).map(proyecto => (
      <div key={proyecto.id} className="data-card">
        <div className="data-card-label">ID</div>
        <div className="data-card-value">{proyecto.id}</div>
        
        <div className="data-card-label">Nombre</div>
        <div className="data-card-value">{proyecto.nombre}</div>
        
        <div className="data-card-label">Estado</div>
        <div className="data-card-value">{proyecto.estado}</div>
        
        <div className="data-card-label">Fecha de Inicio</div>
        <div className="data-card-value">{proyecto.fecha_inicio}</div>
      </div>
    ));
  };

  // Renderizado de tablas filtradas por columnas visibles
  const renderUserTable = () => (
    <div className="responsive-table mt-2">
      <table className="min-w-full bg-gray-700/80 rounded-lg backdrop-blur-sm">
        <thead className="table-header">
          <tr>
            {visibleColumns.usuarios.includes('id') && (
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-300">ID</th>
            )}
            {visibleColumns.usuarios.includes('nombre_usuario') && (
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-300">Usuario</th>
            )}
            {visibleColumns.usuarios.includes('rol') && (
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-300">Rol</th>
            )}
            {visibleColumns.usuarios.includes('activo') && (
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-300">Estado</th>
            )}
          </tr>
        </thead>
        <tbody>
          {getCurrentItems(usuarios).map((usuario) => (
            <tr key={usuario.id} className="border-t border-gray-600/50 table-row">
              {visibleColumns.usuarios.includes('id') && (
                <td className="px-2 sm:px-4 py-2 sm:py-3">{usuario.id}</td>
              )}
              {visibleColumns.usuarios.includes('nombre_usuario') && (
                <td className="px-2 sm:px-4 py-2 sm:py-3">{usuario.nombre_usuario}</td>
              )}
              {visibleColumns.usuarios.includes('rol') && (
                <td className="px-2 sm:px-4 py-2 sm:py-3">{usuario.rol}</td>
              )}
              {visibleColumns.usuarios.includes('activo') && (
                <td className="px-2 sm:px-4 py-2 sm:py-3">
                  {usuario.activo ? (
                    <span className="bg-green-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs status-badge">
                      Activo
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs status-badge">
                      Inactivo
                    </span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderInvestigadorTable = () => (
    <div className="responsive-table mt-2">
      <table className="min-w-full bg-gray-700/80 rounded-lg backdrop-blur-sm">
        <thead className="table-header">
          <tr>
            {visibleColumns.investigadores.includes('id') && (
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-300">ID</th>
            )}
            {visibleColumns.investigadores.includes('nombre') && (
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-300">Nombre</th>
            )}
            {visibleColumns.investigadores.includes('correo') && (
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-300">Correo</th>
            )}
            {visibleColumns.investigadores.includes('activo') && (
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-300">Estado</th>
            )}
          </tr>
        </thead>
        <tbody>
          {getCurrentItems(investigadores).map((investigador) => (
            <tr key={investigador.id} className="border-t border-gray-600/50 table-row">
              {visibleColumns.investigadores.includes('id') && (
                <td className="px-2 sm:px-4 py-2 sm:py-3">{investigador.id}</td>
              )}
              {visibleColumns.investigadores.includes('nombre') && (
                <td className="px-2 sm:px-4 py-2 sm:py-3">{investigador.nombre}</td>
              )}
              {visibleColumns.investigadores.includes('correo') && (
                <td className="px-2 sm:px-4 py-2 sm:py-3 truncate max-w-[120px] sm:max-w-none">{investigador.correo}</td>
              )}
              {visibleColumns.investigadores.includes('activo') && (
                <td className="px-2 sm:px-4 py-2 sm:py-3">
                  {investigador.activo ? (
                    <span className="bg-green-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs status-badge">
                      Activo
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs status-badge">
                      Inactivo
                    </span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderProyectoTable = () => (
    <div className="responsive-table mt-2">
      <table className="min-w-full bg-gray-700/80 rounded-lg backdrop-blur-sm">
        <thead className="table-header">
          <tr>
            {visibleColumns.proyectos.includes('id') && (
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-300">ID</th>
            )}
            {visibleColumns.proyectos.includes('nombre') && (
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-300">Nombre</th>
            )}
            {visibleColumns.proyectos.includes('estado') && (
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-300">Estado</th>
            )}
            {visibleColumns.proyectos.includes('fecha_inicio') && (
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-300">Fecha</th>
            )}
          </tr>
        </thead>
        <tbody>
          {getCurrentItems(proyectos).map((proyecto) => (
            <tr key={proyecto.id} className="border-t border-gray-600/50 table-row">
              {visibleColumns.proyectos.includes('id') && (
                <td className="px-2 sm:px-4 py-2 sm:py-3">{proyecto.id}</td>
              )}
              {visibleColumns.proyectos.includes('nombre') && (
                <td className="px-2 sm:px-4 py-2 sm:py-3 truncate max-w-[120px] sm:max-w-none">{proyecto.nombre}</td>
              )}
              {visibleColumns.proyectos.includes('estado') && (
                <td className="px-2 sm:px-4 py-2 sm:py-3">{proyecto.estado}</td>
              )}
              {visibleColumns.proyectos.includes('fecha_inicio') && (
                <td className="px-2 sm:px-4 py-2 sm:py-3">{proyecto.fecha_inicio}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Panel de control para vista de tablas/tarjetas
  const renderViewControls = () => {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <button 
            className={`view-toggle-button ${viewMode === 'table' ? 'active' : ''} ${isMobile ? 'view-toggle-table-button' : ''}`}
            onClick={() => toggleViewMode('table')}
            disabled={isMobile}
            title={isMobile ? "Vista de tabla no disponible en dispositivos móviles" : ""}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
            </svg>
            Tabla
          </button>
          <button 
            className={`view-toggle-button ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => toggleViewMode('cards')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2z"/>
              <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
            </svg>
            Tarjetas
          </button>
        </div>
        
        {viewMode === 'table' && !isMobile && (
          <ColumnToggle tab={activeTab} />
        )}

        <div className="flex items-center space-x-2">
          <select 
            className="bg-gray-800 border border-gray-700 text-gray-300 rounded-md py-1 px-2 text-sm"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Volver a la primera página al cambiar
            }}
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={15}>15 por página</option>
            <option value={20}>20 por página</option>
          </select>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="cyber-spinner"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'usuarios':
        return (
          <div className={`bg-gray-800/80 rounded-lg p-3 sm:p-6 panel-shadow ${isVisible ? 'appear-up' : 'opacity-0'} ${isMobile ? 'card-compact' : ''}`} style={{animationDelay: '0.3s'}}>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Lista de Usuarios</h3>
            
            {renderViewControls()}
            
            {viewMode === 'table' && !isMobile ? renderUserTable() : renderUsuarioCards(usuarios)}
            
            <Pagination totalItems={usuarios.length} />
          </div>
        );
      case 'investigadores':
        return (
          <div className={`bg-gray-800/80 rounded-lg p-3 sm:p-6 panel-shadow ${isVisible ? 'appear-up' : 'opacity-0'} ${isMobile ? 'card-compact' : ''}`} style={{animationDelay: '0.3s'}}>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Lista de Investigadores</h3>
            
            {renderViewControls()}
            
            {viewMode === 'table' && !isMobile ? renderInvestigadorTable() : renderInvestigadorCards(investigadores)}
            
            <Pagination totalItems={investigadores.length} />
          </div>
        );
      case 'proyectos':
        return (
          <div className={`bg-gray-800/80 rounded-lg p-3 sm:p-6 panel-shadow ${isVisible ? 'appear-up' : 'opacity-0'} ${isMobile ? 'card-compact' : ''}`} style={{animationDelay: '0.3s'}}>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Lista de Proyectos</h3>
            
            {renderViewControls()}
            
            {viewMode === 'table' && !isMobile ? renderProyectoTable() : renderProyectoCards(proyectos)}
            
            <Pagination totalItems={proyectos.length} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-4 pb-10 w-full px-2 sm:px-4">
      <h2 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 ${isVisible ? 'appear-up' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
        Panel de Control Administrativo
      </h2>
      
      <div className={`mb-4 sm:mb-8 flex justify-center ${isVisible ? 'appear-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
        <div className={`bg-gray-800/90 rounded-lg overflow-hidden shadow-lg panel-shadow ${isMobile && window.innerWidth <= 480 ? 'w-full' : ''}`}>
          <div className={`flex ${window.innerWidth <= 480 ? 'mobile-tabs' : 'border-b border-blue-500/30'}`}>
            <button
              className={`px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm focus:outline-none cursor-pointer tab-glow transition-all duration-300 
                ${activeTab === 'usuarios' ? 'active-tab text-white' : 'text-gray-300 hover:bg-gray-700/70'}`}
              onClick={() => {
                setActiveTab('usuarios');
                setCurrentPage(1); // Volver a la primera página al cambiar de tab
              }}
            >
              Usuarios
            </button>
            <button
              className={`px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm focus:outline-none cursor-pointer tab-glow transition-all duration-300 
                ${activeTab === 'investigadores' ? 'active-tab text-white' : 'text-gray-300 hover:bg-gray-700/70'}`}
              onClick={() => {
                setActiveTab('investigadores');
                setCurrentPage(1);
              }}
            >
              Investigadores
            </button>
            <button
              className={`px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm focus:outline-none cursor-pointer tab-glow transition-all duration-300 
                ${activeTab === 'proyectos' ? 'active-tab text-white' : 'text-gray-300 hover:bg-gray-700/70'}`}
              onClick={() => {
                setActiveTab('proyectos');
                setCurrentPage(1);
              }}
            >
              Proyectos
            </button>
          </div>
        </div>
      </div>
      
      {renderContent()}
      <ToastContainer />
    </div>
  );
}

export default AdminPanel;