# 📖 Multi-Agent System 사용 가이드

이 가이드는 계층형 멀티 에이전트 시스템을 실제로 사용하는 방법을 설명합니다.

## 📋 목차

1. [기본 개념](#기본-개념)
2. [에이전트 호출하기](#에이전트-호출하기)
3. [작업 흐름 이해하기](#작업-흐름-이해하기)
4. [Coordination Log 활용](#coordination-log-활용)
5. [실전 예시](#실전-예시)
6. [트러블슈팅](#트러블슈팅)

## 기본 개념

### 계층 구조

```
Level 1 (Orchestrator)    → 전략가: 숲을 본다
Level 2 (Managers)        → 매니저: 도메인 전문성
Level 3 (Leads)           → 리드: 작업 분해
Level 4 (Specialists)     → 전문가: 완벽한 실행
```

### 통신 패턴

#### 하향식 (Tasking)
```
사용자 요청
  ↓
Orchestrator 분석 & 라우팅
  ↓
Manager 도메인별 처리
  ↓
Lead 작업 분해
  ↓
Specialist 실행
```

#### 상향식 (Reporting)
```
Specialist 완료 & 로그
  ↓
Lead 검증 & 보고
  ↓
Manager 통합 & 보고
  ↓
Orchestrator 종합 & 보고
  ↓
사용자에게 결과
```

## 에이전트 호출하기

### 자동 호출

Chief Dev Agent는 다음 패턴의 요청에 자동으로 활성화됩니다:

```bash
# 크로스커팅 기능
"리드 폼 + API 만들어줘"
"SNS 포스트 예약 기능 추가"
"구독 취소 기능 구현"

# 아키텍처 변경
"Post 모델에 scheduledAt 필드 추가하고 UI도 업데이트"
"비즈니스 라인별 대시보드 만들기"
```

### 수동 호출 (필요시)

특정 매니저를 직접 호출하려면:

```bash
# Frontend만 필요한 경우
@frontend-manager "LeadForm 컴포넌트 생성해줘"

# Backend만 필요한 경우
@backend-manager "POST /api/leads 엔드포인트 만들어줘"

# Integration만 필요한 경우
@integration-manager "LinkedIn 포스트 발행 구현해줘"
```

## 작업 흐름 이해하기

### 예시 1: 단순 UI 컴포넌트

```
요청: "MetricCard 컴포넌트 만들어줘"

흐름:
1. Chief Dev Agent
   - 분석: Frontend만 필요
   - 라우팅: Frontend Manager

2. Frontend Manager
   - 분석: 카드 컴포넌트
   - 라우팅: Component Lead

3. Component Lead
   - 분석: 단순 UI
   - 위임: UI Component Builder

4. UI Component Builder
   - 실행: MetricCard.tsx 생성
   - 로그: 완료

5. 상향 보고
   - Component Lead: 검증 (shadcn/ui 패턴 확인)
   - Frontend Manager: 검증 (파일명, 타입 확인)
   - Chief Dev Agent: 종합
   - 사용자: 완료 알림
```

### 예시 2: 풀스택 기능 (병렬)

```
요청: "리드 폼 + API 만들어줘"

흐름:
1. Chief Dev Agent
   - 분석: Frontend + Backend 필요
   - 의존성: 독립적 → 병렬 가능
   - 라우팅: Frontend Manager ∥ Backend Manager

2-A. Frontend Manager
   - Component Lead → UI Component Builder
   - 생성: LeadForm.tsx

2-B. Backend Manager (동시 실행)
   - API Lead → API Route Creator
   - 생성: app/api/leads/route.ts

3. Chief Dev Agent
   - 병렬 완료 대기
   - 검증: 타입 호환성 확인
   - 종합: 사용자에게 보고
```

### 예시 3: 순차 실행 (의존성)

```
요청: "Post 모델에 scheduledAt 추가하고 UI도 업데이트"

흐름:
1. Chief Dev Agent
   - 분석: Backend (스키마) + Frontend (UI)
   - 의존성: 스키마 먼저 → 순차 실행
   - 라우팅: Backend Manager (먼저)

2. Backend Manager
   - DB Lead → Prisma 스키마 수정
   - 명령: pnpm db:generate
   - 완료 로그

3. Chief Dev Agent
   - Backend 완료 확인
   - 라우팅: Frontend Manager (이제)

4. Frontend Manager
   - Component Lead → DateTimePicker 추가
   - 완료 로그

5. Chief Dev Agent
   - 통합 검증
   - 종합 보고
```

## Coordination Log 활용

### 로그 기록 예시

```typescript
// Chief Dev Agent의 로그
{
  agentLevel: 1,
  agentName: "chief-dev-agent",
  taskId: "task-001",
  phase: "routing",
  status: "in_progress",
  summary: "리드 폼 생성을 Frontend, Backend에 병렬 할당",
  delegatedTo: ["frontend-manager", "backend-manager"],
  timestamp: 1234567890
}

// Frontend Manager의 로그
{
  agentLevel: 2,
  agentName: "frontend-manager",
  parentAgent: "chief-dev-agent",
  taskId: "task-001",
  phase: "delegation",
  status: "in_progress",
  summary: "LeadForm 컴포넌트를 Component Lead에게 위임",
  childrenAgents: ["component-lead"],
  timestamp: 1234567891
}

// UI Component Builder의 로그
{
  agentLevel: 4,
  agentName: "ui-component-builder",
  parentAgent: "component-lead",
  taskId: "task-001",
  phase: "execution",
  status: "completed",
  summary: "LeadForm.tsx 생성 완료",
  output: {
    file: "components/forms/lead-form.tsx",
    linesOfCode: 85
  },
  timestamp: 1234567892
}
```

### 로그 조회

```typescript
import { logger } from '@/lib/coordination/logger';

// 1. 특정 작업의 전체 로그
const allLogs = await logger.getTaskLogs("task-001");
console.log(allLogs);

// 2. 작업 트리 시각화
const tree = await logger.getTaskTree("task-001");
console.log(tree);
/*
└─ chief-dev-agent
   ├─ frontend-manager
   │  └─ component-lead
   │     └─ ui-component-builder
   └─ backend-manager
      └─ api-lead
         └─ api-route-creator
*/

// 3. 작업 통계
const stats = await logger.getStats("task-001");
console.log(stats);
/*
{
  totalLogs: 12,
  byAgent: {
    "chief-dev-agent": 3,
    "frontend-manager": 2,
    "component-lead": 2,
    "ui-component-builder": 1,
    "backend-manager": 2,
    "api-lead": 1,
    "api-route-creator": 1
  },
  byPhase: {
    routing: 2,
    delegation: 4,
    execution: 2,
    verification: 3,
    synthesis: 1
  },
  duration: 45000 // ms
}
*/

// 4. 특정 에이전트의 모든 작업
const agentLogs = await logger.getAgentLogs("frontend-manager");
```

## 실전 예시

### 예시 1: SNS 포스트 예약 기능

**요청:**
```
"SNS 포스트 예약 기능 추가해줘. 날짜/시간 선택하면 나중에 자동 발행되게"
```

**Chief Dev Agent 분석:**
```typescript
{
  frontend: [
    "PostEditor에 DateTimePicker 추가",
    "scheduledAt 필드 추가"
  ],
  backend: [
    "Post 모델에 scheduledAt DateTime? 추가",
    "POST /api/posts에 scheduledAt 검증 추가",
    "Cron job으로 예약된 포스트 발행"
  ],
  dependencies: "Backend 스키마 먼저 → Frontend UI"
}
```

**실행 순서:**
```
1. Backend Manager
   - DB Lead: Post 모델 수정
   - Command: pnpm db:generate
   - API Lead: POST /api/posts 업데이트

2. Frontend Manager (Backend 완료 후)
   - Component Lead: DateTimePicker 컴포넌트
   - PostEditor 업데이트

3. Backend Manager (다시)
   - Cron job 설정

4. 통합 검증
```

### 예시 2: LinkedIn 포스트 발행

**요청:**
```
"LinkedIn에 포스트 발행하는 기능 구현해줘"
```

**Chief Dev Agent 분석:**
```typescript
{
  integration: [
    "LinkedIn OAuth 2.0 구현",
    "Share API v2 클라이언트",
    "Analytics 동기화"
  ],
  backend: [
    "POST /api/linkedin/posts 엔드포인트",
    "LinkedIn 토큰 저장"
  ],
  frontend: [
    "LinkedIn 연동 버튼",
    "발행 성공/실패 UI"
  ]
}
```

**실행 순서:**
```
1. Integration Manager (먼저)
   - SNS Lead → LinkedIn Integrator
   - OAuth + Share API 구현

2. Backend Manager ∥ Frontend Manager (병렬)
   - Backend: API 엔드포인트
   - Frontend: UI 컴포넌트

3. 통합 테스트
```

### 예시 3: 구독 취소 기능

**요청:**
```
"ANYON 구독 취소 기능 만들어줘"
```

**Chief Dev Agent 분석:**
```typescript
{
  backend: [
    "PATCH /api/subscriptions/[id]/cancel",
    "status → CANCELED",
    "canceledAt → now()"
  ],
  frontend: [
    "취소 버튼",
    "확인 다이얼로그"
  ]
}
```

**실행 순서:**
```
1. Backend Manager ∥ Frontend Manager (병렬)
   - API Lead: PATCH 엔드포인트
   - Component Lead: 버튼 + 다이얼로그

2. 통합 검증
```

## 트러블슈팅

### 문제 1: 에이전트가 호출되지 않음

**증상:**
```
요청했는데 Chief Dev Agent가 실행 안됨
```

**해결:**
```bash
# 1. 에이전트 파일 확인
ls .claude/agents/level-1-orchestrator/chief-dev-agent.md

# 2. 에이전트 설정 확인
cat .claude/agents/level-1-orchestrator/chief-dev-agent.md
# description 필드가 있는지 확인

# 3. 명시적 호출
@chief-dev-agent "리드 폼 만들어줘"
```

### 문제 2: 병렬 실행이 순차로 실행됨

**증상:**
```
Frontend와 Backend가 동시에 실행되어야 하는데 순차로 실행됨
```

**해결:**
```typescript
// Chief Dev Agent에서 확인
// ❌ 잘못됨 (순차)
await Task(frontend-manager);
await Task(backend-manager);

// ✅ 올바름 (병렬)
await Promise.all([
  Task(frontend-manager),
  Task(backend-manager),
]);
```

### 문제 3: Coordination Log가 기록 안됨

**증상:**
```
로그 파일이 생성되지 않음
```

**해결:**
```bash
# 1. 로그 디렉토리 생성
mkdir -p .claude/coordination-logs

# 2. 권한 확인
chmod 755 .claude/coordination-logs

# 3. Logger import 확인
# 각 에이전트에서 logger를 사용하는지 확인
```

### 문제 4: 스키마 변경 후 타입 에러

**증상:**
```
Prisma 스키마 변경했는데 TypeScript 에러
```

**해결:**
```bash
# DB Lead가 항상 실행해야 함
pnpm db:generate

# 확인
cat node_modules/.prisma/client/index.d.ts | grep "scheduledAt"
```

### 문제 5: 패턴이 일관되지 않음

**증상:**
```
컴포넌트가 shadcn/ui를 안쓰고 만들어짐
```

**해결:**
```typescript
// Component Lead가 검증 단계 추가
const verification = {
  usesShadcnUI: checkImports("@/components/ui"),
  usesReactHookForm: checkImports("react-hook-form"),
  usesZod: checkImports("zod"),
};

if (!verification.usesShadcnUI) {
  throw new Error("Must use shadcn/ui components");
}
```

## 📊 성과 측정

### KPI 추적

```typescript
// 작업 완료 시간
const stats = await logger.getStats("task-001");
console.log(`완료 시간: ${stats.duration}ms`);

// 에이전트별 작업량
console.log(stats.byAgent);

// 단계별 소요 시간
console.log(stats.byPhase);
```

### 개선 포인트

- 병렬 실행 비율 증가 → 속도 향상
- 에러 발생률 감소 → 품질 향상
- 검증 단계 자동화 → 일관성 향상

---

**이 시스템으로 더 빠르고 일관성 있는 개발을!** 🚀
