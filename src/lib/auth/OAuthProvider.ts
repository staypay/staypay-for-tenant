import type {
  AuthProvider as Provider,
  User,
  TokenResponse,
  ProfileResponse,
} from "@/types/auth.types";

export interface IOAuthProvider {
  name: Provider;
  getAuthUrl(): string;
  handleCallback(code: string): Promise<User>;
  exchangeCodeForToken(code: string): Promise<TokenResponse>;
  getUserProfile(accessToken: string): Promise<ProfileResponse>;
  revokeToken?(token: string): Promise<void>;
}

export abstract class OAuthProvider implements IOAuthProvider {
  abstract name: Provider;
  protected clientId: string;
  protected redirectUri: string;
  protected scope: string[];
  protected responseType: string;
  protected additionalParams: Record<string, string>;

  constructor(
    clientId: string,
    redirectUri: string,
    scope: string[] = [],
    responseType: string = "code",
    additionalParams: Record<string, string> = {}
  ) {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.scope = scope;
    this.responseType = responseType;
    this.additionalParams = additionalParams;
  }

  abstract getAuthUrl(): string;
  abstract exchangeCodeForToken(code: string): Promise<TokenResponse>;
  abstract getUserProfile(accessToken: string): Promise<ProfileResponse>;

  async handleCallback(code: string): Promise<User> {
    try {
      // Exchange authorization code for tokens
      const tokenResponse = await this.exchangeCodeForToken(code);

      // Get user profile
      const profileResponse = await this.getUserProfile(
        tokenResponse.access_token
      );

      // Map to User object
      return this.mapToUser(profileResponse, tokenResponse);
    } catch (error) {
      console.error(`${this.name} OAuth callback error:`, error);
      throw new Error(`Failed to authenticate with ${this.name}`);
    }
  }

  protected mapToUser(profile: ProfileResponse, tokens: TokenResponse): User {
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      provider: this.name,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expires_in
        ? Date.now() + tokens.expires_in * 1000
        : undefined,
    };
  }

  protected buildUrlWithParams(
    baseUrl: string,
    params: Record<string, string | string[]>
  ): string {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return;
      }
      
      // OAuth 2.0 spec requires scope to be a single space-separated string
      if (key === 'scope' && Array.isArray(value)) {
        url.searchParams.append(key, value.join(' '));
      } else if (Array.isArray(value)) {
        // For other array parameters, join with space
        url.searchParams.append(key, value.join(' '));
      } else {
        url.searchParams.append(key, value);
      }
    });
    return url.toString();
  }

  async revokeToken?(token: string): Promise<void>;
}
