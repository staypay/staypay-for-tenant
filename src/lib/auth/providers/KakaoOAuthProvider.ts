import { OAuthProvider } from '@lib/auth/OAuthProvider';
import type { TokenResponse, ProfileResponse } from '@/types/auth.types';

const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize';
const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_USERINFO_URL = 'https://kapi.kakao.com/v2/user/me';
const KAKAO_LOGOUT_URL = 'https://kapi.kakao.com/v1/user/logout';
const KAKAO_UNLINK_URL = 'https://kapi.kakao.com/v1/user/unlink';

export class KakaoOAuthProvider extends OAuthProvider {
  name = 'kakao' as const;

  getAuthUrl(): string {
    const params = {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: this.responseType,
      scope: this.scope,
      ...this.additionalParams,
    };

    return this.buildUrlWithParams(KAKAO_AUTH_URL, params);
  }

  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: import.meta.env.VITE_KAKAO_CLIENT_SECRET || '',
      redirect_uri: this.redirectUri,
      code,
    });

    const response = await fetch(KAKAO_TOKEN_URL, {
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
    const response = await fetch(KAKAO_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    
    // Kakao returns nested structure, normalize it
    return {
      id: String(data.id),
      email: data.kakao_account?.email,
      name: data.properties?.nickname || data.kakao_account?.profile?.nickname,
      picture: data.properties?.profile_image || data.kakao_account?.profile?.profile_image_url,
      connected_at: data.connected_at,
      kakao_account: data.kakao_account,
    };
  }

  async logout(accessToken: string): Promise<void> {
    const response = await fetch(KAKAO_LOGOUT_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.warn('Failed to logout from Kakao');
    }
  }

  async revokeToken(accessToken: string): Promise<void> {
    const response = await fetch(KAKAO_UNLINK_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.warn('Failed to unlink Kakao account');
    }
  }
}