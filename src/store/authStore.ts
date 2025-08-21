import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuthState, User } from '@/types/auth.types';
import { getAuthConfig } from '@config/auth.config';

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User) => void;
  logout: () => void;
  updateTokens: (accessToken: string, refreshToken?: string, expiresIn?: number) => void;
  checkAuth: () => boolean;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

const config = getAuthConfig();
const storageKey = config.storage?.userKey || 'auth_user';

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        setUser: (user) => 
          set({ 
            user, 
            isAuthenticated: !!user,
            error: null 
          }),

        setLoading: (isLoading) => 
          set({ isLoading }),

        setError: (error) => 
          set({ error, isLoading: false }),

        clearError: () => 
          set({ error: null }),

        login: (user) => {
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
          
          const callbacks = getAuthConfig().callbacks;
          if (callbacks?.onLoginSuccess) {
            callbacks.onLoginSuccess(user);
          }
        },

        logout: () => {
          set({ 
            user: null, 
            isAuthenticated: false,
            error: null 
          });
          
          // Clear storage
          localStorage.removeItem(storageKey);
          localStorage.removeItem(config.storage?.tokenKey || 'auth_token');
          
          const callbacks = getAuthConfig().callbacks;
          if (callbacks?.onLogout) {
            callbacks.onLogout();
          }
        },

        updateTokens: (accessToken, refreshToken, expiresIn) => {
          const { user } = get();
          if (user) {
            const updatedUser = {
              ...user,
              accessToken,
              refreshToken: refreshToken || user.refreshToken,
              expiresAt: expiresIn 
                ? Date.now() + expiresIn * 1000 
                : user.expiresAt,
            };
            set({ user: updatedUser });
          }
        },

        checkAuth: () => {
          const { user, isAuthenticated } = get();
          if (!user || !isAuthenticated) return false;
          
          // Check token expiration if available
          if (user.expiresAt && user.expiresAt < Date.now()) {
            get().logout();
            return false;
          }
          
          return true;
        },
      }),
      {
        name: storageKey,
        partialize: (state) => ({ 
          user: state.user,
          isAuthenticated: state.isAuthenticated 
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);