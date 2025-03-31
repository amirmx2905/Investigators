import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/apiConfig';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          
          if (decoded.exp * 1000 < Date.now()) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              try {
                const response = await api.post('/token/refresh/', {
                  refresh: refreshToken
                });
                localStorage.setItem('access_token', response.data.access);
                
                const newDecoded = jwtDecode(response.data.access);
                setCurrentUser({
                  id: newDecoded.usuario_id,
                  username: newDecoded.nombre_usuario,
                  role: newDecoded.rol
                });
              } catch (error) {
                console.log('Error al renovar el token:', error);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setCurrentUser(null);
              }
            } else {
              // Sin refresh token, limpiar tokens
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              setCurrentUser(null);
            }
          } else {
            // Token válido, establecer usuario
            setCurrentUser({
              id: decoded.usuario_id,
              username: decoded.nombre_usuario,
              role: decoded.rol
            });
          }
        } catch (error) {
          console.error('Error al decodificar el token:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (nombre_usuario, contrasena) => {
    try {
      const response = await api.post('/token/', {
        nombre_usuario,
        contrasena
      });
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      const decoded = jwtDecode(response.data.access);
      
      setCurrentUser({
        id: decoded.usuario_id,
        username: decoded.nombre_usuario,
        role: decoded.rol
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('toastShown');
    setCurrentUser(null);
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