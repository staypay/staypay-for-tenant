import { OAuthProvider } from '@lib/auth/OAuthProvider';
import type { TokenResponse, ProfileResponse } from '@/types/auth.types';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
const GOOGLE_REVOKE_URL = 'https://oauth2.googleapis.com/revoke';

export class GoogleOAuthProvider extends OAuthProvider {
  name = 'google' as const;

  getAuthUrl(): string {
    const params = {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: this.responseType,
      scope: this.scope,
      access_type: 'offline',
      prompt: 'consent',
      ...this.additionalParams,
    };

    return this.buildUrlWithParams(GOOGLE_AUTH_URL, params);
  }

  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const params = new URLSearchParams({
      code,
      client_id: this.clientId,
      client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    });

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code for token: ${error}`);
    }

    const data = await response.json();
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      token_type: data.token_type,
      scope: data.scope,
    };
  }

  async getUserProfile(accessToken: string): Promise<ProfileResponse> {
    const response = await fetch(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture,
      verified_email: data.verified_email,
      locale: data.locale,
    };
  }

  async revokeToken(token: string): Promise<void> {
    const params = new URLSearchParams({ token });
    
    const response = await fetch(GOOGLE_REVOKE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      console.warn('Failed to revoke Google token');
    }
  }
}