import { Navigate, Outlet } from 'react-router-dom';
import { useRoleAccess } from '../hooks/useRoleAccess';
import { ROUTES } from './RoutePaths';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, hasAccess, loading } = useRoleAccess(allowedRoles);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!hasAccess) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return <Outlet />;
};
