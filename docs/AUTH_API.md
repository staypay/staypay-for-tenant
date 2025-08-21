# 인증 시스템 API 문서

## 📚 핵심 개념

### 인증 플로우
```
1. 사용자가 로그인 버튼 클릭
2. OAuth 제공자 페이지로 리다이렉트
3. 사용자 인증 후 콜백 URL로 리턴
4. 인증 코드를 토큰으로 교환
5. 사용자 정보 획득 및 저장
```

## 🔧 설정 (Configuration)

### `configureAuth(config: Partial<AuthConfig>)`
인증 시스템을 설정합니다.

```typescript
import { configureAuth } from '@config/auth.config';

configureAuth({
  // OAuth 제공자 설정
  providers: {
    google: {
      clientId: 'your-google-client-id',
      redirectUri: 'http://localhost:5173/auth/google/callback',
      scope: 'openid email profile',
    },
    kakao: {
      clientId: 'your-kakao-app-key',
      redirectUri: 'http://localhost:5173/auth/kakao/callback',
      scope: 'profile_nickname profile_image account_email',
    }
  },
  
  // 스토리지 키 설정
  storage: {
    tokenKey: 'auth_token',
    userKey: 'auth_user',
  },
  
  // 콜백 함수들
  callbacks: {
    onLoginSuccess: (user) => console.log('로그인 성공:', user),
    onLoginError: (error) => console.error('로그인 실패:', error),
    onLogout: () => console.log('로그아웃'),
  }
});
```

## 🪝 Hooks

### `useAuth()`
인증 상태와 메서드를 제공하는 메인 훅입니다.

**반환값:**
```typescript
{
  user: User | null;              // 현재 사용자 정보
  isAuthenticated: boolean;       // 인증 여부
  isLoading: boolean;             // 로딩 상태
  error: string | null;           // 에러 메시지
  login: (provider: AuthProvider) => Promise<void>;  // 로그인 함수
  logout: () => Promise<void>;    // 로그아웃 함수
  checkAuth: () => boolean;       // 인증 확인
  clearError: () => void;         // 에러 초기화
  isProviderConfigured: (provider: AuthProvider) => boolean;  // 제공자 설정 확인
  getConfiguredProviders: () => AuthProvider[];  // 설정된 제공자 목록
}
```

### `useRequireAuth(options?)`
페이지 보호를 위한 훅입니다.

**옵션:**
```typescript
{
  redirectTo?: string;             // 리다이렉트 경로 (기본: '/login')
  redirectIfAuthenticated?: boolean; // 인증 시 리다이렉트 여부
}
```

## 🧩 컴포넌트

### `<LoginButton />`
OAuth 로그인 버튼 컴포넌트

**Props:**
```typescript
{
  provider: 'google' | 'kakao';    // OAuth 제공자
  children?: React.ReactNode;      // 버튼 텍스트
  className?: string;              // 추가 CSS 클래스
  variant?: 'default' | 'outline' | 'ghost';  // 버튼 스타일
  size?: 'sm' | 'md' | 'lg';      // 버튼 크기
  fullWidth?: boolean;             // 전체 너비 사용
  disabled?: boolean;              // 비활성화 상태
  onClick?: () => void;            // 커스텀 클릭 핸들러
}
```

### `<AuthCallback />`
OAuth 콜백 처리 컴포넌트

**Props:**
```typescript
{
  provider: 'google' | 'kakao';    // OAuth 제공자
  redirectTo?: string;             // 성공 시 리다이렉트 경로
}
```

## 📦 Store (Zustand)

### `useAuthStore`
인증 상태 관리 스토어

**상태:**
```typescript
{
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

**액션:**
```typescript
{
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User) => void;
  logout: () => void;
  updateTokens: (accessToken: string, refreshToken?: string, expiresIn?: number) => void;
  checkAuth: () => boolean;
  clearError: () => void;
}
```

## 🔐 AuthManager

싱글톤 패턴으로 구현된 인증 관리자

### 메서드

#### `authManager.login(provider: AuthProvider)`
OAuth 로그인 시작

#### `authManager.handleCallback(provider: AuthProvider, code: string)`
OAuth 콜백 처리

#### `authManager.logout()`
로그아웃 처리

#### `authManager.isProviderConfigured(provider: AuthProvider)`
제공자 설정 확인

#### `authManager.getConfiguredProviders()`
설정된 제공자 목록 반환

## 📝 타입 정의

### `User`
```typescript
interface User {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
  provider: 'google' | 'kakao';
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}
```

### `AuthState`
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### `AuthProvider`
```typescript
type AuthProvider = 'google' | 'kakao';
```

## 🔄 OAuth Provider 추가하기

새로운 OAuth 제공자를 추가하려면:

1. `OAuthProvider` 클래스를 상속받아 구현
2. `AuthManager`에 제공자 등록
3. `auth.types.ts`에 타입 추가
4. `auth.config.ts`에 설정 추가

```typescript
// 예시: GitHub 제공자 추가
export class GitHubOAuthProvider extends OAuthProvider {
  name = 'github' as const;
  
  getAuthUrl(): string {
    // GitHub OAuth URL 생성
  }
  
  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    // 코드를 토큰으로 교환
  }
  
  async getUserProfile(accessToken: string): Promise<ProfileResponse> {
    // 사용자 프로필 조회
  }
}
```