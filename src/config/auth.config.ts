// 카카오 동의 항목 상수
export const KAKAO_SCOPES = {
  // 사용자 정보
  PROFILE: "profile_nickname", // 닉네임 (기본 동의)
  PROFILE_IMAGE: "profile_image", // 프로필 사진 (선택 동의)
  ACCOUNT_EMAIL: "account_email", // 이메일 (선택 동의)
  GENDER: "gender", // 성별 (선택 동의)
  AGE_RANGE: "age_range", // 연령대 (선택 동의)
  BIRTHDAY: "birthday", // 생일 (선택 동의)

  // 추가 정보
  PHONE_NUMBER: "phone_number", // 전화번호 (선택 동의)
  SHIPPING_ADDRESS: "shipping_address", // 배송지 (선택 동의)

  // 카카오 서비스
  TALK_MESSAGE: "talk_message", // 카카오톡 메시지 전송
  FRIENDS: "friends", // 친구 목록 (선택 동의)
} as const;

// 구글 OAuth 스코프 상수
export const GOOGLE_SCOPES = {
  // 기본 정보
  OPENID: "openid", // OpenID Connect
  EMAIL: "email", // 이메일 주소
  PROFILE: "profile", // 기본 프로필 정보

  // Google API 접근
  CALENDAR: "https://www.googleapis.com/auth/calendar", // 캘린더
  DRIVE: "https://www.googleapis.com/auth/drive", // 드라이브
  GMAIL: "https://www.googleapis.com/auth/gmail.readonly", // Gmail 읽기
  YOUTUBE: "https://www.googleapis.com/auth/youtube.readonly", // YouTube
} as const;

interface AuthProvider {
  clientId: string;
  redirectUri: string;
  scope?: string[]; // 배열도 지원
  responseType?: string;
  additionalParams?: Record<string, string>;
}

interface AuthConfig {
  providers: {
    google?: AuthProvider;
    kakao?: AuthProvider;
  };
  storage?: {
    tokenKey?: string;
    userKey?: string;
  };
  callbacks?: {
    onLoginSuccess?: (user: unknown) => void;
    onLoginError?: (error: Error) => void;
    onLogout?: () => void;
  };
}

// scope 배열을 문자열로 변환하는 헬퍼 함수
const formatScope = (scope?: string[]): string[] => {
  if (!scope) return [];
  return Array.isArray(scope) ? scope : [scope];
};

// 기본 설정 - 최소한의 필수 동의 항목만 포함
const defaultConfig: AuthConfig = {
  providers: {
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
      redirectUri:
        import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
        window.location.origin + "/auth/google/callback",
      scope: [
        GOOGLE_SCOPES.OPENID,
        // GOOGLE_SCOPES.EMAIL,
        // GOOGLE_SCOPES.PROFILE
      ],
      responseType: "code",
    },
    kakao: {
      clientId: import.meta.env.VITE_KAKAO_CLIENT_ID || "",
      redirectUri:
        import.meta.env.VITE_KAKAO_REDIRECT_URI ||
        window.location.origin + "/auth/kakao/callback",
      // 카카오 개발자 콘솔에서 설정한 동의 항목만 포함
      // profile_nickname은 기본 동의 항목
      scope: [
        KAKAO_SCOPES.PROFILE, // 닉네임 (필수)
        // 아래 항목들은 카카오 앱 설정에서 동의 항목으로 추가한 경우에만 주석 해제
        // KAKAO_SCOPES.PROFILE_IMAGE,   // 프로필 이미지
        // KAKAO_SCOPES.ACCOUNT_EMAIL,   // 이메일
      ],
      responseType: "code",
    },
  },
  storage: {
    tokenKey: "auth_token",
    userKey: "auth_user",
  },
  callbacks: {},
};

let authConfig: AuthConfig = { ...defaultConfig };

export const configureAuth = (config: Partial<AuthConfig>) => {
  // providers 설정 시 scope 처리
  const processedProviders: AuthConfig["providers"] = {};

  if (config.providers?.google) {
    processedProviders.google = {
      ...config.providers.google,
      scope: formatScope(config.providers.google.scope),
    };
  }

  if (config.providers?.kakao) {
    processedProviders.kakao = {
      ...config.providers.kakao,
      scope: formatScope(config.providers.kakao.scope),
    };
  }

  authConfig = {
    ...authConfig,
    ...config,
    providers: {
      ...authConfig.providers,
      ...processedProviders,
    },
    storage: {
      ...authConfig.storage,
      ...config.storage,
    },
    callbacks: {
      ...authConfig.callbacks,
      ...config.callbacks,
    },
  };
};

export const getAuthConfig = () => {
  // 반환할 때 scope를 문자열로 변환
  const config = { ...authConfig };

  if (config.providers.google) {
    config.providers.google = {
      ...config.providers.google,
      scope: formatScope(config.providers.google.scope),
    };
  }

  if (config.providers.kakao) {
    config.providers.kakao = {
      ...config.providers.kakao,
      scope: formatScope(config.providers.kakao.scope),
    };
  }

  return config;
};

// 미리 정의된 스코프 세트
export const SCOPE_PRESETS = {
  kakao: {
    minimal: [KAKAO_SCOPES.PROFILE], // 닉네임만
    basic: [
      KAKAO_SCOPES.PROFILE,
      KAKAO_SCOPES.PROFILE_IMAGE,
      KAKAO_SCOPES.ACCOUNT_EMAIL,
    ],
    full: [
      KAKAO_SCOPES.PROFILE,
      KAKAO_SCOPES.PROFILE_IMAGE,
      KAKAO_SCOPES.ACCOUNT_EMAIL,
      KAKAO_SCOPES.GENDER,
      KAKAO_SCOPES.AGE_RANGE,
      KAKAO_SCOPES.BIRTHDAY,
    ],
  },
  google: {
    minimal: [GOOGLE_SCOPES.OPENID],
    basic: [GOOGLE_SCOPES.OPENID, GOOGLE_SCOPES.EMAIL, GOOGLE_SCOPES.PROFILE],
    extended: [
      GOOGLE_SCOPES.OPENID,
      GOOGLE_SCOPES.EMAIL,
      GOOGLE_SCOPES.PROFILE,
      GOOGLE_SCOPES.CALENDAR,
      GOOGLE_SCOPES.DRIVE,
    ],
  },
};

export type { AuthConfig, AuthProvider };
