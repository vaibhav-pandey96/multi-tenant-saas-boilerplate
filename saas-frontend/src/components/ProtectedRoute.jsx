import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // Not logged in → go to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Wrong role → go to dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default ProtectedRoute;