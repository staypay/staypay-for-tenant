import { useEffect } from 'react';
import { useAuthStore } from '@store/authStore';
import { authManager } from '@lib/auth/AuthManager';
import type { AuthProvider } from '@/types/auth.types';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    checkAuth,
    clearError,
  } = useAuthStore();

  useEffect(() => {
    // Check authentication status on mount
    checkAuth();
  }, [checkAuth]);

  const login = async (provider: AuthProvider) => {
    try {
      await authManager.login(provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    try {
      await authManager.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isProviderConfigured = (provider: AuthProvider): boolean => {
    return authManager.isProviderConfigured(provider);
  };

  const getConfiguredProviders = (): AuthProvider[] => {
    return authManager.getConfiguredProviders();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    clearError,
    isProviderConfigured,
    getConfiguredProviders,
  };
};