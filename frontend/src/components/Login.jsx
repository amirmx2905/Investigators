import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      navigate('/home');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/token/`, {
        username,
        password,
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setError('');
      alert('Inicio de sesión exitoso');
      navigate('/home');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Credenciales inválidas. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 transition duration-500"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default Login;