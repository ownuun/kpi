# 🏢 Multi-Agent Development System

KPI Tracker를 위한 **4단계 계층형 멀티 에이전트 개발 시스템**입니다.

회사 조직 구조처럼 작동하며, 상위 에이전트는 "숲"을 보고 전략을 수립하고, 하위 에이전트는 완벽한 실행을 담당합니다.

## 🎯 시스템 개요

```
┌─────────────────────────────────────────┐
│ Level 1: Chief Development Agent       │
│ (총괄 - 전체 프로젝트 아키텍처 이해)      │
└─────────────────────────────────────────┘
              ↓
    ┌─────────┼─────────┐
    ▼         ▼         ▼
┌────────┐ ┌────────┐ ┌────────┐
│Frontend│ │Backend │ │Integration│
│Manager │ │Manager │ │Manager    │
└────────┘ └────────┘ └────────┘
    ↓         ↓         ↓
[Team Leads - 7명]
    ↓
[Specialists - 13명+]
```

## 📁 디렉토리 구조

```
multi-agent-system/
├── .claude/
│   └── agents/
│       ├── level-1-orchestrator/
│       │   └── chief-dev-agent.md          # 총괄 에이전트
│       ├── level-2-managers/
│       │   ├── frontend-manager.md         # 프론트엔드 매니저
│       │   ├── backend-manager.md          # 백엔드 매니저
│       │   └── integration-manager.md      # 통합 매니저
│       ├── level-3-leads/
│       │   ├── component-lead.md           # 컴포넌트 리드
│       │   ├── api-lead.md                 # API 리드
│       │   ├── sns-lead.md                 # SNS 리드
│       │   └── db-lead.md                  # DB 리드
│       └── level-4-specialists/
│           ├── ui-component-builder.md     # UI 빌더
│           ├── api-route-creator.md        # API 생성자
│           └── linkedin-integrator.md      # LinkedIn 통합
│
├── lib/
│   └── coordination/
│       ├── types.ts                        # 타입 정의
│       └── logger.ts                       # 로깅 시스템
│
└── docs/
    ├── README.md                           # 이 파일
    ├── USAGE_GUIDE.md                      # 사용 가이드
    └── ARCHITECTURE.md                     # 아키텍처 설계
```

## 🤖 에이전트 계층

### Level 1: Orchestrator (총괄)
- **Chief Development Agent**: 전체 프로젝트 아키텍처를 이해하고 도메인 매니저들에게 작업 할당

### Level 2: Domain Managers (도메인 매니저)
- **Frontend Manager**: Next.js/React/UI 컴포넌트 관리
- **Backend Manager**: Prisma/API/데이터베이스 관리
- **Integration Manager**: 외부 API 통합 관리

### Level 3: Team Leads (팀 리드)
- **Component Lead**: React 컴포넌트 생성
- **API Lead**: Next.js API 라우트 생성
- **SNS Lead**: LinkedIn, Facebook 등 SNS 통합
- **DB Lead**: Prisma 스키마 관리

### Level 4: Specialists (전문가)
- **UI Component Builder**: UI 컴포넌트 구현
- **API Route Creator**: API 엔드포인트 구현
- **LinkedIn Integrator**: LinkedIn API 통합
- (추가 전문가들...)

## 🔄 작동 방식

### 1. 사용자 요청
```
"리드 폼 + API + LinkedIn 연동 만들어줘"
```

### 2. Chief Dev Agent 분석
```typescript
분석:
- Frontend 필요: LeadForm 컴포넌트
- Backend 필요: POST /api/leads
- Integration 필요: LinkedIn API

의존성:
- LeadForm ↔ API (병렬 가능)
- LinkedIn 동기화 (API 완료 후)

실행 계획:
1. 병렬: Frontend Manager + Backend Manager
2. 순차: Integration Manager
```

### 3. 병렬 실행
```typescript
// 동시 실행
Task(frontend-manager): "LeadForm 생성"
Task(backend-manager): "POST /api/leads 생성"

// 대기
await Promise.all([frontendTask, backendTask]);

// 순차 실행
Task(integration-manager): "LinkedIn 동기화"
```

### 4. 계층적 위임
```
Frontend Manager
  ↓
Component Lead
  ↓
UI Component Builder
  ↓
LeadForm.tsx 생성 완료
```

### 5. 상향 보고
```
UI Component Builder → Component Lead
  ↓ (검증)
Component Lead → Frontend Manager
  ↓ (검증)
Frontend Manager → Chief Dev Agent
  ↓ (종합)
Chief Dev Agent → 사용자
```

## 📊 Coordination Log 시스템

모든 에이전트 간 통신은 구조화된 로그로 기록됩니다:

```typescript
{
  agentLevel: 1,
  agentName: "chief-dev-agent",
  taskId: "task-123",
  phase: "routing",
  status: "in_progress",
  summary: "리드 폼 생성 작업을 Frontend, Backend에 할당",
  delegatedTo: ["frontend-manager", "backend-manager"],
  timestamp: 1234567890
}
```

### 로그 조회
```typescript
import { logger } from './lib/coordination/logger';

// 특정 작업의 모든 로그
const logs = await logger.getTaskLogs("task-123");

// 특정 에이전트의 모든 로그
const agentLogs = await logger.getAgentLogs("frontend-manager");

// 작업 트리 시각화
const tree = await logger.getTaskTree("task-123");
console.log(tree);
// └─ chief-dev-agent
//   ├─ frontend-manager
//   │  └─ component-lead
//   │     └─ ui-component-builder
//   └─ backend-manager
//      └─ api-lead
//         └─ api-route-creator
```

## 🚀 시작하기

### 1. 에이전트 호출

Claude Code에서 에이전트는 `.claude/agents/` 디렉토리에 있는 설정 파일을 통해 자동으로 인식됩니다.

```bash
# Chief Dev Agent가 자동으로 활성화됨
# 사용자가 크로스커팅 기능을 요청하면 자동 호출됨
```

### 2. 예시 요청

```
사용자: "SNS 포스트 예약 기능 추가해줘"
```

Chief Dev Agent가:
1. 분석: Frontend (달력 UI) + Backend (scheduledAt 필드) + Cron job 필요
2. 의존성: DB 스키마가 먼저 필요 → 순차 실행
3. 위임:
   - Backend Manager → DB Lead → scheduledAt 추가
   - Frontend Manager → Component Lead → DateTimePicker 추가
4. 검증: 통합 테스트
5. 보고: 사용자에게 완료 알림

## 📋 에이전트 특성

### Chief Dev Agent (Opus)
- **모델**: opus (강력한 추론)
- **도구**: All (Read, Write, Edit, Task, Grep, Glob, Bash, WebSearch)
- **역할**: 전략적 의사결정, 의존성 관리

### Domain Managers (Sonnet)
- **모델**: sonnet (균형잡힌 성능)
- **도구**: Read, Write, Edit, Task, Grep, Glob
- **역할**: 도메인별 라우팅, 패턴 강제

### Team Leads (Sonnet)
- **모델**: sonnet
- **도구**: Read, Write, Edit, Grep, Glob
- **역할**: 작업 분해, 전문가 위임

### Specialists (Haiku)
- **모델**: haiku (빠르고 효율적)
- **도구**: Read, Write, Edit
- **역할**: 완벽한 실행

## ✅ 성공 기준

- ✅ 정확한 라우팅: 올바른 매니저에게 작업 할당
- ✅ 의존성 관리: 순차/병렬 실행 적절히 선택
- ✅ 통합 검증: 모든 조각이 올바르게 결합
- ✅ 패턴 준수: shadcn/ui, Zod, Prisma 패턴 일관성
- ✅ 에러 처리: 각 레벨에서 적절한 에러 핸들링

## 📚 더 알아보기

- [USAGE_GUIDE.md](./docs/USAGE_GUIDE.md) - 상세 사용 가이드
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - 아키텍처 설계 문서
- [../kpi-automation-platform/docs/](../kpi-automation-platform/docs/) - KPI Tracker 문서

## 🎯 다음 단계

1. ✅ Level 1-4 에이전트 생성 완료
2. ⏳ 추가 전문가 에이전트 (Facebook, SendGrid, etc)
3. ⏳ 테스트 에이전트 (Unit, E2E)
4. ⏳ 실제 작업으로 시스템 검증

---

**회사처럼 일하는 AI 에이전트 시스템** 🏢
