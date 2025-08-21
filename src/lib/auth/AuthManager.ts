import { GoogleOAuthProvider } from "@lib/auth/providers/GoogleOAuthProvider";
import { KakaoOAuthProvider } from "@lib/auth/providers/KakaoOAuthProvider";
import type { IOAuthProvider } from "@lib/auth/OAuthProvider";
import type { AuthProvider, User } from "@/types/auth.types";
import { getAuthConfig } from "@config/auth.config";
import { useAuthStore } from "@store/authStore";

class AuthManager {
  private providers: Map<AuthProvider, IOAuthProvider> = new Map();
  private initialized = false;

  initialize() {
    if (this.initialized) return;

    const config = getAuthConfig();

    // Initialize Google provider
    if (config.providers.google) {
      const { clientId, redirectUri, scope, responseType, additionalParams } =
        config.providers.google;
      if (clientId) {
        this.providers.set(
          "google",
          new GoogleOAuthProvider(
            clientId,
            redirectUri,
            scope || [],
            responseType || "code",
            additionalParams || {}
          )
        );
      }
    }

    // Initialize Kakao provider
    if (config.providers.kakao) {
      const { clientId, redirectUri, scope, responseType, additionalParams } =
        config.providers.kakao;
      if (clientId) {
        this.providers.set(
          "kakao",
          new KakaoOAuthProvider(
            clientId,
            redirectUri,
            scope || [],
            responseType || "code",
            additionalParams || {}
          )
        );
      }
    }

    this.initialized = true;
  }

  getProvider(name: AuthProvider): IOAuthProvider | undefined {
    this.initialize();
    return this.providers.get(name);
  }

  async login(provider: AuthProvider): Promise<void> {
    const oauthProvider = this.getProvider(provider);
    if (!oauthProvider) {
      throw new Error(`Provider ${provider} is not configured`);
    }

    const authUrl = oauthProvider.getAuthUrl();
    window.location.href = authUrl;
  }

  async handleCallback(provider: AuthProvider, code: string): Promise<User> {
    const oauthProvider = this.getProvider(provider);
    if (!oauthProvider) {
      throw new Error(`Provider ${provider} is not configured`);
    }

    const store = useAuthStore.getState();
    store.setLoading(true);

    try {
      const user = await oauthProvider.handleCallback(code);
      store.login(user);
      return user;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";
      store.setError(errorMessage);

      const config = getAuthConfig();
      if (config.callbacks?.onLoginError) {
        config.callbacks.onLoginError(new Error(errorMessage));
      }

      throw error;
    }
  }

  async logout(): Promise<void> {
    const store = useAuthStore.getState();
    const user = store.user;

    if (user?.accessToken && user.provider) {
      const provider = this.getProvider(user.provider);
      if (provider?.revokeToken) {
        try {
          await provider.revokeToken(user.accessToken);
        } catch (error) {
          console.warn("Failed to revoke token:", error);
        }
      }
    }

    store.logout();
  }

  isProviderConfigured(provider: AuthProvider): boolean {
    this.initialize();
    return this.providers.has(provider);
  }

  getConfiguredProviders(): AuthProvider[] {
    this.initialize();
    return Array.from(this.providers.keys());
  }
}

export const authManager = new AuthManager();
