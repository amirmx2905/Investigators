import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

function ColumnSelector({ 
  activeTab, 
  columnsDropdownOpen, 
  setColumnsDropdownOpen, 
  visibleColumns, 
  toggleColumn, 
  columnToggleRef 
}) {
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [portalContainer, setPortalContainer] = useState(null);
  const menuRef = useRef(null);
  
  // Orden fijo de columnas por pestaña
  const columnOrders = {
    usuarios: ['id', 'nombre_usuario', 'rol', 'vinculado_a', 'activo'],
    investigadores: ['id', 'nombre', 'correo', 'celular', 'area', 'especialidad', 'nivel_snii', 'activo'],
    proyectos: ['id', 'nombre', 'estado', 'lider', 'fecha_inicio', 'fecha_fin', 'explicacion']
  };
  
  // Etiquetas para las columnas
  const columnLabels = {
    usuarios: {
      id: 'ID',
      nombre_usuario: 'Usuario',
      rol: 'Rol',
      vinculado_a: 'Vinculado a',
      activo: 'Estado'
    },
    investigadores: {
      id: 'ID',
      nombre: 'Nombre',
      correo: 'Correo',
      celular: 'Celular',         
      area: 'Área',               
      especialidad: 'Especialidad',
      nivel_snii: 'Nivel SNII',   
      activo: 'Estado'
    },
    proyectos: {
      id: 'ID',
      nombre: 'Nombre',
      estado: 'Estado',
      lider: 'Líder',
      fecha_inicio: 'Fecha Inicio',
      fecha_fin: 'Fecha Fin',
      explicacion: 'Descripción'
    }
  };

  // Crear un nodo para el portal
  useEffect(() => {
    if (!document.getElementById('column-menu-portal')) {
      const portalNode = document.createElement('div');
      portalNode.id = 'column-menu-portal';
      document.body.appendChild(portalNode);
      setPortalContainer(portalNode);
    } else {
      setPortalContainer(document.getElementById('column-menu-portal'));
    }
    
    return () => {
      const portalNode = document.getElementById('column-menu-portal');
      if (portalNode) {
        document.body.removeChild(portalNode);
      }
    };
  }, []);

  // Actualizar posición del menú cuando se abre
  useEffect(() => {
    if (columnsDropdownOpen && columnToggleRef.current) {
      const rect = columnToggleRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
  }, [columnsDropdownOpen, columnToggleRef]);

  // Cerrar el menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) && 
        columnToggleRef.current && 
        !columnToggleRef.current.contains(event.target)
      ) {
        setColumnsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setColumnsDropdownOpen, columnToggleRef]);

  // Manejar cambio de checkbox sin cerrar el menú
  // eslint-disable-next-line no-unused-vars
  const handleCheckboxChange = (tab, column, event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleColumn(tab, column);
  };

  return (
    <>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-gray-800/70 border border-blue-500/30 text-blue-300 hover:bg-gray-700/70 hover:border-blue-500/50 cursor-pointer transition-all duration-200"
        onClick={(e) => {
          e.stopPropagation();
          setColumnsDropdownOpen(!columnsDropdownOpen);
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          fill="currentColor" 
          viewBox="0 0 16 16"
        >
          <path d="M3.5 2h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1zm5-10h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1zm5-10h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm0 5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1z" />
        </svg>
        Columnas
      </button>
      
      {columnsDropdownOpen && portalContainer && ReactDOM.createPortal(
        <div 
          ref={menuRef}
          className="fixed bg-gray-800 rounded-md shadow-lg border border-blue-500/30 animate-fadeIn w-48"
          id="column-dropdown"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease-out forwards',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-2 text-sm font-medium text-gray-300 border-b border-gray-700">
            Seleccionar columnas
          </div>
          
          {/* Usar el orden definido para mostrar las opciones en orden fijo */}
          {columnOrders[activeTab].map(column => (
            <div 
              key={column} 
              className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleColumn(activeTab, column);
              }}
            >
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
                checked={visibleColumns[activeTab].includes(column)}
                onChange={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-sm text-gray-300">{columnLabels[activeTab][column]}</span>
            </div>
          ))}
        </div>,
        portalContainer
      )}
    </>
  );
}

export default ColumnSelector;