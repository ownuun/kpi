# Lead Pipeline Kanban Board

Twenty CRM 데이터를 사용한 리드 파이프라인 칸반 보드 시스템입니다.

## 기능 개요

### 주요 기능

1. **드래그 앤 드롭 파이프라인**
   - 리드를 드래그하여 단계 간 이동
   - 실시간으로 Twenty CRM에 동기화
   - 부드러운 애니메이션과 시각적 피드백

2. **파이프라인 단계**
   - 새 문의 (new)
   - 연락됨 (contacted)
   - 자격 검증 (qualified)
   - 미팅 예정 (meeting_scheduled)
   - 제안 중 (proposal)
   - 거래 성사 (won)
   - 손실 (lost)

3. **리드 관리**
   - 리드 카드 클릭으로 상세 정보 확인
   - 인라인 편집 기능
   - 리드 삭제 기능
   - 각 단계에서 빠른 리드 추가

4. **통계 대시보드**
   - 총 리드 수
   - 파이프라인 가치
   - 성사된 거래 수 및 금액
   - 전환율
   - 평균 거래액

5. **필터링 및 정렬**
   - 비즈니스 라인별 필터
   - 담당자별 필터
   - 검색 기능 (이름, 이메일, 회사)
   - 다양한 정렬 옵션 (최근 생성순, 금액순, 이름순)

## 파일 구조

```
apps/web-dashboard/
├── app/
│   ├── api/
│   │   └── pipeline/
│   │       ├── route.ts              # GET, POST - 리드 목록 및 생성
│   │       └── [id]/
│   │           └── route.ts          # GET, PATCH, DELETE - 개별 리드 관리
│   └── pipeline/
│       └── page.tsx                  # 메인 파이프라인 페이지
├── components/
│   └── pipeline/
│       ├── index.ts                  # 컴포넌트 export
│       ├── KanbanBoard.tsx           # 메인 칸반 보드 (DnD 컨텍스트)
│       ├── KanbanColumn.tsx          # 단계별 컬럼
│       ├── LeadCard.tsx              # 리드 카드 (드래그 가능)
│       ├── LeadDetailModal.tsx       # 리드 상세/편집 모달
│       ├── LeadQuickAdd.tsx          # 빠른 리드 추가 폼
│       └── PipelineStats.tsx         # 통계 카드
└── types/
    └── pipeline.ts                   # 타입 정의
```

## 설치 및 설정

### 1. 환경 변수 설정

`.env` 파일 생성:

```bash
# Twenty CRM Configuration
TWENTY_API_KEY=your_twenty_api_key_here
TWENTY_API_URL=https://api.twenty.com/graphql
```

### 2. 의존성 설치

이미 설치된 패키지:
- `@dnd-kit/core` - 드래그 앤 드롭 코어
- `@dnd-kit/sortable` - 정렬 가능한 리스트
- `@dnd-kit/utilities` - DnD 유틸리티

### 3. Twenty CRM 통합

이 시스템은 `@kpi/integrations-twenty` 패키지를 사용하여 Twenty CRM과 통합됩니다:

```typescript
import { TwentySDK } from '@kpi/integrations-twenty';

const twenty = new TwentySDK({
  apiKey: process.env.TWENTY_API_KEY || '',
  baseUrl: process.env.TWENTY_API_URL
});

// 리드 목록 조회
const leads = await twenty.listPeople({
  limit: 1000,
  orderBy: 'createdAt',
  orderDirection: 'DESC'
});
```

## API 엔드포인트

### GET /api/pipeline

리드 목록을 조회합니다.

**Query Parameters:**
- `businessLine` (optional): 비즈니스 라인으로 필터
- `assignedTo` (optional): 담당자로 필터
- `stage` (optional): 파이프라인 단계로 필터

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "lead-id",
      "firstName": "홍",
      "lastName": "길동",
      "email": "hong@example.com",
      "phone": "010-1234-5678",
      "jobTitle": "CEO",
      "companyName": "Example Corp",
      "stage": "new",
      "amount": 10000000,
      "probability": 50,
      "businessLine": "Enterprise",
      "assignedTo": "김영업",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

### POST /api/pipeline

새 리드를 생성합니다.

**Request Body:**
```json
{
  "firstName": "홍",
  "lastName": "길동",
  "email": "hong@example.com",
  "phone": "010-1234-5678",
  "jobTitle": "CEO",
  "companyId": "company-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-lead-id",
    "firstName": "홍",
    "lastName": "길동",
    ...
  }
}
```

### PATCH /api/pipeline/[id]

리드를 업데이트합니다 (단계 이동 포함).

**Request Body:**
```json
{
  "stage": "contacted",
  "notes": "첫 연락 완료",
  "amount": 15000000
}
```

### DELETE /api/pipeline/[id]

리드를 삭제합니다.

**Response:**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

## 컴포넌트 상세

### KanbanBoard

메인 칸반 보드 컴포넌트. DnD 컨텍스트와 상태 관리를 담당합니다.

**Props:**
- `leads`: Lead[] - 전체 리드 목록
- `onUpdateLead`: (id: string, updates: Partial<Lead>) => void
- `onDeleteLead`: (id: string) => void
- `onAddLead`: (lead: any) => void

**Features:**
- 필터링 (검색, 비즈니스 라인, 담당자)
- 정렬 (생성일, 금액, 이름)
- 드래그 앤 드롭 처리
- 통계 표시

### KanbanColumn

개별 파이프라인 단계 컬럼.

**Props:**
- `id`: PipelineStage
- `title`: string
- `color`: string
- `leads`: Lead[]
- `onLeadClick`: (lead: Lead) => void
- `onAddLead`: (lead: any) => void

**Features:**
- 단계별 리드 카운트
- 총 금액 표시
- 빠른 리드 추가
- 드롭 영역 하이라이트

### LeadCard

개별 리드 카드 컴포넌트 (드래그 가능).

**Props:**
- `lead`: Lead
- `onClick`: () => void

**Display:**
- 아바타 또는 이니셜
- 이름, 직책
- 회사명
- 연락처 (이메일, 전화)
- 예상 거래액 및 확률
- 비즈니스 라인, 담당자 태그

### LeadDetailModal

리드 상세 정보 및 편집 모달.

**Props:**
- `lead`: Lead | null
- `isOpen`: boolean
- `onClose`: () => void
- `onUpdate`: (id: string, updates: Partial<Lead>) => void
- `onDelete`: (id: string) => void

**Features:**
- 모든 리드 정보 표시
- 인라인 편집 모드
- 단계 변경
- 리드 삭제
- LinkedIn 링크

### LeadQuickAdd

단계별 빠른 리드 추가 폼.

**Props:**
- `stage`: PipelineStage
- `onAdd`: (lead: any) => void

**Fields:**
- 이름, 성 (필수)
- 이메일
- 전화번호
- 직책
- 회사명
- 예상 거래액

### PipelineStats

파이프라인 통계 대시보드.

**Props:**
- `leads`: Lead[]

**Metrics:**
- 총 리드 (진행 중)
- 파이프라인 가치
- 성사된 거래
- 성사 금액
- 전환율
- 평균 거래액

## 타입 정의

### Lead

```typescript
interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  companyName?: string;
  companyId?: string;
  stage: PipelineStage;
  amount?: number;
  probability?: number;
  businessLine?: string;
  assignedTo?: string;
  notes?: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  linkedinUrl?: string;
}
```

### PipelineStage

```typescript
type PipelineStage =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'meeting_scheduled'
  | 'proposal'
  | 'won'
  | 'lost';
```

## 사용 방법

### 1. 파이프라인 페이지 접근

```
http://localhost:3000/pipeline
```

### 2. 리드 이동

1. 리드 카드를 클릭하고 드래그
2. 원하는 단계 컬럼으로 이동
3. 드롭하면 자동으로 Twenty CRM에 동기화

### 3. 리드 추가

1. 각 컬럼 상단의 "리드 추가" 버튼 클릭
2. 필수 정보 입력 (이름, 성)
3. "추가" 버튼 클릭

### 4. 리드 상세 확인/편집

1. 리드 카드 클릭
2. 모달에서 상세 정보 확인
3. "수정" 버튼으로 편집 모드 진입
4. 정보 수정 후 "저장"

### 5. 필터링 및 검색

1. 상단 필터 바에서 옵션 선택
2. 검색창에 키워드 입력
3. 정렬 옵션 변경

## Twenty CRM 단계 매핑

Twenty CRM의 Opportunity 단계와 우리 시스템의 매핑:

| Twenty Stage | Our Stage | 설명 |
|-------------|-----------|------|
| NEW | new | 새 문의 |
| SCREENING | contacted | 연락됨 |
| QUALIFIED | qualified | 자격 검증 |
| MEETING | meeting_scheduled | 미팅 예정 |
| PROPOSAL | proposal | 제안 중 |
| CUSTOMER | won | 거래 성사 |
| LOST | lost | 손실 |

## 성능 최적화

1. **낙관적 업데이트**: UI가 먼저 업데이트되고 백그라운드에서 API 호출
2. **메모이제이션**: useMemo로 필터링/정렬 결과 캐싱
3. **드래그 활성화 제약**: 8px 이동 후에만 드래그 시작
4. **Virtual Scrolling**: 향후 많은 리드에 대비한 최적화 가능

## 향후 개선사항

1. **Activity Timeline**: 리드별 활동 기록
2. **Bulk Actions**: 다중 선택 및 일괄 작업
3. **Custom Fields**: 사용자 정의 필드 지원
4. **Notifications**: 실시간 알림
5. **Email Integration**: 이메일 직접 발송
6. **Forecasting**: AI 기반 거래 예측
7. **Mobile Optimization**: 모바일 반응형 최적화
8. **Offline Support**: 오프라인 모드 지원

## 문제 해결

### Twenty CRM 연결 실패

```bash
# .env 파일 확인
TWENTY_API_KEY=your_actual_api_key
TWENTY_API_URL=https://api.twenty.com/graphql
```

### 드래그가 작동하지 않음

- 브라우저 캐시 클리어
- @dnd-kit 패키지 재설치
- React 버전 확인 (19.0.0)

### 리드가 표시되지 않음

- API 응답 확인: `/api/pipeline`
- Twenty CRM에 실제 데이터 존재 여부 확인
- 콘솔 에러 메시지 확인

## 라이선스

MIT License
