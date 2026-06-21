import { useAuth } from './useAuth';

export const useRoleAccess = (allowedRoles) => {
  const { user, isAuthenticated, loading } = useAuth();
  const hasAccess = isAuthenticated && allowedRoles.includes(user?.role);

  return { isAuthenticated, hasAccess, loading, user };
};
