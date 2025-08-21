# Kaia Hackathon - OAuth Authentication Module

A modular, reusable OAuth authentication system built with React, TypeScript, and Tailwind CSS. Supports Google and Kakao login with minimal dependencies and maximum flexibility.

## Features

- 🔐 **OAuth 2.0 Authentication** - Google and Kakao login support
- 🎨 **Modern UI** - Built with Tailwind CSS v3 and Framer Motion
- 📦 **Minimal Dependencies** - Uses only essential packages
- 🔧 **Highly Configurable** - Easy to configure via environment variables
- 🎯 **TypeScript** - Full type safety
- 🚀 **Fast Development** - Powered by Vite
- 🗂️ **State Management** - Zustand for simple and efficient state management
- 🎭 **Abstract Design** - Easy to extend with new OAuth providers

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OAuth Providers

Copy `.env.example` to `.env` and add your OAuth credentials:

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback

# Kakao OAuth
VITE_KAKAO_CLIENT_ID=your_kakao_app_key
VITE_KAKAO_CLIENT_SECRET=your_kakao_client_secret
VITE_KAKAO_REDIRECT_URI=http://localhost:5173/auth/kakao/callback
```

### 3. Run Development Server

```bash
npm run dev
```

## Usage

### Basic Login Button

```tsx
import { LoginButton } from '@/components/auth/LoginButton';

function MyComponent() {
  return (
    <div>
      <LoginButton provider="google" />
      <LoginButton provider="kakao" />
    </div>
  );
}
```

### Using Auth Hook

```tsx
import { useAuth } from '@/hooks/useAuth';

function Profile() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

```tsx
import { useRequireAuth } from '@/hooks/useRequireAuth';

function ProtectedPage() {
  // Automatically redirects to login if not authenticated
  useRequireAuth();

  return <div>Protected content</div>;
}
```

### Custom Configuration

```tsx
import { configureAuth } from '@/config/auth.config';

// Configure in your main.tsx or App.tsx
configureAuth({
  providers: {
    google: {
      clientId: 'custom-client-id',
      scope: 'custom scopes',
    },
  },
  callbacks: {
    onLoginSuccess: (user) => {
      console.log('User logged in:', user);
    },
    onLoginError: (error) => {
      console.error('Login failed:', error);
    },
  },
});
```

## Project Structure

```
src/
├── components/
│   └── auth/
│       ├── LoginButton.tsx      # Reusable login button
│       └── AuthCallback.tsx     # OAuth callback handler
├── config/
│   └── auth.config.ts          # Auth configuration
├── hooks/
│   ├── useAuth.ts             # Main auth hook
│   └── useRequireAuth.ts      # Protected route hook
├── lib/
│   └── auth/
│       ├── AuthManager.ts     # Auth orchestrator
│       ├── OAuthProvider.ts   # Abstract OAuth provider
│       └── providers/
│           ├── GoogleOAuthProvider.ts
│           └── KakaoOAuthProvider.ts
├── store/
│   └── authStore.ts           # Zustand auth store
├── types/
│   └── auth.types.ts          # TypeScript types
└── pages/
    ├── LoginPage.tsx          # Login page example
    └── HomePage.tsx           # Protected page example
```

## Adding New OAuth Providers

1. Create a new provider class extending `OAuthProvider`:

```tsx
import { OAuthProvider } from '../OAuthProvider';

export class GitHubOAuthProvider extends OAuthProvider {
  name = 'github' as const;
  
  getAuthUrl(): string {
    // Implementation
  }
  
  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    // Implementation
  }
  
  async getUserProfile(accessToken: string): Promise<ProfileResponse> {
    // Implementation
  }
}
```

2. Register the provider in `AuthManager.ts`
3. Add configuration to `auth.config.ts`
4. Update types in `auth.types.ts`

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type checking
tsc -b
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v3** - Styling
- **Zustand** - State management
- **Framer Motion** - Animations
- **React Router** - Routing

## License

MIT