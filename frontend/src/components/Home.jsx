import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center animate-fade-in">
        Bienvenido a la Página Principal
      </h1>
      <p className="text-lg mb-8 text-gray-400 text-center">
        Explora las funcionalidades de la aplicación.
      </p>
      <button
        onClick={handleLogout}
        className="cursor-pointer bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition duration-300 transform hover:scale-105"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

export default Home;