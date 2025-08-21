import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

interface UseRequireAuthOptions {
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
}

export const useRequireAuth = (options: UseRequireAuthOptions = {}) => {
  const { 
    redirectTo = '/login', 
    redirectIfAuthenticated = false 
  } = options;
  
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!redirectIfAuthenticated && !isAuthenticated) {
        // Redirect to login if not authenticated
        navigate(redirectTo);
      } else if (redirectIfAuthenticated && isAuthenticated) {
        // Redirect away from login if already authenticated
        navigate(redirectTo);
      }
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, redirectIfAuthenticated]);

  return { isAuthenticated, isLoading };
};