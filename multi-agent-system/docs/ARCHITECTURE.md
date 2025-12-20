# 🏗️ Multi-Agent System Architecture

계층형 멀티 에이전트 시스템의 아키텍처 설계 문서입니다.

## 📐 설계 원칙

### 1. 계층적 책임 분리 (Hierarchical Separation of Concerns)

```
Level 1: 전략 (Strategy)
  → 전체 시스템 이해, 의존성 관리, 라우팅

Level 2: 전술 (Tactics)
  → 도메인별 전문성, 패턴 강제, 작업 분해

Level 3: 작전 (Operations)
  → 구체적 작업 계획, 전문가 위임, 검증

Level 4: 실행 (Execution)
  → 완벽한 코드 구현, 패턴 준수, 보고
```

### 2. 단방향 데이터 흐름 (Unidirectional Data Flow)

#### 하향 (Command Flow)
```
User → L1 → L2 → L3 → L4
(요청)  (분석) (계획) (위임) (실행)
```

#### 상향 (Report Flow)
```
L4 → L3 → L2 → L1 → User
(완료) (검증) (통합) (종합) (결과)
```

### 3. 통신 로그 (Coordination Log)

모든 에이전트 간 통신은 구조화된 로그로 기록:

```typescript
interface CoordinationLogEntry {
  agentLevel: 1 | 2 | 3 | 4;
  agentName: string;
  parentAgent?: string;
  childrenAgents?: string[];
  taskId: string;
  phase: 'routing' | 'delegation' | 'execution' | 'verification' | 'synthesis';
  status: 'in_progress' | 'completed' | 'error' | 'blocked';
  timestamp: number;
  summary: string;
  output?: any;
}
```

## 🎯 에이전트 설계

### Level 1: Orchestrator

**Chief Development Agent**

```yaml
Model: claude-opus-4-5
Tools: Read, Write, Edit, Task, Grep, Glob, Bash, WebSearch
Permission: plan

책임:
- 전체 프로젝트 아키텍처 이해
- 비즈니스 라인별 구조 파악
- 11개 Prisma 모델 관계 이해
- 팀 구조 (Person A/B/C) 인지
- 외부 API 의존성 관리

의사결정:
- 어떤 도메인 매니저에게 할당할지
- 병렬 vs 순차 실행 판단
- 의존성 순서 결정
- 통합 검증 수행
```

**의사결정 트리:**
```
요청 분석
  ├─ UI only? → Frontend Manager
  ├─ API only? → Backend Manager
  ├─ Integration only? → Integration Manager
  ├─ UI + API? → Frontend ∥ Backend
  └─ DB + UI? → Backend → Frontend (순차)
```

### Level 2: Domain Managers

#### Frontend Manager

```yaml
Model: claude-sonnet-4-5
Tools: Read, Write, Edit, Task, Grep, Glob
Permission: acceptEdits

도메인 지식:
- Next.js 15.1 App Router
- React 19 패턴
- shadcn/ui 컴포넌트
- Tailwind CSS 스킴
- Recharts + Tremor

라우팅:
- 컴포넌트 생성 → Component Lead
- 페이지 생성 → Page Lead
- 차트 → Component Lead

패턴 강제:
- React Hook Form + Zod
- shadcn/ui 필수
- Tailwind only (no inline styles)
- 비즈니스 라인 컬러
```

#### Backend Manager

```yaml
Model: claude-sonnet-4-5
Tools: Read, Write, Edit, Task, Grep, Glob, Bash
Permission: acceptEdits

도메인 지식:
- Prisma 6.2.0 스키마
- PostgreSQL 관계
- Next.js API Routes
- Zod 검증

라우팅:
- 스키마 변경 → DB Lead
- API 생성 → API Lead
- 쿼리 최적화 → API Lead

중요 규칙:
- 스키마 변경 후 pnpm db:generate 필수
- Cascade 규칙 엄격히 적용
- 트랜잭션 사용 (다중 테이블)
- 인덱스 최적화
```

#### Integration Manager

```yaml
Model: claude-sonnet-4-5
Tools: Read, Write, Edit, Task, Grep, Glob, WebSearch, WebFetch
Permission: acceptEdits

도메인 지식:
- OAuth 2.0 플로우
- LinkedIn Share API v2
- Facebook Graph API
- Google Calendar API
- SendGrid API

라우팅:
- SNS 통합 → SNS Lead
- Email → Email Lead
- Calendar → Calendar Lead

패턴 강제:
- OAuth 토큰 관리
- Rate limiting 처리
- Webhook 서명 검증
- 재시도 로직 (exponential backoff)
```

### Level 3: Team Leads

#### Component Lead

```yaml
Model: claude-sonnet-4-5
Tools: Read, Write, Edit, Grep, Glob
Permission: acceptEdits

전문 분야:
- React 컴포넌트 패턴
- shadcn/ui 통합
- 폼 검증
- 차트 컴포넌트

위임:
- 단순 UI → UI Component Builder
- 복잡한 폼 → Form Validator
- 차트 → Chart Builder
- 스타일 → Tailwind Styler

검증:
- shadcn/ui 사용 확인
- Zod 검증 (폼)
- 접근성 속성
- 명명 규칙
```

#### API Lead

```yaml
Model: claude-sonnet-4-5
Tools: Read, Write, Edit, Grep, Glob
Permission: acceptEdits

전문 분야:
- Next.js Route Handlers
- Prisma 쿼리
- HTTP 상태 코드
- 에러 응답

위임:
- CRUD → API Route Creator
- 복잡한 쿼리 → Database Query Writer
- 에러 핸들링 → Error Handler

검증:
- Zod 검증 확인
- Prisma 에러 처리
- 상태 코드 (200/201/400/404/500)
- console.error 로깅
```

#### SNS Lead

```yaml
Model: claude-sonnet-4-5
Tools: Read, Write, Edit, WebSearch, WebFetch
Permission: acceptEdits

전문 분야:
- OAuth 2.0
- LinkedIn/Facebook/Instagram API
- Rate limiting
- Webhook 처리

위임:
- LinkedIn → LinkedIn Integrator
- Facebook → Facebook Integrator
- Instagram → Instagram Integrator

검증:
- OAuth 플로우 완성도
- Rate limit 처리
- 토큰 갱신 로직
- 에러 핸들링
```

#### DB Lead

```yaml
Model: claude-sonnet-4-5
Tools: Read, Write, Edit, Bash
Permission: acceptEdits

전문 분야:
- Prisma schema
- 인덱스 최적화
- Migration
- Seed data

책임:
- 스키마 수정
- Prisma Client 재생성
- pnpm db:generate 실행
- pnpm db:push 실행

검증:
- 스키마 문법
- Cascade 규칙
- 인덱스 추가
- Prisma Client 타입 업데이트
```

### Level 4: Specialists

#### UI Component Builder

```yaml
Model: claude-haiku-4
Tools: Write, Edit, Read
Permission: acceptEdits

역할: 100% 정확한 컴포넌트 구현
패턴: shadcn/ui 템플릿 엄격히 준수
속도: 빠른 실행 (haiku)
```

#### API Route Creator

```yaml
Model: claude-haiku-4
Tools: Write, Edit, Read
Permission: acceptEdits

역할: 프로덕션 준비 API 라우트
패턴: Zod + Prisma + 에러 핸들링
속도: 빠른 실행 (haiku)
```

#### LinkedIn Integrator

```yaml
Model: claude-haiku-4
Tools: Write, Edit, Read, WebSearch, WebFetch
Permission: acceptEdits

역할: LinkedIn API 완벽 구현
패턴: OAuth + Share API v2
속도: 빠른 실행 (haiku)
```

## 🔄 실행 패턴

### 1. 병렬 실행 (Parallel)

```typescript
// 의존성이 없는 경우
const tasks = await Promise.all([
  Task(frontend-manager, "Create UI"),
  Task(backend-manager, "Create API"),
  Task(integration-manager, "Setup LinkedIn"),
]);
```

**조건:**
- 작업 간 의존성 없음
- 파일 충돌 없음
- 동시 실행 가능

**예시:**
- LeadForm 컴포넌트 + POST /api/leads API
- 여러 SNS 플랫폼 통합 (LinkedIn, Facebook, Instagram)

### 2. 순차 실행 (Sequential)

```typescript
// 의존성이 있는 경우
await Task(backend-manager, "Add scheduledAt to Post model");
// Prisma Client 재생성 대기
await Task(frontend-manager, "Add DateTimePicker to PostEditor");
```

**조건:**
- 작업 간 의존성 존재
- 순서 중요
- 한 작업의 출력이 다른 작업의 입력

**예시:**
- DB 스키마 변경 → UI 업데이트
- API 생성 → 통합 테스트
- OAuth 구현 → API 클라이언트

### 3. 하이브리드 (Hybrid)

```typescript
// 1단계: 순차 (의존성)
await Task(backend-manager, "Setup DB");

// 2단계: 병렬 (독립적)
await Promise.all([
  Task(frontend-manager, "Create UI"),
  Task(integration-manager, "Setup API"),
]);

// 3단계: 순차 (통합)
await Task(chief-dev-agent, "Integration test");
```

## 📊 Coordination Log Architecture

### 로그 저장 구조

```
.claude/coordination-logs/
├── task-001.jsonl    # 작업 1의 모든 로그
├── task-002.jsonl    # 작업 2의 모든 로그
└── task-003.jsonl    # 작업 3의 모든 로그
```

### JSONL 형식

```jsonl
{"agentLevel":1,"agentName":"chief-dev-agent","taskId":"task-001","phase":"routing","status":"in_progress","timestamp":1234567890}
{"agentLevel":2,"agentName":"frontend-manager","taskId":"task-001","phase":"delegation","status":"in_progress","timestamp":1234567891}
{"agentLevel":4,"agentName":"ui-component-builder","taskId":"task-001","phase":"execution","status":"completed","timestamp":1234567892}
```

### 로그 쿼리

```typescript
class CoordinationLogger {
  // 작업별 조회 (O(n), n = 작업의 로그 수)
  async getTaskLogs(taskId: string): Promise<CoordinationLogEntry[]>

  // 에이전트별 조회 (O(m*n), m = 전체 작업 수, n = 평균 로그 수)
  async getAgentLogs(agentName: string): Promise<CoordinationLogEntry[]>

  // 트리 구조 생성 (O(n))
  async getTaskTree(taskId: string): Promise<string>

  // 통계 계산 (O(n))
  async getStats(taskId: string): Promise<Stats>
}
```

## 🎯 확장성 설계

### 새로운 전문가 추가

```yaml
# .claude/agents/level-4-specialists/facebook-integrator.md
---
name: facebook-integrator
description: Facebook Graph API 통합 전문가
tools: Write, Edit, Read, WebSearch, WebFetch
model: haiku
permissionMode: acceptEdits
---
```

SNS Lead가 자동으로 인식하고 위임 가능.

### 새로운 도메인 추가

```yaml
# .claude/agents/level-2-managers/devops-manager.md
---
name: devops-manager
description: DevOps 및 인프라 관리
tools: Read, Write, Edit, Task, Bash
model: sonnet
permissionMode: acceptEdits
---
```

Chief Dev Agent의 라우팅 로직에 추가:
```typescript
if (request.includes("deploy") || request.includes("CI/CD")) {
  route to devops-manager;
}
```

## 🔒 보안 설계

### 1. 권한 관리

```
Level 1 (Orchestrator): plan mode
Level 2 (Managers): acceptEdits
Level 3 (Leads): acceptEdits
Level 4 (Specialists): acceptEdits
```

### 2. 환경 변수 보호

```typescript
// ✅ 안전
const apiKey = process.env.LINKEDIN_CLIENT_SECRET;

// ❌ 위험
const apiKey = "hardcoded-secret";
```

### 3. 에러 로깅

```typescript
// ✅ 민감 정보 제외
console.error('API Error:', { status: error.status });

// ❌ 민감 정보 노출
console.error('API Error:', error); // 토큰 포함 가능
```

## 📈 성능 최적화

### 모델 선택 전략

```
Level 1: Opus (강력한 추론 필요)
  → 의존성 분석, 아키텍처 결정

Level 2-3: Sonnet (균형)
  → 도메인 전문성, 패턴 강제

Level 4: Haiku (빠른 실행)
  → 템플릿 기반 구현
```

### 병렬 실행 최대화

```typescript
// ❌ 느림 (순차)
await createComponent();
await createAPI();
await createIntegration();

// ✅ 빠름 (병렬)
await Promise.all([
  createComponent(),
  createAPI(),
  createIntegration(),
]);
```

## 🧪 테스트 전략

### 단위 테스트 (Specialist 레벨)

```typescript
// UI Component Builder
test('creates LeadForm component', () => {
  // 템플릿 기반 생성 테스트
});

// API Route Creator
test('creates POST /api/leads', () => {
  // Zod + Prisma 패턴 테스트
});
```

### 통합 테스트 (Manager 레벨)

```typescript
// Frontend Manager
test('frontend workflow', async () => {
  // Component Lead → UI Builder 흐름 테스트
});
```

### E2E 테스트 (Orchestrator 레벨)

```typescript
// Chief Dev Agent
test('full stack feature', async () => {
  // 요청 → 실행 → 검증 전체 흐름
});
```

---

**확장 가능하고 유지보수 가능한 에이전트 아키텍처** 🏗️
