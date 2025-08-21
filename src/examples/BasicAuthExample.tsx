/**
 * 기본 인증 사용 예제
 * 이 파일은 인증 시스템의 기본적인 사용법을 보여줍니다.
 */

import React from 'react';
import { useAuth } from '@hooks/useAuth';
import { LoginButton } from '@components/auth/LoginButton';

/**
 * 1. 가장 간단한 로그인 구현
 * - useAuth 훅으로 인증 상태 확인
 * - LoginButton으로 로그인 UI 제공
 */
export const SimpleLoginExample: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="p-8">
      {!isAuthenticated ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">로그인이 필요합니다</h2>
          
          {/* 구글 로그인 버튼 */}
          <LoginButton provider="google" />
          
          {/* 카카오 로그인 버튼 */}
          <LoginButton provider="kakao" />
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            안녕하세요, {user?.name}님!
          </h2>
          <p>이메일: {user?.email}</p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * 2. 커스텀 스타일 로그인 버튼
 * - variant: 버튼 스타일 변경
 * - size: 버튼 크기 조절
 * - fullWidth: 전체 너비 사용
 */
export const CustomLoginButtonExample: React.FC = () => {
  return (
    <div className="p-8 space-y-4">
      <h3 className="text-lg font-semibold">다양한 버튼 스타일</h3>
      
      {/* 기본 스타일 */}
      <LoginButton provider="google" variant="default" />
      
      {/* 아웃라인 스타일 */}
      <LoginButton provider="google" variant="outline" />
      
      {/* 고스트 스타일 */}
      <LoginButton provider="google" variant="ghost" />
      
      {/* 큰 사이즈, 전체 너비 */}
      <LoginButton 
        provider="kakao" 
        size="lg" 
        fullWidth 
      />
      
      {/* 커스텀 텍스트 */}
      <LoginButton provider="google">
        구글 계정으로 시작하기
      </LoginButton>
    </div>
  );
};

/**
 * 3. 로딩 및 에러 처리
 * - isLoading: 로딩 상태 표시
 * - error: 에러 메시지 표시
 * - clearError: 에러 초기화
 */
export const LoadingErrorExample: React.FC = () => {
  const { isLoading, error, clearError } = useAuth();

  return (
    <div className="p-8">
      {/* 로딩 표시 */}
      {isLoading && (
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent" />
          <span>로그인 처리 중...</span>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={clearError}
            className="mt-2 text-sm text-red-500 underline"
          >
            닫기
          </button>
        </div>
      )}

      {/* 로그인 버튼들 */}
      <div className="mt-4 space-y-2">
        <LoginButton provider="google" disabled={isLoading} />
        <LoginButton provider="kakao" disabled={isLoading} />
      </div>
    </div>
  );
};

/**
 * 4. 조건부 렌더링 예제
 * - 로그인 상태에 따른 다른 UI 표시
 * - 제공자별 다른 처리
 */
export const ConditionalRenderExample: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // 제공자별 웰컴 메시지
  const getWelcomeMessage = () => {
    if (!user) return '';
    
    switch (user.provider) {
      case 'google':
        return '구글 계정으로 로그인하셨습니다';
      case 'kakao':
        return '카카오 계정으로 로그인하셨습니다';
      default:
        return '환영합니다';
    }
  };

  return (
    <div className="p-8">
      {isAuthenticated ? (
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">
            {getWelcomeMessage()}
          </h3>
          <div className="mt-4 space-y-2">
            <p>사용자 ID: {user?.id}</p>
            <p>이름: {user?.name || '정보 없음'}</p>
            <p>이메일: {user?.email || '정보 없음'}</p>
            {user?.picture && (
              <img 
                src={user.picture} 
                alt="프로필"
                className="w-16 h-16 rounded-full"
              />
            )}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">
            로그인이 필요한 서비스입니다
          </h3>
          <p className="mt-2 text-sm text-yellow-600">
            아래 버튼을 클릭하여 로그인해주세요
          </p>
          <div className="mt-4 space-y-2">
            <LoginButton provider="google" fullWidth />
            <LoginButton provider="kakao" fullWidth />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 5. 커스텀 클릭 핸들러
 * - 로그인 전 추가 작업 수행
 * - 분석 이벤트 전송 등
 */
export const CustomClickHandlerExample: React.FC = () => {
  const handleGoogleLogin = () => {
    // 분석 이벤트 전송
    console.log('Google 로그인 시도');
    // 실제 로그인은 LoginButton이 처리
  };

  const handleKakaoLogin = () => {
    // 사용자 동의 확인
    if (confirm('카카오 계정으로 로그인하시겠습니까?')) {
      console.log('Kakao 로그인 시도');
    }
  };

  return (
    <div className="p-8 space-y-4">
      <h3 className="text-lg font-semibold">커스텀 이벤트 처리</h3>
      
      <LoginButton 
        provider="google"
        onClick={handleGoogleLogin}
      >
        구글로 시작하기
      </LoginButton>

      <LoginButton 
        provider="kakao"
        onClick={handleKakaoLogin}
      >
        카카오로 시작하기
      </LoginButton>
    </div>
  );
};