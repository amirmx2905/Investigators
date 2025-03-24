import { useEffect, useState } from 'react';
import { getInvestigadores, getUsuarios, getProyectos } from './api';

function App() {
  const [investigadores, setInvestigadores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const investigadoresData = await getInvestigadores();
        const usuariosData = await getUsuarios();
        const proyectosData = await getProyectos();

        setInvestigadores(investigadoresData);
        setUsuarios(usuariosData);
        setProyectos(proyectosData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Investigators</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">Investigadores</h2>
        <ul>
          {investigadores.map((investigador) => (
            <li key={investigador.id}>{investigador.nombre}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">Usuarios</h2>
        <ul>
          {usuarios.map((usuario) => (
            <li key={usuario.id}>{usuario.nombre_usuario}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Proyectos</h2>
        <ul>
          {proyectos.map((proyecto) => (
            <li key={proyecto.id}>{proyecto.nombre}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;