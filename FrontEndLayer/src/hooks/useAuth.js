import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { login, register, forgotPasswordAction, logout, getMe } from '../store/auth/authThunks';
import { clearAuthError, resetForgotPasswordState } from '../store/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, forgotPasswordLoading, forgotPasswordSuccess } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    forgotPasswordLoading,
    forgotPasswordSuccess,
    login: useCallback((creds) => dispatch(login(creds)), [dispatch]),
    register: useCallback((data) => dispatch(register(data)), [dispatch]),
    forgotPassword: useCallback((data) => dispatch(forgotPasswordAction(data)), [dispatch]),
    logout: useCallback(() => dispatch(logout()), [dispatch]),
    checkSession: useCallback(() => dispatch(getMe()), [dispatch]),
    clearError: useCallback(() => dispatch(clearAuthError()), [dispatch]),
    resetForgotPassword: useCallback(() => dispatch(resetForgotPasswordState()), [dispatch]),
  };
};
