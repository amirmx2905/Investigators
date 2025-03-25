import { useState, useEffect } from 'react';
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

  useEffect(() => {
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
      
      .panel-shadow {
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.3);
        backdrop-filter: blur(4px);
      }
      
      .table-header {
        background: linear-gradient(90deg, rgba(31, 41, 55, 0.8), rgba(30, 58, 138, 0.8));
        border-bottom: 1px solid rgba(59, 130, 246, 0.3);
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
    };
  }, []);

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
          <div className={`bg-gray-800/80 rounded-lg p-6 panel-shadow ${isVisible ? 'appear-up' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
            <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Lista de Usuarios</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700/80 rounded-lg backdrop-blur-sm">
                <thead className="table-header">
                  <tr>
                    <th className="px-4 py-3 text-left text-blue-300">ID</th>
                    <th className="px-4 py-3 text-left text-blue-300">Usuario</th>
                    <th className="px-4 py-3 text-left text-blue-300">Rol</th>
                    <th className="px-4 py-3 text-left text-blue-300">Activo</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="border-t border-gray-600/50 table-row">
                      <td className="px-4 py-3">{usuario.id}</td>
                      <td className="px-4 py-3">{usuario.nombre_usuario}</td>
                      <td className="px-4 py-3">{usuario.rol}</td>
                      <td className="px-4 py-3">
                        {usuario.activo ? (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs status-badge">
                            Activo
                          </span>
                        ) : (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs status-badge">
                            Inactivo
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'investigadores':
        return (
          <div className={`bg-gray-800/80 rounded-lg p-6 panel-shadow ${isVisible ? 'appear-up' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
            <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Lista de Investigadores</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700/80 rounded-lg backdrop-blur-sm">
                <thead className="table-header">
                  <tr>
                    <th className="px-4 py-3 text-left text-blue-300">ID</th>
                    <th className="px-4 py-3 text-left text-blue-300">Nombre</th>
                    <th className="px-4 py-3 text-left text-blue-300">Correo</th>
                    <th className="px-4 py-3 text-left text-blue-300">Activo</th>
                  </tr>
                </thead>
                <tbody>
                  {investigadores.map((investigador) => (
                    <tr key={investigador.id} className="border-t border-gray-600/50 table-row">
                      <td className="px-4 py-3">{investigador.id}</td>
                      <td className="px-4 py-3">{investigador.nombre}</td>
                      <td className="px-4 py-3">{investigador.correo}</td>
                      <td className="px-4 py-3">
                        {investigador.activo ? (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs status-badge">
                            Activo
                          </span>
                        ) : (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs status-badge">
                            Inactivo
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'proyectos':
        return (
          <div className={`bg-gray-800/80 rounded-lg p-6 panel-shadow ${isVisible ? 'appear-up' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
            <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Lista de Proyectos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700/80 rounded-lg backdrop-blur-sm">
                <thead className="table-header">
                  <tr>
                    <th className="px-4 py-3 text-left text-blue-300">ID</th>
                    <th className="px-4 py-3 text-left text-blue-300">Nombre</th>
                    <th className="px-4 py-3 text-left text-blue-300">Estado</th>
                    <th className="px-4 py-3 text-left text-blue-300">Fecha Inicio</th>
                  </tr>
                </thead>
                <tbody>
                  {proyectos.map((proyecto) => (
                    <tr key={proyecto.id} className="border-t border-gray-600/50 table-row">
                      <td className="px-4 py-3">{proyecto.id}</td>
                      <td className="px-4 py-3">{proyecto.nombre}</td>
                      <td className="px-4 py-3">{proyecto.estado}</td>
                      <td className="px-4 py-3">{proyecto.fecha_inicio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-4 pb-10 w-full">
      <h2 className={`text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 ${isVisible ? 'appear-up' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
        Panel de Control Administrativo
      </h2>
      
      <div className={`mb-8 flex justify-center ${isVisible ? 'appear-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
        <div className="bg-gray-800/90 rounded-lg overflow-hidden shadow-lg panel-shadow">
          <div className="flex border-b border-blue-500/30">
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none cursor-pointer tab-glow transition-all duration-300 
                ${activeTab === 'usuarios' ? 'active-tab text-white' : 'text-gray-300 hover:bg-gray-700/70'}`}
              onClick={() => setActiveTab('usuarios')}
            >
              Usuarios
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none cursor-pointer tab-glow transition-all duration-300 
                ${activeTab === 'investigadores' ? 'active-tab text-white' : 'text-gray-300 hover:bg-gray-700/70'}`}
              onClick={() => setActiveTab('investigadores')}
            >
              Investigadores
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none cursor-pointer tab-glow transition-all duration-300 
                ${activeTab === 'proyectos' ? 'active-tab text-white' : 'text-gray-300 hover:bg-gray-700/70'}`}
              onClick={() => setActiveTab('proyectos')}
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