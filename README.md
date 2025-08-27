# StayPay - 월세 대출 플랫폼 Demo

[Korea Stablecoin Hackathon](https://dorahacks.io/hackathon/korea-stablecoin-hackathon/detail) 제출작

월세 대출 신청 및 관리를 위한 웹 애플리케이션 프로토타입입니다.

## 주요 기능 (Demo)

- 💰 **월세 대출 신청** - 단계별 대출 신청 프로세스
- 📄 **계약서 업로드** - 임대차 계약서 파일 업로드 (Demo)
- 📊 **거래 내역 조회** - 대출 신청 현황 및 거래 내역
- 🔐 **OAuth 로그인** - Google/Kakao 소셜 로그인
- 👤 **프로필 관리** - 사용자 정보 조회

## 빠른 시작

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정 (선택사항)

`.env.example`을 `.env`로 복사 후 OAuth 설정:

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback

# Kakao OAuth  
VITE_KAKAO_CLIENT_ID=your_kakao_app_key
VITE_KAKAO_REDIRECT_URI=http://localhost:5173/auth/kakao/callback
```

> 참고: OAuth 설정 없이도 Demo 실행 가능

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 http://localhost:5173 접속

## 주요 화면

### 1. 홈 화면 (`/`)
- 월세 대출 신청 시작
- 빠른 액션 메뉴
- 최근 거래 내역

### 2. 대출 신청 (`/prepay`)
- 계약서 업로드
- 임차인 정보 입력  
- 임대인 정보 입력
- 계약 정보 확인
- 신청 완료

### 3. 거래 내역 (`/history`)
- 대출 신청 목록
- 상태별 필터링 (대기중/진행중/완료)
- 거래 상세 정보 조회

### 4. 프로필 (`/profile`)
- 사용자 정보 표시
- 로그아웃

## 프로젝트 구조

```
src/
├── assets/              # 정적 파일
│   └── fonts/          # Pretendard 폰트
├── components/         # UI 컴포넌트
│   ├── auth/          # 인증 관련
│   ├── core/          # 헤더, 네비게이션
│   ├── forms/         # 폼 컴포넌트
│   ├── layout/        # 레이아웃
│   ├── transactions/  # 거래 관련
│   └── ui/            # 기본 UI 요소
├── config/            # 설정 파일
├── hooks/             # React 훅
├── lib/               # 라이브러리
│   └── auth/         # OAuth 인증 시스템
├── pages/             # 페이지 컴포넌트
│   ├── prepay/       # 대출 신청 플로우
│   └── ...           # 기타 페이지
├── store/             # 상태 관리
└── types/             # TypeScript 타입
```


## 개발 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 린터 실행
npm run lint
```

## 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Tailwind CSS v3** - 스타일링
- **Zustand** - 상태 관리
- **Framer Motion** - 애니메이션
- **React Router v7** - 라우팅
- **lucide-react** - 아이콘