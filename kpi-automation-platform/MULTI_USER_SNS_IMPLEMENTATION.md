# 사용자별 SNS 계정 연결 및 자동 포스팅 구현 완료

## 🎉 구현 완료!

각 사용자가 자신의 SNS 계정(LinkedIn, Twitter, Facebook, Instagram, Threads)을 연결하고, 포스팅 작성 시 자동으로 해당 사용자의 계정으로 게시되도록 구현되었습니다.

---

## ✅ 완료된 기능

### 1. 사용자 인증 시스템 (NextAuth)
- **이메일/비밀번호 로그인** 구현
- **회원가입** 기능 (bcrypt 비밀번호 해싱)
- **JWT 기반 세션 관리**
- **자동 로그인** 유지 (30일)

**파일:**
- [lib/auth.ts](apps/web-dashboard/lib/auth.ts) - NextAuth 설정
- [app/api/auth/[...nextauth]/route.ts](apps/web-dashboard/app/api/auth/[...nextauth]/route.ts) - API 라우트
- [app/auth/login/page.tsx](apps/web-dashboard/app/auth/login/page.tsx) - 로그인 페이지
- [app/auth/register/page.tsx](apps/web-dashboard/app/auth/register/page.tsx) - 회원가입 페이지
- [app/api/auth/register/route.ts](apps/web-dashboard/app/api/auth/register/route.ts) - 회원가입 API

### 2. 데이터베이스 스키마
- **SocialAccount 모델** 추가
- **사용자별 SNS 계정 연결** 저장
- **플랫폼별 기본 계정** 설정 가능
- **OAuth 토큰** 저장 (암호화 권장)

**스키마:**
```prisma
model SocialAccount {
  id                  String    @id @default(cuid())
  userId              String
  user                User      @relation(...)

  platform            String    // "LINKEDIN", "TWITTER", etc.
  accountName         String    // 계정 표시명
  accountId           String    // 플랫폼 고유 ID
  postizIntegrationId String    // Postiz integration ID

  accessToken         String?
  refreshToken        String?
  expiresAt           DateTime?

  isPrimary           Boolean   @default(false)
  isActive            Boolean   @default(true)

  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}
```

### 3. Postiz SDK Integration
- **Integration 관리 메서드** 추가
- **OAuth URL 생성**
- **Token 교환**
- **사용자별 계정으로 포스팅**

**새로운 메서드:**
```typescript
integrations = {
  listIntegrations(): Promise<Integration[]>
  getAuthUrl(params): Promise<string>
  exchangeToken(code): Promise<Integration>
  createPostWithIntegration(integrationId, request): Promise<Post>
  deleteIntegration(integrationId): Promise<void>
}
```

### 4. 계정 관리 UI
- **연결된 계정 목록** 표시
- **새 계정 연결** 버튼
- **기본 계정 설정** 기능
- **계정 연결 해제** 기능
- **플랫폼별 아이콘 및 색상**

**페이지:** [app/settings/accounts/page.tsx](apps/web-dashboard/app/settings/accounts/page.tsx)

### 5. OAuth 플로우 API
- **OAuth 시작**: `/api/oauth/connect?platform=LINKEDIN`
- **OAuth 콜백**: `/api/oauth/callback`
- **계정 목록 조회**: `GET /api/social-accounts`
- **계정 삭제**: `DELETE /api/social-accounts/[id]`
- **기본 계정 설정**: `POST /api/social-accounts/[id]/set-primary`

### 6. 자동 계정 선택 로직
- **로그인한 사용자 확인**
- **플랫폼별 연결된 계정 조회**
- **기본 계정 자동 선택** (isPrimary 우선)
- **각 계정으로 개별 포스팅**
- **계정 없음 에러 처리**

---

## 🚀 사용 방법

### 1. 데이터베이스 설정

```bash
# PostgreSQL 실행 (Docker)
docker run --name postgres -e POSTGRES_PASSWORD=kpi_password -p 5432:5432 -d postgres

# 마이그레이션 실행
cd kpi-tracker
npx prisma migrate dev --name add_social_accounts
npx prisma generate
```

### 2. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env
```

**필수 환경 변수:**
```bash
# Database
DATABASE_URL=postgresql://kpi_user:kpi_password@localhost:5432/kpi_platform

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_64_character_random_secret_here

# Postiz
POSTIZ_API_URL=http://localhost:5000
POSTIZ_API_KEY=your_postiz_api_key
```

**NEXTAUTH_SECRET 생성:**
```bash
openssl rand -base64 32
```

### 3. 애플리케이션 실행

```bash
pnpm install
pnpm dev
```

### 4. 사용 플로우

#### 사용자 A
1. http://localhost:3000/auth/register 접속하여 회원가입
2. 로그인 후 http://localhost:3000/settings/accounts 이동
3. LinkedIn, Twitter 계정 연결
4. 포스트 작성 시 → **자동으로 사용자 A의 LinkedIn, Twitter 계정**으로 발행

#### 사용자 B
1. 회원가입 및 로그인
2. Facebook, Instagram 계정 연결
3. 포스트 작성 시 → **자동으로 사용자 B의 Facebook, Instagram 계정**으로 발행

---

## 📊 데이터 흐름

```
사용자 로그인
    ↓
포스트 작성 (플랫폼 선택: LinkedIn, Twitter)
    ↓
POST /api/posts
    ↓
1. 세션에서 userId 가져오기
2. DB에서 userId + platform으로 연결된 계정 조회
    - LinkedIn: user_account_1 (isPrimary: true)
    - Twitter: user_account_2 (isPrimary: true)
    ↓
3. 각 계정의 postizIntegrationId로 Postiz API 호출
    - Postiz.integrations.createPostWithIntegration(id_1, content)
    - Postiz.integrations.createPostWithIntegration(id_2, content)
    ↓
4. Postiz가 실제 SNS 플랫폼에 포스팅
    ↓
✅ 사용자의 계정으로 포스트 발행 완료!
```

---

## 🔒 보안 고려사항

### 1. 비밀번호 보안
- bcrypt 해싱 (salt rounds: 10)
- 최소 6자 이상
- 데이터베이스에 평문 저장 안함

### 2. 세션 보안
- JWT 기반
- httpOnly 쿠키
- 30일 만료
- CSRF 토큰 (NextAuth 자동 처리)

### 3. OAuth 토큰 보안
- **현재**: DB에 평문 저장
- **권장**: AES-256-GCM 암호화
- **TODO**: 토큰 암호화 라이브러리 추가

```typescript
// 향후 개선 예시
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  // ...
}
```

### 4. API 보호
- 모든 API는 `await auth()` 세션 검증
- 본인 계정만 접근 가능
- Rate limiting 권장 (향후 추가)

---

## 🎯 주요 API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/[...nextauth]` - 로그인

### SNS 계정 관리
- `GET /api/social-accounts` - 연결된 계정 목록
- `DELETE /api/social-accounts/[id]` - 계정 연결 해제
- `POST /api/social-accounts/[id]/set-primary` - 기본 계정 설정

### OAuth
- `GET /api/oauth/connect?platform=LINKEDIN` - OAuth 시작
- `GET /api/oauth/callback?code=xxx&state=userId` - OAuth 콜백

### 포스팅
- `POST /api/posts` - 포스트 생성 (자동 계정 선택)

---

## 🧪 테스트 시나리오

### 시나리오 1: 신규 사용자
1. ✅ 회원가입 → 로그인
2. ✅ 설정 > 계정 관리 이동
3. ✅ LinkedIn 계정 연결
4. ✅ Twitter 계정 연결 (두 번째 계정)
5. ✅ 포스트 작성
   - LinkedIn, Twitter 선택
   - "Publish Now" 클릭
   - **결과**: 두 계정 모두에 포스트 발행됨

### 시나리오 2: 기본 계정 변경
1. ✅ LinkedIn 계정 2개 연결 (개인, 회사)
2. ✅ "회사" 계정을 기본으로 설정
3. ✅ 포스트 작성 (LinkedIn 선택)
   - **결과**: 회사 계정으로 발행됨

### 시나리오 3: 계정 없음 에러
1. ✅ Facebook 계정 연결 안함
2. ✅ 포스트 작성 시 Facebook 선택
   - **결과**: "FACEBOOK 계정이 연결되지 않았습니다" 에러

### 시나리오 4: 여러 사용자
1. ✅ 사용자 A: LinkedIn + Twitter 연결
2. ✅ 사용자 B: Facebook + Instagram 연결
3. ✅ 각자 포스트 작성
   - **결과**: 각자 자신의 계정으로만 발행됨

---

## 📁 파일 구조

```
apps/web-dashboard/
├── lib/
│   ├── auth.ts                    # NextAuth 설정
│   ├── postiz.ts                  # Postiz SDK (integrations 추가)
│   └── api-utils.ts               # 에러 처리 유틸
├── app/
│   ├── auth/
│   │   ├── login/page.tsx         # 로그인
│   │   └── register/page.tsx      # 회원가입
│   ├── settings/
│   │   └── accounts/page.tsx      # 계정 관리
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   └── register/route.ts
│   │   ├── oauth/
│   │   │   ├── connect/route.ts
│   │   │   └── callback/route.ts
│   │   ├── social-accounts/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── set-primary/route.ts
│   │   └── posts/
│   │       └── route.ts           # 인증 및 계정 선택 추가
│   ├── providers.tsx              # SessionProvider
│   └── layout.tsx                 # Providers 래퍼
├── types/
│   └── next-auth.d.ts            # NextAuth 타입

kpi-tracker/
└── prisma/
    └── schema.prisma             # SocialAccount 모델 추가
```

---

## 🔧 향후 개선 사항

### 1. 토큰 암호화
- [ ] OAuth 토큰 AES-256 암호화
- [ ] 암호화 키 환경 변수 관리
- [ ] 토큰 자동 갱신

### 2. 에러 처리 강화
- [ ] 토큰 만료 자동 감지
- [ ] 재인증 안내 UI
- [ ] Retry 로직

### 3. UI/UX 개선
- [ ] 계정 연결 상태 실시간 표시
- [ ] 포스트 작성 시 미리보기 (계정별)
- [ ] 발행 성공/실패 피드백

### 4. 성능 최적화
- [ ] Prisma Client 싱글톤
- [ ] API 응답 캐싱
- [ ] 병렬 포스팅 성능 개선

### 5. 추가 기능
- [ ] 계정별 포스팅 스케줄링
- [ ] Analytics 대시보드 (계정별)
- [ ] 팀 계정 공유 기능

---

## 📞 문의 및 지원

구현 관련 질문이나 이슈가 있으시면:
1. [SETUP_GUIDE.md](SETUP_GUIDE.md) 확인
2. [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) 참고
3. GitHub Issues 등록

---

## 📝 라이선스

이 프로젝트는 사내용 시스템입니다.

---

**구현 완료일**: 2025-12-20
**개발자**: Claude Sonnet 4.5
**버전**: 1.0.0
