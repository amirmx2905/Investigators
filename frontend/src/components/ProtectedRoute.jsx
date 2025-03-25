import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/home" />;
  }

  return children;
}

export default ProtectedRoute;