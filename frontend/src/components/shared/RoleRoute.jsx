import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardPath } from '../../constants';

function RoleRoute({ roles, children }) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }

  return children;
}

export default RoleRoute;
