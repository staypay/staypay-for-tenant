export interface User {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
  provider: 'google' | 'kakao';
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthProvider = 'google' | 'kakao';

export interface OAuthResponse {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
}

export interface ProfileResponse {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
  [key: string]: unknown;
}