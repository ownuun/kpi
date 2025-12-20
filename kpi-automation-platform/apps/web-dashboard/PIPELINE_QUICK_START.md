# Pipeline Kanban Board - Quick Start Guide

## 5분 안에 시작하기

이 가이드는 리드 파이프라인 칸반 보드를 최대한 빠르게 실행하는 방법을 안내합니다.

## 전제 조건

- Node.js 18+ 설치
- pnpm (또는 npm) 설치
- Twenty CRM API 키

## 1단계: 환경 변수 설정 (1분)

`.env` 파일 생성:

```bash
cd C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard
cp .env.example .env
```

`.env` 파일 편집:

```bash
TWENTY_API_KEY=your_actual_api_key_here
TWENTY_API_URL=https://api.twenty.com/graphql
```

### Twenty CRM API 키 발급 방법

1. Twenty CRM 대시보드 접속
2. Settings → API → Generate API Key
3. 생성된 키를 복사하여 `.env`에 붙여넣기

## 2단계: 의존성 설치 (2분)

```bash
# 프로젝트 루트로 이동
cd C:\Users\GoGo\Desktop\233\kpi-automation-platform

# 의존성 설치 (이미 설치되어 있음)
pnpm install

# web-dashboard만 설치하려면
pnpm install --filter @kpi/web-dashboard
```

## 3단계: 개발 서버 실행 (1분)

```bash
# web-dashboard 디렉토리에서
cd apps/web-dashboard
pnpm dev

# 또는 프로젝트 루트에서
pnpm --filter @kpi/web-dashboard dev
```

## 4단계: 브라우저에서 확인 (1분)

```
http://localhost:3000/pipeline
```

축하합니다! 리드 파이프라인 칸반 보드가 실행되었습니다.

## 빠른 기능 테스트

### 1. 리드 추가하기

1. 아무 컬럼의 "리드 추가" 버튼 클릭
2. 이름과 성 입력 (필수)
3. 기타 정보 입력 (선택)
4. "추가" 버튼 클릭

### 2. 리드 이동하기

1. 리드 카드를 클릭하고 드래그
2. 다른 단계 컬럼으로 이동
3. 드롭하면 Twenty CRM에 자동 동기화

### 3. 리드 상세 보기

1. 리드 카드 클릭
2. 모달에서 전체 정보 확인
3. "수정" 버튼으로 정보 편집 가능

### 4. 필터링 및 정렬

1. 상단 검색창에 키워드 입력
2. 드롭다운으로 비즈니스 라인/담당자 필터
3. 정렬 옵션 변경

## 트러블슈팅

### 문제 1: "API key is invalid"

**원인**: Twenty CRM API 키가 올바르지 않음

**해결**:
1. `.env` 파일 확인
2. API 키 재발급
3. 서버 재시작 (`pnpm dev` 다시 실행)

### 문제 2: "Failed to fetch leads"

**원인**: Twenty CRM API 연결 실패

**해결**:
1. 인터넷 연결 확인
2. Twenty CRM API URL 확인: `https://api.twenty.com/graphql`
3. Twenty CRM 서비스 상태 확인

### 문제 3: 드래그가 작동하지 않음

**원인**: 브라우저 호환성 또는 JavaScript 에러

**해결**:
1. 최신 Chrome/Edge 브라우저 사용
2. 브라우저 콘솔에서 에러 확인 (F12)
3. 페이지 새로고침 (Ctrl+Shift+R)

### 문제 4: 리드가 표시되지 않음

**원인**: Twenty CRM에 데이터가 없음

**해결**:
1. Twenty CRM에 직접 접속하여 Person 데이터 확인
2. 테스트 데이터 추가
3. "새로고침" 버튼 클릭

## 파일 구조 한눈에 보기

```
apps/web-dashboard/
├── app/
│   ├── api/pipeline/          ← API 엔드포인트
│   └── pipeline/              ← 메인 페이지
├── components/pipeline/       ← UI 컴포넌트
└── types/pipeline.ts          ← 타입 정의
```

## 핵심 파일

| 파일 | 역할 | 수정 필요성 |
|------|------|------------|
| `.env` | API 설정 | 필수 |
| `app/pipeline/page.tsx` | 메인 페이지 | 거의 없음 |
| `components/pipeline/KanbanBoard.tsx` | 메인 로직 | 커스터마이징 시 |
| `types/pipeline.ts` | 타입 정의 | 필드 추가 시 |

## 다음 단계

### 커스터마이징

1. **파이프라인 단계 수정**
   - `types/pipeline.ts`의 `PIPELINE_STAGES` 배열 편집

2. **필드 추가**
   - `types/pipeline.ts`의 `Lead` 인터페이스 확장
   - 해당 컴포넌트에 UI 추가

3. **스타일 변경**
   - Tailwind CSS 클래스 수정
   - `tailwind.config.ts`에서 테마 커스터마이징

### 고급 기능

1. **인증 추가**
   - Next-Auth 설정
   - API 라우트에 미들웨어 추가

2. **실시간 업데이트**
   - WebSocket 또는 Polling 구현
   - React Query 도입

3. **알림 시스템**
   - Toast 라이브러리 추가
   - 이벤트 핸들러에 알림 통합

## 유용한 명령어

```bash
# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# TypeScript 타입 체크
pnpm type-check

# ESLint 실행
pnpm lint

# 전체 클린
pnpm clean
```

## API 테스트 (curl)

### 리드 목록 조회
```bash
curl http://localhost:3000/api/pipeline
```

### 리드 생성
```bash
curl -X POST http://localhost:3000/api/pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "테스트",
    "lastName": "사용자",
    "email": "test@example.com"
  }'
```

### 리드 업데이트
```bash
curl -X PATCH http://localhost:3000/api/pipeline/[lead-id] \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "contacted"
  }'
```

## 성능 최적화 팁

1. **리드 제한**: Twenty CRM에서 한 번에 가져올 리드 수 제한
   ```typescript
   // app/api/pipeline/route.ts
   const response = await twenty.listPeople({
     limit: 500  // 기본값: 1000
   });
   ```

2. **캐싱**: React Query로 데이터 캐싱
   ```bash
   pnpm add @tanstack/react-query
   ```

3. **Virtual Scrolling**: 많은 리드에 대해 가상 스크롤링 적용
   ```bash
   pnpm add react-virtuoso
   ```

## 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 환경 변수 설정 (Vercel)

1. Vercel 대시보드 → Settings → Environment Variables
2. `TWENTY_API_KEY` 추가
3. `TWENTY_API_URL` 추가

## 데이터 구조 예시

### Lead Object

```json
{
  "id": "lead-123",
  "firstName": "홍",
  "lastName": "길동",
  "email": "hong@example.com",
  "phone": "010-1234-5678",
  "jobTitle": "CEO",
  "companyName": "Example Corp",
  "companyId": "comp-456",
  "stage": "new",
  "amount": 10000000,
  "probability": 50,
  "businessLine": "Enterprise",
  "assignedTo": "김영업",
  "notes": "잠재 고객",
  "source": "Website",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-02T00:00:00Z",
  "avatarUrl": "https://...",
  "linkedinUrl": "https://linkedin.com/in/..."
}
```

## 주요 타입

```typescript
// Pipeline Stage
type PipelineStage =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'meeting_scheduled'
  | 'proposal'
  | 'won'
  | 'lost';

// Lead Interface
interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  stage: PipelineStage;
  // ... 기타 필드
}
```

## 학습 리소스

### 공식 문서
- [Next.js 문서](https://nextjs.org/docs)
- [dnd-kit 문서](https://docs.dndkit.com/)
- [Twenty CRM API](https://docs.twenty.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### 관련 파일
- `PIPELINE_README.md` - 전체 기능 설명
- `PIPELINE_ARCHITECTURE.md` - 아키텍처 다이어그램
- `PIPELINE_IMPLEMENTATION_SUMMARY.md` - 구현 요약

## 지원

문제가 발생하면:

1. 콘솔 에러 확인 (F12)
2. Network 탭에서 API 요청 확인
3. 환경 변수 재확인
4. 서버 재시작

## 체크리스트

시작 전:
- [ ] Node.js 18+ 설치됨
- [ ] pnpm 설치됨
- [ ] Twenty CRM API 키 발급받음

설정 후:
- [ ] `.env` 파일 생성됨
- [ ] API 키 설정됨
- [ ] 의존성 설치됨
- [ ] 개발 서버 실행됨
- [ ] `/pipeline` 페이지 접속 가능

기능 테스트:
- [ ] 리드 목록 로딩됨
- [ ] 리드 드래그 앤 드롭 작동
- [ ] 리드 추가 가능
- [ ] 리드 상세 모달 열림
- [ ] 필터링 작동
- [ ] 정렬 작동

## 마무리

이제 리드 파이프라인 칸반 보드를 사용할 준비가 완료되었습니다!

궁금한 점이 있으면 문서를 참고하거나, 코드를 직접 살펴보세요. 모든 컴포넌트는 명확한 주석과 함께 작성되어 있습니다.

Happy coding! 🚀
