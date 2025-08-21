import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage';
import { AuthCallback } from '@components/auth/AuthCallback';
import { configureAuth, KAKAO_SCOPES, GOOGLE_SCOPES, SCOPE_PRESETS } from '@config/auth.config';
import { useAuthStore } from '@store/authStore';

// Configure auth with your settings (can be called from main.tsx instead)
configureAuth({
  providers: {
    // 카카오 동의 항목 설정 - 카카오 개발자 콘솔에서 설정한 항목만 포함
    kakao: {
      clientId: import.meta.env.VITE_KAKAO_CLIENT_ID || '',
      redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI || window.location.origin + '/auth/kakao/callback',
      // 방법 1: 프리셋 사용 (권장)
      scope: SCOPE_PRESETS.kakao.minimal,  // 닉네임만
      
      // 방법 2: 개별 항목 선택
      // scope: [
      //   KAKAO_SCOPES.PROFILE,  // 필수: 닉네임
      //   // 아래는 카카오 앱 설정에서 동의 항목으로 추가한 경우에만 사용
      //   // KAKAO_SCOPES.PROFILE_IMAGE,
      //   // KAKAO_SCOPES.ACCOUNT_EMAIL,
      // ],
      
      // 방법 3: 문자열로 직접 지정
      // scope: 'profile_nickname',
    },
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
      redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || window.location.origin + '/auth/google/callback',
      scope: SCOPE_PRESETS.google.basic,  // 기본 정보만
    },
  },
  callbacks: {
    onLoginSuccess: (user) => {
      console.log('Login successful:', user);
    },
    onLoginError: (error) => {
      console.error('Login failed:', error);
    },
    onLogout: () => {
      console.log('User logged out');
    },
  },
});

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/auth/google/callback" 
          element={<AuthCallback provider="google" redirectTo="/" />} 
        />
        <Route 
          path="/auth/kakao/callback" 
          element={<AuthCallback provider="kakao" redirectTo="/" />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;