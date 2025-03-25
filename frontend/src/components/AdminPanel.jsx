import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUsuarios, getInvestigadores, getProyectos } from '../api';

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [investigadores, setInvestigadores] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [activeTab, setActiveTab] = useState('usuarios');
  // eslint-disable-next-line no-unused-vars
  const [previousTab, setPreviousTab] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  const [visibleColumns, setVisibleColumns] = useState({
    usuarios: ['id', 'nombre_usuario', 'rol', 'activo'],
    investigadores: ['id', 'nombre', 'correo', 'activo'],
    proyectos: ['id', 'nombre', 'estado', 'fecha_inicio']
  });
  
  const [viewMode, setViewMode] = useState('table');
  
  // eslint-disable-next-line no-unused-vars
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionClass, setTransitionClass] = useState('');
  const [tabTransitioning, setTabTransitioning] = useState(false);
  
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);

  const columnToggleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkMobile = throttle(() => {
      const mobile = window.innerWidth < 768;
      if (mobile !== isMobile) {
        setIsMobile(mobile);
        
        if (mobile && viewMode === 'table') {
          setViewMode('cards');
        }
      }
    }, 200);
    
    checkMobile();
    
    let resizeObserver;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(throttle(() => {
        checkMobile();
      }, 200));
      resizeObserver.observe(document.body);
    } else {
      window.addEventListener('resize', checkMobile);
    }

    const handleClickOutside = (event) => {
      if (columnToggleRef.current && !columnToggleRef.current.contains(event.target)) {
        setColumnsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

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
          autoClose: 3000,
          limit: 3
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      clearTimeout(timer);
      
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', checkMobile);
      }
      
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, viewMode]);

  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const toggleColumn = useCallback((tab, column) => {
    setVisibleColumns(prev => {
      const current = [...prev[tab]];
      
      if (current.includes(column)) {
        if (current.length > 1) {
          return { ...prev, [tab]: current.filter(col => col !== column) };
        }
        return prev;
      } else {
        return { ...prev, [tab]: [...current, column] };
      }
    });
  }, []);

  const changeTab = useCallback((tab) => {
    if (tab === activeTab) return;
    
    setPreviousTab(activeTab);
    
    const contentHeight = contentRef.current?.offsetHeight || 0;
    if (contentRef.current) {
      contentRef.current.style.minHeight = `${contentHeight}px`;
    }
    
    setTabTransitioning(true);
    setTransitionClass('opacity-0 scale-95');
    
    setTimeout(() => {
      setActiveTab(tab);
      setCurrentPage(1);
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          setTransitionClass('');
          
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.style.minHeight = '';
            }
            setTabTransitioning(false);
          }, 300);
        }, 50);
      });
    }, 300);
  }, [activeTab]);

  const toggleViewMode = useCallback((mode) => {
    if (mode === 'table' && isMobile) return;
    if (mode === viewMode) return;
    
    const contentHeight = contentRef.current?.offsetHeight || 0;
    
    if (contentRef.current) {
      contentRef.current.style.minHeight = `${contentHeight}px`;
    }
    
    setTransitionClass(viewMode === 'table' ? 'opacity-0 translate-x-5' : 'opacity-0 translate-y-5');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setViewMode(mode);
      
      setTransitionClass(mode === 'table' ? 'opacity-0 -translate-x-5' : 'opacity-0 -translate-y-5');
      
      requestAnimationFrame(() => {
        setTransitionClass('');
        
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.style.minHeight = '';
          }
          setIsTransitioning(false);
        }, 300);
      });
    }, 150);
  }, [isMobile, viewMode]);

  const getCurrentItems = useCallback((items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, itemsPerPage]);

  const ColumnSelector = useMemo(() => {
    return function ColumnSelectorComponent({ tab }) {
      const columnLabels = {
        usuarios: {
          id: 'ID',
          nombre_usuario: 'Usuario',
          rol: 'Rol',
          activo: 'Estado'
        },
        investigadores: {
          id: 'ID',
          nombre: 'Nombre',
          correo: 'Correo',
          activo: 'Estado'
        },
        proyectos: {
          id: 'ID',
          nombre: 'Nombre',
          estado: 'Estado',
          fecha_inicio: 'Fecha Inicio'
        }
      };

      return (
        <div className="relative" ref={columnToggleRef}>
          <button
            onClick={() => setColumnsDropdownOpen(!columnsDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-gray-800/70 border border-blue-500/30 text-blue-300 cursor-pointer hover:bg-gray-700/70 hover:border-blue-500/50 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.5 2h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1z"/>
            </svg>
            Columnas
          </button>
          {columnsDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg border border-blue-500/30 z-20 animate-fadeIn">
              {Object.keys(columnLabels[tab]).map(column => (
                <label key={column} className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
                    checked={visibleColumns[tab].includes(column)}
                    onChange={() => toggleColumn(tab, column)}
                  />
                  <span className="text-sm text-gray-300">{columnLabels[tab][column]}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      );
    };
  }, [columnsDropdownOpen, visibleColumns, toggleColumn]);

  const Pagination = useMemo(() => {
    return ({ totalItems }) => {
      const pageNumbers = [];
      const totalPages = Math.ceil(totalItems / itemsPerPage);
  
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + 4);
      
      if (endPage - startPage < 4 && startPage > 1) {
        startPage = Math.max(1, endPage - 4);
      }
  
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
  
      return (
        <div className="flex justify-center items-center mt-6 flex-wrap gap-2">
          <button 
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className="bg-gray-800/70 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-md text-sm min-w-10 text-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-700/70 hover:border-blue-500/50 transition-colors duration-200"
          >
            &laquo;
          </button>
          <button 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-800/70 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-md text-sm min-w-10 text-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-700/70 hover:border-blue-500/50 transition-colors duration-200"
          >
            &lt;
          </button>
          
          {startPage > 1 && (
            <>
              <button onClick={() => paginate(1)} className="bg-gray-800/70 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-md text-sm min-w-10 text-center cursor-pointer hover:bg-gray-700/70 hover:border-blue-500/50 transition-colors duration-200">1</button>
              {startPage > 2 && <span className="text-gray-400">...</span>}
            </>
          )}
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1.5 rounded-md text-sm min-w-10 text-center cursor-pointer transition-all duration-200 ${
                currentPage === number 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md'
                  : 'bg-gray-800/70 border border-blue-500/30 text-blue-300 hover:bg-gray-700/70 hover:border-blue-500/60'
              }`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
              <button onClick={() => paginate(totalPages)} className="bg-gray-800/70 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-md text-sm min-w-10 text-center cursor-pointer hover:bg-gray-700/70 hover:border-blue-500/50 transition-colors duration-200">{totalPages}</button>
            </>
          )}
          
          <button 
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-800/70 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-md text-sm min-w-10 text-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-700/70 hover:border-blue-500/50 transition-colors duration-200"
          >
            &gt;
          </button>
          <button 
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className="bg-gray-800/70 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-md text-sm min-w-10 text-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-700/70 hover:border-blue-500/50 transition-colors duration-200"
          >
            &raquo;
          </button>
        </div>
      );
    };
  }, [currentPage, itemsPerPage, paginate]);

  const UsuarioCards = useMemo(() => {
    return function UsuarioCardsComponent({items}) {
      return getCurrentItems(items).map((usuario) => (
        <div 
          key={usuario.id} 
          className="bg-gray-800/70 rounded-lg border border-blue-500/20 p-4 mb-4 hover:shadow-lg hover:-translate-y-1 hover:border-blue-500/40 transition-all duration-300"
        >
          <div className="text-xs text-blue-300 mb-1 font-medium">ID</div>
          <div className="text-sm text-white mb-3">{usuario.id}</div>
          
          <div className="text-xs text-blue-300 mb-1 font-medium">Usuario</div>
          <div className="text-sm text-white mb-3">{usuario.nombre_usuario}</div>
          
          <div className="text-xs text-blue-300 mb-1 font-medium">Rol</div>
          <div className="text-sm text-white mb-3">{usuario.rol}</div>
          
          <div className="text-xs text-blue-300 mb-1 font-medium">Estado</div>
          <div className="text-sm text-white">
            {usuario.activo ? (
              <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">
                Activo
              </span>
            ) : (
              <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                Inactivo
              </span>
            )}
          </div>
        </div>
      ));
    };
  }, [getCurrentItems]);

  const InvestigadorCards = useMemo(() => {
    return function InvestigadorCardsComponent({items}) {
      return getCurrentItems(items).map((investigador) => (
        <div 
          key={investigador.id} 
          className="bg-gray-800/70 rounded-lg border border-blue-500/20 p-4 mb-4 hover:shadow-lg hover:-translate-y-1 hover:border-blue-500/40 transition-all duration-300"
        >
          <div className="text-xs text-blue-300 mb-1 font-medium">ID</div>
          <div className="text-sm text-white mb-3">{investigador.id}</div>
          
          <div className="text-xs text-blue-300 mb-1 font-medium">Nombre</div>
          <div className="text-sm text-white mb-3">{investigador.nombre}</div>
          
          <div className="text-xs text-blue-300 mb-1 font-medium">Correo</div>
          <div className="text-sm text-white mb-3">{investigador.correo}</div>
          
          <div className="text-xs text-blue-300 mb-1 font-medium">Estado</div>
          <div className="text-sm text-white">
            {investigador.activo ? (
              <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">
                Activo
              </span>
            ) : (
              <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                Inactivo
              </span>
            )}
          </div>
        </div>
      ));
    };
  }, [getCurrentItems]);

  const ProyectoCards = useMemo(() => {
    return function ProyectoCardsComponent({items}) {
      return getCurrentItems(items).map((proyecto) => (
        <div 
          key={proyecto.id} 
          className="bg-gray-800/70 rounded-lg border border-blue-500/20 p-4 mb-4 hover:shadow-lg hover:-translate-y-1 hover:border-blue-500/40 transition-all duration-300"
        >
          <div className="text-xs text-blue-300 mb-1 font-medium">ID</div>
          <div className="text-sm text-white mb-3">{proyecto.id}</div>
          
          <div className="text-xs text-blue-300 mb-1 font-medium">Nombre</div>
          <div className="text-sm text-white mb-3">{proyecto.nombre}</div>
          
          <div className="text-xs text-blue-300 mb-1 font-medium">Estado</div>
          <div className="text-sm text-white mb-3">
            <span className={`px-2 py-0.5 rounded-full text-xs text-white ${
              proyecto.estado === 'Activo' ? 'bg-green-500' :
              proyecto.estado === 'Pausado' ? 'bg-yellow-500' :
              proyecto.estado === 'Finalizado' ? 'bg-blue-500' : 'bg-gray-500'
            }`}>
              {proyecto.estado}
            </span>
          </div>
          
          <div className="text-xs text-blue-300 mb-1 font-medium">Fecha Inicio</div>
          <div className="text-sm text-white">{proyecto.fecha_inicio}</div>
        </div>
      ));
    };
  }, [getCurrentItems]);

  const UsuarioTable = useMemo(() => {
    return function UsuarioTableComponent() {
      return (
        <div className="overflow-x-auto mt-2">
          <table className="min-w-full bg-gray-700/80 rounded-lg">
            <thead className="bg-gradient-to-r from-gray-800/80 to-blue-900/80 border-b border-blue-500/30 sticky top-0 z-10">
              <tr>
                {visibleColumns.usuarios.includes('id') && (
                  <th className="px-4 py-3 text-left text-blue-300">ID</th>
                )}
                {visibleColumns.usuarios.includes('nombre_usuario') && (
                  <th className="px-4 py-3 text-left text-blue-300">Usuario</th>
                )}
                {visibleColumns.usuarios.includes('rol') && (
                  <th className="px-4 py-3 text-left text-blue-300">Rol</th>
                )}
                {visibleColumns.usuarios.includes('activo') && (
                  <th className="px-4 py-3 text-left text-blue-300">Estado</th>
                )}
              </tr>
            </thead>
            <tbody>
              {getCurrentItems(usuarios).map((usuario) => (
                <tr 
                  key={usuario.id} 
                  className="border-t border-gray-600/50 hover:bg-blue-500/5 transition-colors duration-200"
                >
                  {visibleColumns.usuarios.includes('id') && (
                    <td className="px-4 py-3">{usuario.id}</td>
                  )}
                  {visibleColumns.usuarios.includes('nombre_usuario') && (
                    <td className="px-4 py-3">{usuario.nombre_usuario}</td>
                  )}
                  {visibleColumns.usuarios.includes('rol') && (
                    <td className="px-4 py-3">{usuario.rol}</td>
                  )}
                  {visibleColumns.usuarios.includes('activo') && (
                    <td className="px-4 py-3">
                      {usuario.activo ? (
                        <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">
                          Activo
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
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
    };
  }, [getCurrentItems, usuarios, visibleColumns.usuarios]);

  const InvestigadorTable = useMemo(() => {
    return function InvestigadorTableComponent() {
      return (
        <div className="overflow-x-auto mt-2">
          <table className="min-w-full bg-gray-700/80 rounded-lg">
            <thead className="bg-gradient-to-r from-gray-800/80 to-blue-900/80 border-b border-blue-500/30 sticky top-0 z-10">
              <tr>
                {visibleColumns.investigadores.includes('id') && (
                  <th className="px-4 py-3 text-left text-blue-300">ID</th>
                )}
                {visibleColumns.investigadores.includes('nombre') && (
                  <th className="px-4 py-3 text-left text-blue-300">Nombre</th>
                )}
                {visibleColumns.investigadores.includes('correo') && (
                  <th className="px-4 py-3 text-left text-blue-300">Correo</th>
                )}
                {visibleColumns.investigadores.includes('activo') && (
                  <th className="px-4 py-3 text-left text-blue-300">Estado</th>
                )}
              </tr>
            </thead>
            <tbody>
              {getCurrentItems(investigadores).map((investigador) => (
                <tr 
                  key={investigador.id} 
                  className="border-t border-gray-600/50 hover:bg-blue-500/5 transition-colors duration-200"
                >
                  {visibleColumns.investigadores.includes('id') && (
                    <td className="px-4 py-3">{investigador.id}</td>
                  )}
                  {visibleColumns.investigadores.includes('nombre') && (
                    <td className="px-4 py-3">{investigador.nombre}</td>
                  )}
                  {visibleColumns.investigadores.includes('correo') && (
                    <td className="px-4 py-3">{investigador.correo}</td>
                  )}
                  {visibleColumns.investigadores.includes('activo') && (
                    <td className="px-4 py-3">
                      {investigador.activo ? (
                        <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">
                          Activo
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
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
    };
  }, [getCurrentItems, investigadores, visibleColumns.investigadores]);

  const ProyectoTable = useMemo(() => {
    return function ProyectoTableComponent() {
      return (
        <div className="overflow-x-auto mt-2">
          <table className="min-w-full bg-gray-700/80 rounded-lg">
            <thead className="bg-gradient-to-r from-gray-800/80 to-blue-900/80 border-b border-blue-500/30 sticky top-0 z-10">
              <tr>
                {visibleColumns.proyectos.includes('id') && (
                  <th className="px-4 py-3 text-left text-blue-300">ID</th>
                )}
                {visibleColumns.proyectos.includes('nombre') && (
                  <th className="px-4 py-3 text-left text-blue-300">Nombre</th>
                )}
                {visibleColumns.proyectos.includes('estado') && (
                  <th className="px-4 py-3 text-left text-blue-300">Estado</th>
                )}
                {visibleColumns.proyectos.includes('fecha_inicio') && (
                  <th className="px-4 py-3 text-left text-blue-300">Fecha Inicio</th>
                )}
              </tr>
            </thead>
            <tbody>
              {getCurrentItems(proyectos).map((proyecto) => (
                <tr 
                  key={proyecto.id} 
                  className="border-t border-gray-600/50 hover:bg-blue-500/5 transition-colors duration-200"
                >
                  {visibleColumns.proyectos.includes('id') && (
                    <td className="px-4 py-3">{proyecto.id}</td>
                  )}
                  {visibleColumns.proyectos.includes('nombre') && (
                    <td className="px-4 py-3">{proyecto.nombre}</td>
                  )}
                  {visibleColumns.proyectos.includes('estado') && (
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs text-white ${
                        proyecto.estado === 'Activo' ? 'bg-green-500' :
                        proyecto.estado === 'Pausado' ? 'bg-yellow-500' :
                        proyecto.estado === 'Finalizado' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
                        {proyecto.estado}
                      </span>
                    </td>
                  )}
                  {visibleColumns.proyectos.includes('fecha_inicio') && (
                    <td className="px-4 py-3">{proyecto.fecha_inicio}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };
  }, [getCurrentItems, proyectos, visibleColumns.proyectos]);

  return (
    <div className="mt-4 pb-10 w-full px-2 sm:px-4 transition-opacity duration-300 ease-in-out overflow-x-hidden">
      {/* Título principal */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-fadeIn">
        Panel de Control Administrativo
      </h2>
  
      {/* Navegación de tabs */}
      <div className="mb-6 flex justify-center animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="bg-gray-800/90 rounded-lg overflow-hidden shadow-lg border border-blue-500/30">
          <div className={`flex ${window.innerWidth <= 480 ? 'flex-col w-full' : 'border-b border-blue-500/30'}`}>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none cursor-pointer transition-all duration-300 ${
                activeTab === 'usuarios'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-700/70'
              }`}
              onClick={() => changeTab('usuarios')}
            >
              Usuarios
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none cursor-pointer transition-all duration-300 ${
                activeTab === 'investigadores'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-700/70'
              }`}
              onClick={() => changeTab('investigadores')}
            >
              Investigadores
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none cursor-pointer transition-all duration-300 ${
                activeTab === 'proyectos'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-700/70'
              }`}
              onClick={() => changeTab('proyectos')}
            >
              Proyectos
            </button>
          </div>
        </div>
      </div>
  
      {/* Contenido principal */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-gray-800/80 rounded-lg p-6 border border-blue-500/30 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          {/* Título de sección */}
          <h3 className={`text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 transform transition-all duration-300 ${tabTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {activeTab === 'usuarios' && 'Lista de Usuarios'}
            {activeTab === 'investigadores' && 'Lista de Investigadores'}
            {activeTab === 'proyectos' && 'Lista de Proyectos'}
          </h3>
  
          {/* Controles de visualización */}
          <div className={`flex flex-wrap items-center justify-between gap-2 mb-4 transform transition-all duration-300 ${tabTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="flex items-center space-x-2">
              <button
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-gray-800/70 border border-blue-500/30 text-blue-300 hover:bg-gray-700/70 hover:border-blue-500/50'
                } ${isMobile ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => toggleViewMode('table')}
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
                  viewMode === 'cards'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-gray-800/70 border border-blue-500/30 text-blue-300 hover:bg-gray-700/70 hover:border-blue-500/50'
                }`}
                onClick={() => toggleViewMode('cards')}
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
  
              {/* Mostrar selector de columnas solo en modo tabla y no móvil */}
              {viewMode === 'table' && !isMobile && <ColumnSelector tab={activeTab} />}
            </div>
  
            <select
              className="bg-gray-800 border border-gray-700 text-gray-300 rounded-md py-1 px-2 text-sm cursor-pointer transition-colors duration-200 hover:border-blue-500/30"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={15}>15 por página</option>
              <option value={20}>20 por página</option>
            </select>
          </div>
  
          {/* Contenedor del contenido con transición */}
          <div 
            ref={contentRef} 
            className="relative transition-all duration-300 ease-in-out"
          >
            {/* Contenido dinámico */}
            {/* Usuarios */}
            {activeTab === 'usuarios' && (
              <div className={`transform transition-all duration-300 ease-in-out ${transitionClass}`}>
                {viewMode === 'table' && !isMobile ? (
                  <UsuarioTable />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <UsuarioCards items={usuarios} />
                  </div>
                )}
                <Pagination totalItems={usuarios.length} />
              </div>
            )}
  
            {/* Investigadores */}
            {activeTab === 'investigadores' && (
              <div className={`transform transition-all duration-300 ease-in-out ${transitionClass}`}>
                {viewMode === 'table' && !isMobile ? (
                  <InvestigadorTable />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InvestigadorCards items={investigadores} />
                  </div>
                )}
                <Pagination totalItems={investigadores.length} />
              </div>
            )}
  
            {/* Proyectos */}
            {activeTab === 'proyectos' && (
              <div className={`transform transition-all duration-300 ease-in-out ${transitionClass}`}>
                {viewMode === 'table' && !isMobile ? (
                  <ProyectoTable />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ProyectoCards items={proyectos} />
                  </div>
                )}
                <Pagination totalItems={proyectos.length} />
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer limit={3} />
    </div>
  );
}

export default AdminPanel;