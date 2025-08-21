/**
 * 고급 인증 기능 예제
 * 실제 프로덕션에서 사용할 수 있는 고급 패턴들을 보여줍니다.
 */

import React, { useState, useEffect } from 'react';
import { configureAuth, getAuthConfig } from '@config/auth.config';
import { useAuthStore } from '@store/authStore';
import { authManager } from '@lib/auth/AuthManager';
import { LoginButton } from '@components/auth/LoginButton';
import type { User } from '@/types/auth.types';

/**
 * 1. 동적 설정 변경
 * - 런타임에 인증 설정을 변경하는 예제
 */
export const DynamicConfigExample: React.FC = () => {
  const [apiEndpoint, setApiEndpoint] = useState('production');

  // 환경에 따라 설정 변경
  const updateAuthConfig = (environment: string) => {
    const configs = {
      production: {
        providers: {
          google: {
            clientId: 'prod-google-client-id',
            redirectUri: 'https://myapp.com/auth/google/callback',
          },
          kakao: {
            clientId: 'prod-kakao-client-id',
            redirectUri: 'https://myapp.com/auth/kakao/callback',
          }
        }
      },
      development: {
        providers: {
          google: {
            clientId: 'dev-google-client-id',
            redirectUri: 'http://localhost:5173/auth/google/callback',
          },
          kakao: {
            clientId: 'dev-kakao-client-id',
            redirectUri: 'http://localhost:5173/auth/kakao/callback',
          }
        }
      }
    };

    configureAuth(configs[environment as keyof typeof configs]);
    setApiEndpoint(environment);
  };

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">환경 설정</h3>
      
      <div className="space-x-2 mb-6">
        <button
          onClick={() => updateAuthConfig('development')}
          className={`px-4 py-2 rounded ${
            apiEndpoint === 'development' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200'
          }`}
        >
          개발 환경
        </button>
        <button
          onClick={() => updateAuthConfig('production')}
          className={`px-4 py-2 rounded ${
            apiEndpoint === 'production' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200'
          }`}
        >
          프로덕션 환경
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        현재 환경: {apiEndpoint}
      </p>

      <div className="space-y-2">
        <LoginButton provider="google" />
        <LoginButton provider="kakao" />
      </div>
    </div>
  );
};

/**
 * 2. 토큰 갱신 예제
 * - 액세스 토큰 만료 시 자동 갱신
 */
export const TokenRefreshExample: React.FC = () => {
  const { user, updateTokens } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 토큰 만료 체크 및 갱신
  useEffect(() => {
    if (!user?.expiresAt) return;

    // 만료 5분 전에 갱신
    const refreshTime = user.expiresAt - 5 * 60 * 1000;
    const now = Date.now();

    if (now >= refreshTime) {
      refreshToken();
    }

    // 타이머 설정
    const timer = setTimeout(() => {
      refreshToken();
    }, refreshTime - now);

    return () => clearTimeout(timer);
  }, [user?.expiresAt]);

  const refreshToken = async () => {
    if (!user?.refreshToken) return;
    
    setIsRefreshing(true);
    try {
      // 실제 구현에서는 백엔드 API 호출
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: user.refreshToken }),
      });
      
      const data = await response.json();
      
      // 스토어 업데이트
      updateTokens(
        data.accessToken,
        data.refreshToken,
        data.expiresIn
      );
      
      console.log('토큰이 갱신되었습니다');
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">토큰 관리</h3>
      
      {user && (
        <div className="space-y-2 text-sm">
          <p>액세스 토큰: {user.accessToken?.substring(0, 20)}...</p>
          <p>
            만료 시간: {
              user.expiresAt 
                ? new Date(user.expiresAt).toLocaleString() 
                : '없음'
            }
          </p>
          <p>
            남은 시간: {
              user.expiresAt 
                ? Math.floor((user.expiresAt - Date.now()) / 1000) + '초'
                : '없음'
            }
          </p>
        </div>
      )}

      <button
        onClick={refreshToken}
        disabled={isRefreshing || !user?.refreshToken}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isRefreshing ? '갱신 중...' : '토큰 갱신'}
      </button>
    </div>
  );
};

/**
 * 3. 다중 계정 관리
 * - 여러 계정을 동시에 관리하는 예제
 */
export const MultiAccountExample: React.FC = () => {
  const [accounts, setAccounts] = useState<User[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const { user, setUser } = useAuthStore();

  // 계정 추가
  const addAccount = () => {
    // 새 창에서 로그인
    const loginWindow = window.open('/login', '_blank', 'width=500,height=600');
    
    // 메시지 리스너
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'LOGIN_SUCCESS') {
        const newUser = event.data.user as User;
        setAccounts(prev => [...prev, newUser]);
        window.removeEventListener('message', handleMessage);
      }
    };
    
    window.addEventListener('message', handleMessage);
  };

  // 계정 전환
  const switchAccount = (account: User) => {
    setUser(account);
    setActiveAccountId(account.id);
  };

  // 계정 제거
  const removeAccount = (accountId: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    if (activeAccountId === accountId) {
      setActiveAccountId(null);
      setUser(null);
    }
  };

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">다중 계정 관리</h3>
      
      <div className="space-y-4">
        {/* 계정 목록 */}
        <div className="space-y-2">
          {accounts.map(account => (
            <div
              key={account.id}
              className={`flex items-center justify-between p-3 rounded border ${
                activeAccountId === account.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                {account.picture && (
                  <img 
                    src={account.picture} 
                    alt={account.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className="text-sm text-gray-600">{account.email}</p>
                </div>
              </div>
              
              <div className="space-x-2">
                <button
                  onClick={() => switchAccount(account)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                >
                  사용
                </button>
                <button
                  onClick={() => removeAccount(account.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                >
                  제거
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 계정 추가 버튼 */}
        <button
          onClick={addAccount}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-gray-400"
        >
          + 계정 추가
        </button>
      </div>
    </div>
  );
};

/**
 * 4. 세션 관리 및 보안
 * - 세션 타임아웃, 활동 감지 등
 */
export const SessionManagementExample: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionTimeout, setSessionTimeout] = useState(30 * 60 * 1000); // 30분
  const [warningShown, setWarningShown] = useState(false);

  // 사용자 활동 감지
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
      setWarningShown(false);
    };

    // 이벤트 리스너 등록
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  // 세션 타임아웃 체크
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      
      // 경고 표시 (5분 전)
      if (inactiveTime > sessionTimeout - 5 * 60 * 1000 && !warningShown) {
        setWarningShown(true);
        if (confirm('세션이 곧 만료됩니다. 계속하시겠습니까?')) {
          setLastActivity(Date.now());
        }
      }
      
      // 세션 만료
      if (inactiveTime > sessionTimeout) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        logout();
      }
    }, 10000); // 10초마다 체크

    return () => clearInterval(interval);
  }, [user, lastActivity, sessionTimeout, warningShown, logout]);

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">세션 관리</h3>
      
      <div className="space-y-4">
        {/* 세션 정보 */}
        <div className="bg-gray-100 p-4 rounded space-y-2">
          <p className="text-sm">
            마지막 활동: {new Date(lastActivity).toLocaleTimeString()}
          </p>
          <p className="text-sm">
            비활동 시간: {Math.floor((Date.now() - lastActivity) / 1000)}초
          </p>
          <p className="text-sm">
            세션 타임아웃: {sessionTimeout / 60 / 1000}분
          </p>
        </div>

        {/* 타임아웃 설정 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            세션 타임아웃 설정
          </label>
          <select
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value={5 * 60 * 1000}>5분</option>
            <option value={15 * 60 * 1000}>15분</option>
            <option value={30 * 60 * 1000}>30분</option>
            <option value={60 * 60 * 1000}>1시간</option>
          </select>
        </div>

        {/* 보안 설정 */}
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">다른 기기 로그인 시 알림</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">2단계 인증 사용</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">로그인 기록 저장</span>
          </label>
        </div>
      </div>
    </div>
  );
};

/**
 * 5. 인증 상태 동기화
 * - 여러 탭/창 간 인증 상태 동기화
 */
export const AuthSyncExample: React.FC = () => {
  const { user, setUser, logout } = useAuthStore();

  useEffect(() => {
    // 다른 탭에서의 변경 감지
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_user') {
        if (e.newValue) {
          // 다른 탭에서 로그인
          const newUser = JSON.parse(e.newValue);
          setUser(newUser);
          console.log('다른 탭에서 로그인 감지');
        } else {
          // 다른 탭에서 로그아웃
          setUser(null);
          console.log('다른 탭에서 로그아웃 감지');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setUser]);

  // 브로드캐스트 채널을 통한 동기화
  useEffect(() => {
    const channel = new BroadcastChannel('auth_channel');
    
    channel.onmessage = (event) => {
      if (event.data.type === 'LOGIN') {
        setUser(event.data.user);
      } else if (event.data.type === 'LOGOUT') {
        setUser(null);
      }
    };

    return () => channel.close();
  }, [setUser]);

  const broadcastLogin = () => {
    const channel = new BroadcastChannel('auth_channel');
    channel.postMessage({ type: 'LOGIN', user });
    channel.close();
  };

  const broadcastLogout = () => {
    const channel = new BroadcastChannel('auth_channel');
    channel.postMessage({ type: 'LOGOUT' });
    channel.close();
    logout();
  };

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">탭 간 동기화</h3>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          이 예제는 여러 탭/창 간에 인증 상태를 동기화합니다.
        </p>

        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm">
            현재 상태: {user ? `${user.name} 로그인됨` : '로그아웃됨'}
          </p>
        </div>

        <div className="space-x-2">
          <button
            onClick={broadcastLogin}
            disabled={!user}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            로그인 브로드캐스트
          </button>
          <button
            onClick={broadcastLogout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            로그아웃 브로드캐스트
          </button>
        </div>

        <p className="text-xs text-gray-500">
          팁: 새 탭을 열고 이 페이지를 방문한 후 버튼을 클릭해보세요.
        </p>
      </div>
    </div>
  );
};