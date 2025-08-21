/**
 * OAuth 동의 항목(Scope) 설정 예제
 * 카카오와 구글의 동의 항목을 유연하게 설정하는 방법을 보여줍니다.
 */

import React, { useState } from 'react';
import { 
  configureAuth, 
  KAKAO_SCOPES, 
  GOOGLE_SCOPES, 
  SCOPE_PRESETS,
  getAuthConfig 
} from '@config/auth.config';
import { LoginButton } from '@components/auth/LoginButton';
import { useAuth } from '@hooks/useAuth';

/**
 * 1. 카카오 동의 항목 동적 설정
 * - 사용자가 원하는 정보만 선택적으로 요청
 */
export const KakaoScopeSelector: React.FC = () => {
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    KAKAO_SCOPES.PROFILE,  // 기본 필수
  ]);

  const availableScopes = [
    { key: KAKAO_SCOPES.PROFILE, label: '닉네임', required: true },
    { key: KAKAO_SCOPES.PROFILE_IMAGE, label: '프로필 사진', required: false },
    { key: KAKAO_SCOPES.ACCOUNT_EMAIL, label: '이메일', required: false },
    { key: KAKAO_SCOPES.GENDER, label: '성별', required: false },
    { key: KAKAO_SCOPES.AGE_RANGE, label: '연령대', required: false },
    { key: KAKAO_SCOPES.BIRTHDAY, label: '생일', required: false },
  ];

  const handleScopeChange = (scope: string, checked: boolean) => {
    if (checked) {
      setSelectedScopes([...selectedScopes, scope]);
    } else {
      setSelectedScopes(selectedScopes.filter(s => s !== scope));
    }
  };

  const applyScopes = () => {
    configureAuth({
      providers: {
        kakao: {
          clientId: import.meta.env.VITE_KAKAO_CLIENT_ID || '',
          redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI || '',
          scope: selectedScopes,
        },
      },
    });
    
    alert(`카카오 동의 항목이 설정되었습니다:\n${selectedScopes.join(', ')}`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">카카오 동의 항목 선택</h3>
      
      <div className="space-y-2 mb-4">
        {availableScopes.map(({ key, label, required }) => (
          <label key={key} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedScopes.includes(key)}
              onChange={(e) => handleScopeChange(key, e.target.checked)}
              disabled={required}
              className="mr-2"
            />
            <span className={required ? 'font-medium' : ''}>
              {label} {required && '(필수)'}
            </span>
          </label>
        ))}
      </div>

      <div className="bg-yellow-50 p-3 rounded mb-4">
        <p className="text-sm text-yellow-800">
          ⚠️ 카카오 개발자 콘솔에서 해당 동의 항목을 먼저 설정해야 합니다.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={applyScopes}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          동의 항목 적용
        </button>
        <LoginButton provider="kakao" />
      </div>
    </div>
  );
};

/**
 * 2. 프리셋 사용 예제
 * - 미리 정의된 스코프 세트 사용
 */
export const PresetScopeExample: React.FC = () => {
  const [kakaoPreset, setKakaoPreset] = useState<'minimal' | 'basic' | 'full'>('minimal');
  const [googlePreset, setGooglePreset] = useState<'minimal' | 'basic' | 'extended'>('basic');

  const applyPresets = () => {
    configureAuth({
      providers: {
        kakao: {
          clientId: import.meta.env.VITE_KAKAO_CLIENT_ID || '',
          redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI || '',
          scope: SCOPE_PRESETS.kakao[kakaoPreset],
        },
        google: {
          clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || '',
          scope: SCOPE_PRESETS.google[googlePreset],
        },
      },
    });

    console.log('적용된 스코프:', {
      kakao: SCOPE_PRESETS.kakao[kakaoPreset],
      google: SCOPE_PRESETS.google[googlePreset],
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">프리셋 스코프 설정</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* 카카오 프리셋 */}
        <div>
          <h4 className="font-medium mb-2">카카오 프리셋</h4>
          <select
            value={kakaoPreset}
            onChange={(e) => setKakaoPreset(e.target.value as any)}
            className="w-full p-2 border rounded"
          >
            <option value="minimal">최소 (닉네임만)</option>
            <option value="basic">기본 (닉네임, 프로필, 이메일)</option>
            <option value="full">전체 (모든 기본 정보)</option>
          </select>
          <div className="mt-2 text-xs text-gray-600">
            포함 항목: {SCOPE_PRESETS.kakao[kakaoPreset].join(', ')}
          </div>
        </div>

        {/* 구글 프리셋 */}
        <div>
          <h4 className="font-medium mb-2">구글 프리셋</h4>
          <select
            value={googlePreset}
            onChange={(e) => setGooglePreset(e.target.value as any)}
            className="w-full p-2 border rounded"
          >
            <option value="minimal">최소 (OpenID만)</option>
            <option value="basic">기본 (OpenID, 이메일, 프로필)</option>
            <option value="extended">확장 (+ 캘린더, 드라이브)</option>
          </select>
          <div className="mt-2 text-xs text-gray-600">
            포함 항목: {SCOPE_PRESETS.google[googlePreset].join(', ')}
          </div>
        </div>
      </div>

      <button
        onClick={applyPresets}
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-4"
      >
        프리셋 적용
      </button>

      <div className="flex gap-2">
        <LoginButton provider="google" fullWidth />
        <LoginButton provider="kakao" fullWidth />
      </div>
    </div>
  );
};

/**
 * 3. 현재 설정 확인
 * - 현재 적용된 스코프 확인
 */
export const CurrentScopeDisplay: React.FC = () => {
  const config = getAuthConfig();
  const { user } = useAuth();

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">현재 스코프 설정</h3>
      
      <div className="space-y-4">
        {/* 구글 스코프 */}
        <div>
          <h4 className="font-medium text-gray-700">Google OAuth Scopes</h4>
          <code className="block mt-1 p-2 bg-gray-100 rounded text-sm">
            {config.providers.google?.scope || '설정되지 않음'}
          </code>
        </div>

        {/* 카카오 스코프 */}
        <div>
          <h4 className="font-medium text-gray-700">Kakao OAuth Scopes</h4>
          <code className="block mt-1 p-2 bg-gray-100 rounded text-sm">
            {config.providers.kakao?.scope || '설정되지 않음'}
          </code>
        </div>

        {/* 현재 사용자 정보 */}
        {user && (
          <div>
            <h4 className="font-medium text-gray-700">받은 사용자 정보</h4>
            <div className="mt-1 p-2 bg-blue-50 rounded text-sm">
              <p>Provider: {user.provider}</p>
              <p>이름: {user.name || '없음'}</p>
              <p>이메일: {user.email || '없음'}</p>
              <p>프로필 이미지: {user.picture ? '있음' : '없음'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 4. 동의 항목별 UI 커스터마이징
 * - 요청하는 정보에 따른 UI 변경
 */
export const ConsentUIExample: React.FC = () => {
  const [consentLevel, setConsentLevel] = useState<'minimal' | 'standard' | 'full'>('minimal');

  const consentDescriptions = {
    minimal: {
      title: '필수 정보만 제공',
      description: '서비스 이용에 필요한 최소한의 정보만 요청합니다.',
      icon: '🔒',
      scopes: {
        kakao: [KAKAO_SCOPES.PROFILE],
        google: [GOOGLE_SCOPES.OPENID],
      },
    },
    standard: {
      title: '기본 프로필 정보',
      description: '더 나은 서비스를 위해 기본 프로필 정보를 요청합니다.',
      icon: '👤',
      scopes: {
        kakao: [KAKAO_SCOPES.PROFILE, KAKAO_SCOPES.PROFILE_IMAGE, KAKAO_SCOPES.ACCOUNT_EMAIL],
        google: [GOOGLE_SCOPES.OPENID, GOOGLE_SCOPES.EMAIL, GOOGLE_SCOPES.PROFILE],
      },
    },
    full: {
      title: '전체 정보 제공',
      description: '맞춤형 서비스를 위해 추가 정보를 요청합니다.',
      icon: '🎯',
      scopes: {
        kakao: [
          KAKAO_SCOPES.PROFILE,
          KAKAO_SCOPES.PROFILE_IMAGE,
          KAKAO_SCOPES.ACCOUNT_EMAIL,
          KAKAO_SCOPES.GENDER,
          KAKAO_SCOPES.AGE_RANGE,
        ],
        google: [
          GOOGLE_SCOPES.OPENID,
          GOOGLE_SCOPES.EMAIL,
          GOOGLE_SCOPES.PROFILE,
          GOOGLE_SCOPES.CALENDAR,
        ],
      },
    },
  };

  const handleLogin = (provider: 'google' | 'kakao') => {
    const consent = consentDescriptions[consentLevel];
    
    configureAuth({
      providers: {
        [provider]: {
          clientId: import.meta.env[`VITE_${provider.toUpperCase()}_CLIENT_ID`] || '',
          redirectUri: import.meta.env[`VITE_${provider.toUpperCase()}_REDIRECT_URI`] || '',
          scope: consent.scopes[provider],
        },
      },
    });

    // 실제 로그인은 LoginButton이 처리
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">정보 제공 수준 선택</h3>
      
      {/* 동의 수준 선택 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {(Object.keys(consentDescriptions) as Array<keyof typeof consentDescriptions>).map((level) => {
          const consent = consentDescriptions[level];
          return (
            <button
              key={level}
              onClick={() => setConsentLevel(level)}
              className={`p-4 rounded-lg border-2 transition-all ${
                consentLevel === level
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{consent.icon}</div>
              <div className="font-medium text-sm">{consent.title}</div>
            </button>
          );
        })}
      </div>

      {/* 선택된 동의 수준 설명 */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <p className="text-sm text-gray-700">
          {consentDescriptions[consentLevel].description}
        </p>
        <div className="mt-3 text-xs text-gray-600">
          <p className="font-medium mb-1">요청 정보:</p>
          <ul className="list-disc list-inside">
            {consentLevel === 'minimal' && (
              <>
                <li>기본 식별 정보</li>
              </>
            )}
            {consentLevel === 'standard' && (
              <>
                <li>이름 / 닉네임</li>
                <li>이메일 주소</li>
                <li>프로필 사진</li>
              </>
            )}
            {consentLevel === 'full' && (
              <>
                <li>이름 / 닉네임</li>
                <li>이메일 주소</li>
                <li>프로필 사진</li>
                <li>성별 / 연령대</li>
                <li>캘린더 접근 (Google)</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* 로그인 버튼 */}
      <div className="space-y-2">
        <div onClick={() => handleLogin('google')}>
          <LoginButton provider="google" fullWidth>
            Google로 계속하기 ({consentLevel === 'minimal' ? '최소' : consentLevel === 'standard' ? '기본' : '전체'} 정보)
          </LoginButton>
        </div>
        <div onClick={() => handleLogin('kakao')}>
          <LoginButton provider="kakao" fullWidth>
            Kakao로 계속하기 ({consentLevel === 'minimal' ? '최소' : consentLevel === 'standard' ? '기본' : '전체'} 정보)
          </LoginButton>
        </div>
      </div>
    </div>
  );
};