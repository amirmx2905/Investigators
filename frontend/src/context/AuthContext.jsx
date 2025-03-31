import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/apiConfig';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await api.get('/usuarios/me/');
        setCurrentUser({
          id: response.data.id,
          username: response.data.nombre_usuario,
          role: response.data.rol
        });
      } catch (error) {
        console.log('Error: ' + error)
        console.log('No hay sesión activa');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (nombre_usuario, contrasena) => {
    try {
      const response = await api.post('/token/', {
        nombre_usuario,
        contrasena
      });
      
      setCurrentUser({
        username: response.data.username,
        role: response.data.role
      });
      
      const userResponse = await api.get('/usuarios/me/');
      setCurrentUser({
        id: userResponse.data.id,
        username: userResponse.data.nombre_usuario,
        role: userResponse.data.rol
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/token/logout/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setCurrentUser(null);
    }
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const value = {
    currentUser,
    isAdmin,
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;