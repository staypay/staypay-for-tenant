import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { AuthProvider } from '@/types/auth.types';
import { authManager } from '@lib/auth/AuthManager';
import { useAuthStore } from '@store/authStore';

interface AuthCallbackProps {
  provider: AuthProvider;
  redirectTo?: string;
}

export const AuthCallback: React.FC<AuthCallbackProps> = ({ 
  provider, 
  redirectTo = '/' 
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setError } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        setError(errorDescription || error);
        setIsProcessing(false);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        setIsProcessing(false);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        await authManager.handleCallback(provider, code);
        navigate(redirectTo);
      } catch (err) {
        console.error('Authentication callback failed:', err);
        setIsProcessing(false);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, provider, navigate, redirectTo, setError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {isProcessing ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-lg text-gray-600">Completing authentication...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-red-500">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-lg text-gray-600">Authentication failed</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
};