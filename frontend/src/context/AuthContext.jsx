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
        if (error.response && error.response.status !== 404) {
          console.error('Error al verificar sesión:', error.message);
        }
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (nombre_usuario, contrasena) => {
    try {
      await api.post('/token/', {
        nombre_usuario,
        contrasena
      });
      
      try {
        const userResponse = await api.get('/usuarios/me/');
        setCurrentUser({
          id: userResponse.data.id,
          username: userResponse.data.nombre_usuario,
          role: userResponse.data.rol
        });
      } catch (userError) {
        console.log('Error al obtener información del usuario:', userError.message);
        console.warn('No se pudo obtener la información del usuario');
        
        setCurrentUser({
          username: nombre_usuario,
          role: 'user'
        });
      }
      
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