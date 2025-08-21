/**
 * 보호된 라우트 예제
 * 인증이 필요한 페이지를 구현하는 방법을 보여줍니다.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useRequireAuth } from '@hooks/useRequireAuth';
import { useAuth } from '@hooks/useAuth';
import { LoginButton } from '@components/auth/LoginButton';

/**
 * 1. 기본 보호된 페이지
 * - useRequireAuth 훅으로 인증 확인
 * - 미인증 시 자동으로 /login으로 리다이렉트
 */
const ProtectedDashboard: React.FC = () => {
  // 이 훅이 인증 확인을 처리합니다
  useRequireAuth();
  
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">대시보드</h1>
      <p className="mb-4">이 페이지는 로그인한 사용자만 볼 수 있습니다.</p>
      
      <div className="bg-gray-100 p-4 rounded">
        <p>사용자: {user?.name}</p>
        <p>이메일: {user?.email}</p>
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

/**
 * 2. 커스텀 리다이렉트 경로
 * - 특정 경로로 리다이렉트 설정
 */
const AdminPanel: React.FC = () => {
  // 관리자 페이지는 다른 로그인 페이지로 리다이렉트
  useRequireAuth({ redirectTo: '/admin/login' });
  
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">관리자 패널</h1>
      <p>관리자 {user?.name}님, 환영합니다!</p>
    </div>
  );
};

/**
 * 3. 인증된 사용자를 리다이렉트
 * - 이미 로그인한 사용자는 홈으로 이동
 */
const LoginPageExample: React.FC = () => {
  // 이미 인증된 사용자는 홈으로 리다이렉트
  useRequireAuth({ 
    redirectTo: '/dashboard', 
    redirectIfAuthenticated: true 
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">로그인</h1>
      <p className="mb-6">계속하려면 로그인해주세요.</p>
      
      <div className="space-y-3">
        <LoginButton provider="google" fullWidth size="lg" />
        <LoginButton provider="kakao" fullWidth size="lg" />
      </div>
    </div>
  );
};

/**
 * 4. 조건부 보호 컴포넌트
 * - 컴포넌트 레벨에서 인증 확인
 */
const ConditionalProtectedComponent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="p-8 bg-yellow-50 rounded">
        <h3 className="text-lg font-semibold text-yellow-800">
          이 콘텐츠를 보려면 로그인이 필요합니다
        </h3>
        <div className="mt-4 space-x-2">
          <LoginButton provider="google" />
          <LoginButton provider="kakao" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-green-50 rounded">
      <h3 className="text-lg font-semibold text-green-800">
        프리미엄 콘텐츠
      </h3>
      <p className="mt-2">
        {user?.name}님만을 위한 특별한 콘텐츠입니다.
      </p>
    </div>
  );
};

/**
 * 5. 라우트 가드 컴포넌트
 * - 재사용 가능한 라우트 보호 래퍼
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent" />
      </div>
    );
  }

  // 인증되지 않았을 때
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // 인증되었을 때
  return <>{children}</>;
};

/**
 * 6. 전체 라우팅 예제
 * - 실제 앱에서 사용하는 방식
 */
export const RoutingExample: React.FC = () => {
  return (
    <BrowserRouter>
      <nav className="bg-gray-800 text-white p-4">
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-gray-300">홈</Link>
          <Link to="/dashboard" className="hover:text-gray-300">대시보드</Link>
          <Link to="/profile" className="hover:text-gray-300">프로필</Link>
          <Link to="/settings" className="hover:text-gray-300">설정</Link>
          <Link to="/login" className="hover:text-gray-300">로그인</Link>
        </div>
      </nav>

      <Routes>
        {/* 공개 라우트 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPageExample />} />
        
        {/* 보호된 라우트 - 방법 1: 컴포넌트 내부에서 처리 */}
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        
        {/* 보호된 라우트 - 방법 2: 래퍼 컴포넌트 사용 */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute redirectTo="/login">
              <SettingsPage />
            </ProtectedRoute>
          } 
        />

        {/* 404 페이지 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

// 예제 페이지 컴포넌트들
const HomePage: React.FC = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">홈페이지</h1>
    <p className="mt-4">누구나 볼 수 있는 공개 페이지입니다.</p>
  </div>
);

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">프로필</h1>
      <div className="mt-4 space-y-2">
        <p>이름: {user?.name}</p>
        <p>이메일: {user?.email}</p>
        <p>제공자: {user?.provider}</p>
      </div>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const { logout } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">설정</h1>
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        로그아웃
      </button>
    </div>
  );
};

const NotFoundPage: React.FC = () => (
  <div className="p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-400">404</h1>
    <p className="mt-2">페이지를 찾을 수 없습니다.</p>
  </div>
);

/**
 * 7. 역할 기반 접근 제어 (RBAC) 예제
 * - 사용자 역할에 따른 접근 제어
 */
interface RequireRoleProps {
  role: string;
  children: React.ReactNode;
}

const RequireRole: React.FC<RequireRoleProps> = ({ role, children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // 실제로는 user 객체에 role 필드가 있어야 합니다
  // 여기서는 예시로 provider를 기준으로 합니다
  const hasRole = isAuthenticated && user?.provider === role;

  if (!hasRole) {
    return (
      <div className="p-8 bg-red-50 rounded">
        <h3 className="text-lg font-semibold text-red-800">
          접근 권한이 없습니다
        </h3>
        <p className="mt-2 text-sm text-red-600">
          이 페이지는 {role} 권한이 필요합니다.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

// 사용 예시
export const RoleBasedExample: React.FC = () => {
  return (
    <div className="p-8">
      {/* Google 사용자만 접근 가능 */}
      <RequireRole role="google">
        <div className="p-4 bg-blue-50 rounded">
          <h3>Google 사용자 전용 콘텐츠</h3>
        </div>
      </RequireRole>

      {/* Kakao 사용자만 접근 가능 */}
      <RequireRole role="kakao">
        <div className="p-4 bg-yellow-50 rounded">
          <h3>Kakao 사용자 전용 콘텐츠</h3>
        </div>
      </RequireRole>
    </div>
  );
};