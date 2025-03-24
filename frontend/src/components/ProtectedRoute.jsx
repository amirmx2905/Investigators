import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const accessToken = localStorage.getItem('access_token');

  if (!accessToken) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;