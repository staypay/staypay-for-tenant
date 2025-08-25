# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OAuth authentication module built for a Kaia blockchain hackathon. Provides a modular, reusable authentication system with Google and Kakao login support, built with React, TypeScript, and Tailwind CSS.

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript with strict mode enabled
- **Vite** - Build tool and development server
- **Tailwind CSS v3** - Utility-first CSS framework
- **Zustand** - State management solution
- **Framer Motion** - Animation library
- **React Router v7** - Client-side routing

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type checking (included in build)
tsc -b
```

## Architecture Overview

### Authentication System
The auth system follows an abstract provider pattern allowing easy extension:

1. **AuthManager** (`src/lib/auth/AuthManager.ts`) - Central orchestrator that manages all OAuth providers
2. **OAuthProvider** (`src/lib/auth/OAuthProvider.ts`) - Abstract base class defining the provider interface
3. **Provider Implementations** - Google and Kakao providers extend the base class
4. **Auth Store** (`src/store/authStore.ts`) - Zustand store managing authentication state
5. **Auth Hooks** (`src/hooks/useAuth.ts`) - React hooks for consuming auth state

### Key Authentication Flow
1. User clicks login button → `AuthManager.login(provider)`
2. Redirects to OAuth provider's authorization page
3. Provider redirects back to `/auth/{provider}/callback`
4. `AuthCallback` component handles the code exchange
5. User profile is fetched and stored in Zustand store
6. User is redirected to protected route

### Path Aliases
The project uses TypeScript path aliases configured in both `tsconfig.app.json` and `vite.config.ts`:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@hooks/*` → `src/hooks/*`
- `@store/*` → `src/store/*`
- `@lib/*` → `src/lib/*`
- `@config/*` → `src/config/*`
- `@pages/*` → `src/pages/*`

## Code Guidelines

### From .cursor/rules

**Clean Code Principles:**
- Use constants over magic numbers
- Write self-documenting code with meaningful names
- Single responsibility for functions
- DRY (Don't Repeat Yourself)
- Extract reusable logic into custom hooks

**React Best Practices:**
- Use functional components exclusively
- Implement proper TypeScript prop types
- Use custom hooks for reusable logic
- Proper memoization with useMemo and useCallback
- Handle errors with Error Boundaries

**TypeScript Conventions:**
- Prefer interfaces for object types
- Use PascalCase for types/interfaces
- Use camelCase for variables/functions
- Avoid `any`, use `unknown` for unknown types
- Strict mode is enabled in tsconfig

**Tailwind CSS:**
- Use utility classes over custom CSS
- Mobile-first responsive design
- Custom theme with semantic color naming (primary, gray scales)
- Group utilities with @apply sparingly

**State Management (Zustand):**
- Create typed store slices
- Use selectors for performance
- Keep stores focused and small
- Implement proper TypeScript types

## Adding New OAuth Providers

To add a new OAuth provider (e.g., GitHub):

1. Create provider class in `src/lib/auth/providers/`:
```typescript
export class GitHubOAuthProvider extends OAuthProvider {
  name = 'github' as const;
  
  getAuthUrl(): string { /* implementation */ }
  async exchangeCodeForToken(code: string): Promise<TokenResponse> { /* implementation */ }
  async getUserProfile(accessToken: string): Promise<ProfileResponse> { /* implementation */ }
}
```

2. Register in `AuthManager.ts` initialization
3. Add type to `AuthProvider` in `src/types/auth.types.ts`
4. Configure in `src/config/auth.config.ts`

## Configuration Files

- `tailwind.config.cjs` - Tailwind CSS configuration with custom theme colors and animations
- `postcss.config.js` - PostCSS configuration for Tailwind
- `tsconfig.app.json` - Main TypeScript configuration with path aliases
- `vite.config.ts` - Vite build configuration with path alias resolution
- `eslint.config.js` - ESLint configuration

## Library Links
- [Tailwind CSS V3 Documentation](https://v3.tailwindcss.com/docs/installation)
- [Framer Motion React Documentation](https://motion.dev/docs/react)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vite Documentation](https://vitejs.dev/)