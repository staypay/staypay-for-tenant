/**
 * 테스트 앱 - 모든 예제를 한 곳에서 확인
 *
 * 이 파일을 App.tsx에 import하여 모든 예제를 테스트할 수 있습니다.
 * import TestApp from '@examples/TestApp';
 */

import React, { useState } from "react";
import {
  SimpleLoginExample,
  CustomLoginButtonExample,
  LoadingErrorExample,
  ConditionalRenderExample,
  CustomClickHandlerExample,
} from "./BasicAuthExample";
import { RoleBasedExample } from "./ProtectedRouteExample";
import {
  DynamicConfigExample,
  TokenRefreshExample,
  MultiAccountExample,
  SessionManagementExample,
  AuthSyncExample,
} from "./AdvancedAuthExample";
import { useAuth } from "@hooks/useAuth";

// 탭 네비게이션 컴포넌트
const TabNavigation: React.FC<{
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`
              py-2 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

// 예제 섹션 컴포넌트
const ExampleSection: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="border-t pt-4">{children}</div>
    </div>
  );
};

// 메인 테스트 앱
const TestApp: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("기본");
  const [activeExample, setActiveExample] = useState("simple");
  const { user, isAuthenticated, logout } = useAuth();

  const categories = ["기본", "보호된 라우트", "고급 기능"];

  const examples = {
    기본: [
      {
        id: "simple",
        name: "간단한 로그인",
        component: <SimpleLoginExample />,
      },
      {
        id: "custom-button",
        name: "커스텀 버튼",
        component: <CustomLoginButtonExample />,
      },
      {
        id: "loading-error",
        name: "로딩/에러",
        component: <LoadingErrorExample />,
      },
      {
        id: "conditional",
        name: "조건부 렌더링",
        component: <ConditionalRenderExample />,
      },
      {
        id: "custom-handler",
        name: "커스텀 핸들러",
        component: <CustomClickHandlerExample />,
      },
    ],
    "보호된 라우트": [
      {
        id: "role-based",
        name: "역할 기반 접근",
        component: <RoleBasedExample />,
      },
    ],
    "고급 기능": [
      {
        id: "dynamic-config",
        name: "동적 설정",
        component: <DynamicConfigExample />,
      },
      {
        id: "token-refresh",
        name: "토큰 갱신",
        component: <TokenRefreshExample />,
      },
      {
        id: "multi-account",
        name: "다중 계정",
        component: <MultiAccountExample />,
      },
      {
        id: "session-mgmt",
        name: "세션 관리",
        component: <SessionManagementExample />,
      },
      { id: "auth-sync", name: "탭 동기화", component: <AuthSyncExample /> },
    ],
  };

  const currentExamples =
    examples[activeCategory as keyof typeof examples] || [];
  const currentExample = currentExamples.find((e) => e.id === activeExample);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">🔐 인증 시스템 테스트</h1>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">
                    {user?.name} ({user?.provider})
                  </span>
                  <button
                    onClick={logout}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <span className="text-sm text-gray-500">로그인되지 않음</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* 사이드바 */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="font-semibold mb-4">카테고리</h2>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      setActiveExample(
                        examples[category as keyof typeof examples][0]?.id || ""
                      );
                    }}
                    className={`
                      w-full text-left px-3 py-2 rounded text-sm
                      ${
                        activeCategory === category
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "hover:bg-gray-50"
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2 text-sm text-gray-600">
                  예제 목록
                </h3>
                <div className="space-y-1">
                  {currentExamples.map((example) => (
                    <button
                      key={example.id}
                      onClick={() => setActiveExample(example.id)}
                      className={`
                        w-full text-left px-3 py-1.5 rounded text-sm
                        ${
                          activeExample === example.id
                            ? "bg-gray-100 font-medium"
                            : "hover:bg-gray-50"
                        }
                      `}
                    >
                      {example.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 정보 패널 */}
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">💡 테스트 팁</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 각 예제를 클릭하여 테스트</li>
                <li>• 로그인/로그아웃 상태 확인</li>
                <li>• 콘솔에서 로그 확인</li>
                <li>• 개발자 도구 네트워크 탭 활용</li>
              </ul>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">
                  {currentExample?.name || "예제 선택"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {activeCategory} › {currentExample?.name}
                </p>
              </div>

              <div className="p-6">
                {currentExample?.component || (
                  <div className="text-center text-gray-500 py-12">
                    왼쪽에서 예제를 선택하세요
                  </div>
                )}
              </div>
            </div>

            {/* 상태 모니터 */}
            <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium mb-3">🔍 현재 인증 상태</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">인증 여부:</span>
                  <span className="ml-2 font-medium">
                    {isAuthenticated ? "✅ 인증됨" : "❌ 미인증"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">사용자 ID:</span>
                  <span className="ml-2 font-mono text-xs">
                    {user?.id || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">이메일:</span>
                  <span className="ml-2">{user?.email || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-600">제공자:</span>
                  <span className="ml-2">{user?.provider || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestApp;
