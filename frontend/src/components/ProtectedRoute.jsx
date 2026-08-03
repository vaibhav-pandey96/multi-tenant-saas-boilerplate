import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {

  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route requires specific role
  if (allowedRoles && !allowedRoles.includes(user.role)) {

    switch (user.role) {

      case 'SUPER_ADMIN':
        return <Navigate to="/superadmin" replace />;

      case 'ADMIN':
        return <Navigate to="/admin" replace />;

      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;