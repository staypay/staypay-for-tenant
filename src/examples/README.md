# 인증 시스템 예제 가이드

이 폴더에는 인증 시스템을 사용하는 다양한 예제가 포함되어 있습니다.

## 📁 예제 파일 구조

```
examples/
├── BasicAuthExample.tsx       # 기본 인증 기능
├── ProtectedRouteExample.tsx  # 보호된 라우트 구현
├── AdvancedAuthExample.tsx    # 고급 기능 및 패턴
└── README.md                  # 이 문서
```

## 🚀 빠른 시작

### 1. 기본 로그인 구현
```tsx
import { useAuth } from '@hooks/useAuth';
import { LoginButton } from '@components/auth/LoginButton';

function MyApp() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginButton provider="google" />;
  }
  
  return (
    <div>
      환영합니다, {user?.name}님!
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}
```

### 2. 보호된 페이지 만들기
```tsx
import { useRequireAuth } from '@hooks/useRequireAuth';

function ProtectedPage() {
  // 이 한 줄이 페이지를 보호합니다
  useRequireAuth();
  
  return <div>로그인한 사용자만 볼 수 있는 내용</div>;
}
```

## 📚 예제별 주요 내용

### BasicAuthExample.tsx
- ✅ 간단한 로그인/로그아웃
- ✅ 로그인 버튼 커스터마이징
- ✅ 로딩 및 에러 처리
- ✅ 조건부 렌더링
- ✅ 커스텀 이벤트 핸들러

### ProtectedRouteExample.tsx
- ✅ useRequireAuth 훅 사용법
- ✅ 라우트 보호 패턴
- ✅ 리다이렉트 설정
- ✅ 역할 기반 접근 제어
- ✅ 라우트 가드 컴포넌트

### AdvancedAuthExample.tsx
- ✅ 동적 설정 변경
- ✅ 토큰 자동 갱신
- ✅ 다중 계정 관리
- ✅ 세션 타임아웃
- ✅ 탭 간 동기화

## 🎯 사용 시나리오

### 시나리오 1: 간단한 앱
```tsx
// App.tsx
import { SimpleLoginExample } from '@examples/BasicAuthExample';

export default function App() {
  return <SimpleLoginExample />;
}
```

### 시나리오 2: SPA with 라우팅
```tsx
// App.tsx
import { RoutingExample } from '@examples/ProtectedRouteExample';

export default function App() {
  return <RoutingExample />;
}
```

### 시나리오 3: 엔터프라이즈 앱
```tsx
// App.tsx
import { 
  TokenRefreshExample,
  SessionManagementExample 
} from '@examples/AdvancedAuthExample';

export default function App() {
  return (
    <>
      <TokenRefreshExample />
      <SessionManagementExample />
    </>
  );
}
```

## 💡 팁과 모범 사례

### 1. 환경 변수 설정
```env
# .env 파일
VITE_GOOGLE_CLIENT_ID=실제_클라이언트_ID
VITE_KAKAO_CLIENT_ID=실제_앱_키
```

### 2. 타입 안정성
```tsx
// 항상 타입을 명시하세요
const { user }: { user: User | null } = useAuth();
```

### 3. 에러 처리
```tsx
// 에러는 항상 사용자에게 피드백을 제공하세요
const { error, clearError } = useAuth();

useEffect(() => {
  if (error) {
    toast.error(error);
    clearError();
  }
}, [error]);
```

### 4. 성능 최적화
```tsx
// 불필요한 리렌더링 방지
const login = useCallback(async (provider: AuthProvider) => {
  await authManager.login(provider);
}, []);
```

## 🔍 디버깅

### 로그인이 안 될 때
1. 환경 변수 확인 (.env 파일)
2. OAuth 앱 설정 확인 (리다이렉트 URI)
3. 네트워크 탭에서 에러 확인
4. 콘솔 로그 확인

### 토큰 관련 문제
```tsx
// 토큰 상태 확인
const { user } = useAuth();
console.log('Access Token:', user?.accessToken);
console.log('Expires At:', user?.expiresAt);
```

### 스토어 상태 확인
```tsx
// Zustand 스토어 직접 접근
import { useAuthStore } from '@store/authStore';

const state = useAuthStore.getState();
console.log('Auth State:', state);
```

## 📖 추가 리소스

- [API 문서](../docs/AUTH_API.md)
- [인증 플로우 다이어그램](../docs/AUTH_FLOW.md)
- [Google OAuth 문서](https://developers.google.com/identity/protocols/oauth2)
- [Kakao OAuth 문서](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)

## QnA

**Q: 새로운 OAuth 제공자를 추가하려면?**
A: `OAuthProvider` 클래스를 상속받아 구현하고 `AuthManager`에 등록하세요.

**Q: 백엔드 API와 어떻게 연동하나요?**
A: `user.accessToken`을 API 요청 헤더에 포함시키세요.

**Q: 로그인 상태를 유지하려면?**
A: Zustand의 persist 미들웨어가 자동으로 처리합니다.

**Q: 소셜 로그인 버튼 스타일을 변경하려면?**
A: `LoginButton`의 `className` prop을 사용하세요.