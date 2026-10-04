import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/auth-store';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error, initAuth, login, logout, register, loginAsDemo } =
    useAuthStore();

  // Initialize auth on mount (restore from localStorage)
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const handleLoginAsDemo = useCallback(() => {
    loginAsDemo();
  }, [loginAsDemo]);

  const handleLogin = useCallback(
    async (email?: string, password?: string) => {
      await login(email, password);
    },
    [login]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleRegister = useCallback(
    async (email?: string, password?: string, name?: string) => {
      await register(email, password, name);
    },
    [register]
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    loginAsDemo: handleLoginAsDemo,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    initAuth,
  };
};
