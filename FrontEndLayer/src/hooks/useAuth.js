import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { login, logout, getMe } from '../store/auth/authThunks';
import { clearAuthError } from '../store/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: useCallback((creds) => dispatch(login(creds)), [dispatch]),
    logout: useCallback(() => dispatch(logout()), [dispatch]),
    checkSession: useCallback(() => dispatch(getMe()), [dispatch]),
    clearError: useCallback(() => dispatch(clearAuthError()), [dispatch]),
  };
};
