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

  useEffect(() => {
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
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'usuarios':
        return (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Lista de Usuarios</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700 rounded-lg">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Usuario</th>
                    <th className="px-4 py-3 text-left">Rol</th>
                    <th className="px-4 py-3 text-left">Activo</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="border-t border-gray-600">
                      <td className="px-4 py-3">{usuario.id}</td>
                      <td className="px-4 py-3">{usuario.nombre_usuario}</td>
                      <td className="px-4 py-3">{usuario.rol}</td>
                      <td className="px-4 py-3">
                        {usuario.activo ? (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                            Activo
                          </span>
                        ) : (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
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
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Lista de Investigadores</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700 rounded-lg">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Nombre</th>
                    <th className="px-4 py-3 text-left">Correo</th>
                    <th className="px-4 py-3 text-left">Activo</th>
                  </tr>
                </thead>
                <tbody>
                  {investigadores.map((investigador) => (
                    <tr key={investigador.id} className="border-t border-gray-600">
                      <td className="px-4 py-3">{investigador.id}</td>
                      <td className="px-4 py-3">{investigador.nombre}</td>
                      <td className="px-4 py-3">{investigador.correo}</td>
                      <td className="px-4 py-3">
                        {investigador.activo ? (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                            Activo
                          </span>
                        ) : (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
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
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Lista de Proyectos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700 rounded-lg">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Nombre</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                    <th className="px-4 py-3 text-left">Fecha Inicio</th>
                  </tr>
                </thead>
                <tbody>
                  {proyectos.map((proyecto) => (
                    <tr key={proyecto.id} className="border-t border-gray-600">
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
    <div className="mt-0 pt-0 pb-10 animate-fade-in w-full">
      <h2 className="text-3xl font-bold mb-6 text-center">Panel de Control Administrativo</h2>
      
      <div className="mb-6 flex justify-center">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="flex border-b border-gray-600">
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none cursor-pointer ${
                activeTab === 'usuarios' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('usuarios')}
            >
              Usuarios
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none cursor-pointer ${
                activeTab === 'investigadores' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('investigadores')}
            >
              Investigadores
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none cursor-pointer ${
                activeTab === 'proyectos' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
              }`}
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