# 카카오 로그인 설정 가이드

## 📝 카카오 개발자 콘솔 설정

### 1. 앱 생성
1. [카카오 개발자 콘솔](https://developers.kakao.com) 접속
2. 내 애플리케이션 > 애플리케이션 추가하기
3. 앱 이름, 사업자명 입력

### 2. 플랫폼 설정
1. 앱 설정 > 플랫폼 > Web 플랫폼 등록
2. 사이트 도메인 추가:
   - 개발: `http://localhost:5173`
   - 프로덕션: `https://your-domain.com`

### 3. 카카오 로그인 활성화
1. 제품 설정 > 카카오 로그인 > 활성화 설정 ON
2. Redirect URI 등록:
   - `http://localhost:5173/auth/kakao/callback`
   - `https://your-domain.com/auth/kakao/callback`

### 4. 동의 항목 설정 ⚠️ 중요
제품 설정 > 카카오 로그인 > 동의 항목에서 사용할 정보 설정

#### 필수 동의 항목
- **닉네임** (profile_nickname) - 기본 제공

#### 선택 동의 항목 (필요시 추가)
- **프로필 사진** (profile_image)
- **카카오계정(이메일)** (account_email)
- **성별** (gender)
- **연령대** (age_range)
- **생일** (birthday)

> ⚠️ **주의**: 동의 항목을 추가하지 않고 코드에서 요청하면 에러 발생!

## 🔧 코드 설정

### 1. 환경 변수 설정 (.env.local)
```env
VITE_KAKAO_CLIENT_ID=your_rest_api_key
VITE_KAKAO_CLIENT_SECRET=your_client_secret
VITE_KAKAO_REDIRECT_URI=http://localhost:5173/auth/kakao/callback
```

### 2. 동의 항목 설정 (App.tsx)

#### 최소 설정 (닉네임만)
```typescript
import { configureAuth, SCOPE_PRESETS } from '@config/auth.config';

configureAuth({
  providers: {
    kakao: {
      clientId: import.meta.env.VITE_KAKAO_CLIENT_ID,
      redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
      scope: SCOPE_PRESETS.kakao.minimal,  // 닉네임만
    },
  },
});
```

#### 기본 설정 (닉네임 + 프로필 이미지 + 이메일)
```typescript
configureAuth({
  providers: {
    kakao: {
      clientId: import.meta.env.VITE_KAKAO_CLIENT_ID,
      redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
      scope: SCOPE_PRESETS.kakao.basic,  // 닉네임, 프로필 이미지, 이메일
    },
  },
});
```

#### 커스텀 설정
```typescript
import { KAKAO_SCOPES } from '@config/auth.config';

configureAuth({
  providers: {
    kakao: {
      clientId: import.meta.env.VITE_KAKAO_CLIENT_ID,
      redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
      scope: [
        KAKAO_SCOPES.PROFILE,        // 닉네임 (필수)
        KAKAO_SCOPES.PROFILE_IMAGE,  // 프로필 이미지
        KAKAO_SCOPES.ACCOUNT_EMAIL,  // 이메일
        // 필요한 항목만 추가
      ],
    },
  },
});
```

## 🐛 일반적인 오류 해결

### 1. "설정하지 않은 카카오 로그인 동의 항목" 오류
```
설정하지 않은 카카오 로그인 동의 항목을 포함해 인가 코드를 요청했습니다.
설정하지 않은 동의 항목: profile_image,account_email
```

**해결 방법:**
1. 카카오 개발자 콘솔에서 해당 동의 항목 추가
2. 또는 코드에서 해당 스코프 제거

### 2. "invalid_grant" 오류
- 인가 코드가 만료되었거나 이미 사용됨
- 해결: 새로운 로그인 시도

### 3. "KOE006" 오류
- Redirect URI가 등록되지 않음
- 해결: 카카오 개발자 콘솔에서 Redirect URI 추가

## 📊 동의 항목별 받을 수 있는 정보

### profile_nickname (기본 동의)
```json
{
  "properties": {
    "nickname": "홍길동"
  }
}
```

### profile_image (선택 동의)
```json
{
  "properties": {
    "profile_image": "http://k.kakaocdn.net/..."
  }
}
```

### account_email (선택 동의)
```json
{
  "kakao_account": {
    "email": "user@example.com",
    "email_needs_agreement": false,
    "is_email_valid": true,
    "is_email_verified": true
  }
}
```

## 🔍 테스트 체크리스트

- [ ] 카카오 개발자 콘솔에서 앱 생성 완료
- [ ] Web 플랫폼 등록 완료
- [ ] Redirect URI 등록 완료
- [ ] 필요한 동의 항목 설정 완료
- [ ] 환경 변수(.env.local) 설정 완료
- [ ] 코드에서 scope 설정이 동의 항목과 일치
- [ ] 로그인 테스트 성공

## 📚 참고 자료

- [카카오 로그인 공식 문서](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
- [동의 항목 설정 가이드](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#consent-item)
- [에러 코드 목록](https://developers.kakao.com/docs/latest/ko/kakaologin/trouble-shooting)