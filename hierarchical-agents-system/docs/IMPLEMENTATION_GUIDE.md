# Implementation Guide

계층적 AI 에이전트 시스템 구현을 위한 단계별 가이드입니다.

## 구현 로드맵

### Week 1: Foundation (기초)

**목표**: 핵심 인프라 구축 및 검증

#### 1.1 디렉토리 구조 생성 ✅

```bash
hierarchical-agents-system/
├── agents/
│   ├── layer1-strategic/
│   ├── layer2-tactical/
│   ├── layer3-operational/
│   └── layer4-execution/
├── skills/
├── state/
└── docs/
```

#### 1.2 Phase 1 에이전트 생성 ✅

**필수 에이전트** (4개):
- ✅ `layer1-strategic/project-orchestrator.md` - 중앙 조율
- ✅ `layer3-operational/infrastructure-lead.md` - 인프라 관리
- ✅ `layer4-execution/database-engineer.md` - DB 구현
- ✅ `layer4-execution/code-analyzer.md` - 코드 분석

#### 1.3 기초 스킬 생성 (1/5)

**필수 스킬**:
- ✅ `prisma-schema-manager` - DB 스키마 관리
- ⏳ `typescript-nextjs-dev` - Next.js 개발
- ⏳ `api-endpoint-builder` - API 구축
- ⏳ `component-creator` - React 컴포넌트
- ⏳ `code-analyzer` - 코드 분석 패턴

#### 1.4 상태 관리 구조 ✅

```bash
state/
├── tasks/
│   └── active.json ✅
├── coordination/
│   └── resource-locks.json ✅
└── reports/
```

#### 1.5 검증 테스트

**테스트 시나리오**:

```
Test 1: 코드베이스 분석
→ Project Orchestrator 호출
→ Code Analyzer 위임
→ 구조 보고서 생성
→ 성공 기준: 보고서 받음

Test 2: 스키마 필드 추가
→ Project Orchestrator 호출
→ Infrastructure Lead 위임
→ Database Engineer 실행
→ 성공 기준: 마이그레이션 생성

Test 3: 간단한 API 엔드포인트
→ Project Orchestrator 호출
→ Backend Director 위임 (Phase 2 필요)
→ API Developer 실행 (Phase 2 필요)
→ 성공 기준: 파일 생성 및 테스트 통과
```

**Week 1 성공 기준**:
- [x] 모든 필수 에이전트 생성
- [ ] Project Orchestrator가 작업 분석 및 위임 가능
- [ ] Code Analyzer가 코드베이스 분석 가능
- [ ] Infrastructure Lead가 DB 작업 수행 가능

---

### Week 2: Core Development (핵심 개발)

**목표**: 병렬 팀 개발 활성화

#### 2.1 Layer 2 Directors (4개)

**전술 계층 에이전트**:

```bash
# 생성할 파일들
.claude/agents/layer2-tactical/architecture-director.md
.claude/agents/layer2-tactical/frontend-director.md
.claude/agents/layer2-tactical/backend-director.md
.claude/agents/layer2-tactical/quality-director.md
```

**각 에이전트 템플릿**:

```yaml
---
name: [director-name]
description: [역할]. Use for [사용 시기].
model: sonnet
tools: Read, Grep, Glob, Bash, Task
permissionMode: plan
---

# [Director Name]

## Role
[전술적 역할 설명]

## Responsibilities
- [책임 1]
- [책임 2]

## Delegation Strategy
[어떤 Layer 3 에이전트에게 위임하는지]

## Communication
[Layer 1 및 Layer 3와 통신 방식]
```

#### 2.2 Layer 3 Domain Leads (5개)

**운영 계층 에이전트** (프로젝트별 커스터마이징):

```bash
# 예시: KPI Automation Platform
.claude/agents/layer3-operational/sns-module-lead.md
.claude/agents/layer3-operational/lead-management-lead.md
.claude/agents/layer3-operational/analytics-lead.md
.claude/agents/layer3-operational/integration-lead.md
# infrastructure-lead.md는 이미 Week 1에 생성 ✅
```

**각 도메인 리드 구조**:

```yaml
---
name: [module]-lead
description: [모듈] specialist. Use for [기능들].
model: sonnet
tools: Read, Write, Edit, Grep, Glob, Bash, Task
permissionMode: default
skills: [domain-workflow], [other-skills]
---

# [Module] Lead

## File Ownership
```
[담당 파일/폴더 목록]
```

## Responsibilities
[구체적인 책임]

## Common Tasks
### Task 1: [작업명]
[작업 설명 및 접근 방식]

### Task 2: [작업명]
[작업 설명 및 접근 방식]
```

#### 2.3 Layer 4 Workers (4개)

**실행 계층 에이전트**:

```bash
.claude/agents/layer4-execution/component-builder.md
.claude/agents/layer4-execution/api-developer.md
.claude/agents/layer4-execution/test-writer.md
.claude/agents/layer4-execution/bug-fixer.md
# database-engineer.md, code-analyzer.md는 이미 Week 1에 생성 ✅
```

**Worker 에이전트 템플릿**:

```yaml
---
name: [worker-name]
description: [전문 분야]. Use for [작업 유형].
model: sonnet
tools: Read, Write, Edit, Grep, Glob, Bash
permissionMode: acceptEdits
---

# [Worker Name]

## Responsibilities
[구체적인 작업]

## Workflows
### Workflow 1: [작업명]
[단계별 실행 방법]

### Workflow 2: [작업명]
[단계별 실행 방법]

## Code Patterns
[따라야 할 코드 패턴]

## Quality Checks
[완료 전 확인 사항]
```

#### 2.4 기초 스킬 완성 (4개)

```bash
.claude/skills/typescript-nextjs-dev/SKILL.md
.claude/skills/api-endpoint-builder/SKILL.md
.claude/skills/component-creator/SKILL.md
.claude/skills/code-analyzer/SKILL.md
# prisma-schema-manager는 이미 Week 1에 생성 ✅
```

#### 2.5 E2E 워크플로우 테스트

**테스트 시나리오**:

```
Test 1: 전체 기능 개발 (E2E)
요청: "새 API 엔드포인트 추가 - POST /api/products"

실행 흐름:
1. Project Orchestrator 분석
2. Backend Director 위임
3. Domain Lead 계획
4. API Developer 구현
5. Test Writer 테스트
6. Code Analyzer 패턴 확인
7. Quality Director 승인
8. 완료 보고

성공 기준:
- 파일 생성: app/api/products/route.ts
- 테스트 통과
- 타입 안전성 확인
```

**Week 2 성공 기준**:
- [ ] 모든 Layer 2, 3, 4 에이전트 생성
- [ ] 전체 위임 체인 작동 (L1 → L2 → L3 → L4)
- [ ] 3개 도메인 동시 작업 가능
- [ ] E2E 기능 개발 성공

---

### Week 3: Quality & Integration (품질 및 통합)

**목표**: 코드 품질 보장 및 외부 통합

#### 3.1 통합 스킬 (5개)

```bash
.claude/skills/external-api-integrator/SKILL.md
.claude/skills/oauth-flow-builder/SKILL.md
.claude/skills/webhook-handler/SKILL.md
.claude/skills/queue-automation/SKILL.md
.claude/skills/database-migration/SKILL.md
```

**각 스킬 구조**:

```markdown
# [Skill Name]

## Purpose
[스킬의 목적]

## When to Use
- [사용 시기 1]
- [사용 시기 2]

## Patterns

### Pattern 1: [패턴명]
```[언어]
[코드 예시]
```
**When to use**: [설명]

### Pattern 2: [패턴명]
[...]

## Best Practices
[모범 사례]

## Anti-Patterns
[피해야 할 패턴]

## References
[관련 문서 링크]
```

#### 3.2 공유 패턴 라이브러리

```bash
.claude/skills/_shared/nextjs-patterns.md
.claude/skills/_shared/prisma-patterns.md
.claude/skills/_shared/api-patterns.md
.claude/skills/_shared/component-patterns.md
.claude/skills/_shared/testing-patterns.md
.claude/skills/_shared/security-checklist.md
```

**패턴 파일 구조**:

```markdown
# [Technology] Patterns

## Pattern 1: [패턴명]

### Description
[패턴 설명]

### Code Example
```[언어]
[코드]
```

### When to Use
[사용 시기]

### Variations
[변형들]

---

## Pattern 2: [패턴명]
[...]
```

#### 3.3 리소스 잠금 메커니즘 구현

**잠금 로직**:

```typescript
// 예시 코드 (실제 구현은 에이전트 내부)
function acquireLock(resource: string, agent: string, taskId: string) {
  const locks = readLocks();

  // 이미 잠겨있는지 확인
  const existingLock = locks.find(l => l.resource === resource);
  if (existingLock) {
    if (Date.now() < new Date(existingLock.expires_at).getTime()) {
      return { success: false, reason: 'Resource locked', waitUntil: existingLock.expires_at };
    } else {
      // 만료된 잠금 제거
      removeLock(resource);
    }
  }

  // 새 잠금 생성
  const newLock = {
    resource,
    locked_by: agent,
    task_id: taskId,
    locked_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30분
  };

  locks.push(newLock);
  writeLocks(locks);

  return { success: true };
}
```

#### 3.4 작업 상태 추적 시스템

**상태 업데이트 로직**:

```typescript
// 작업 시작
function startTask(taskId: string, agent: string, description: string) {
  const task = {
    task_id: taskId,
    status: 'IN_PROGRESS',
    agent,
    description,
    started_at: new Date().toISOString(),
    progress: {
      percentage: 0,
      current_step: 'Starting...',
      steps_completed: [],
      steps_remaining: [],
    },
  };

  addToActive(task);
}

// 진행 상황 업데이트
function updateProgress(taskId: string, step: string, percentage: number) {
  const task = getActiveTask(taskId);
  task.progress.current_step = step;
  task.progress.percentage = percentage;
  updateActive(task);
}

// 작업 완료
function completeTask(taskId: string, result: any) {
  const task = removeFromActive(taskId);
  task.status = 'COMPLETED';
  task.completed_at = new Date().toISOString();
  task.result = result;
  addToCompleted(task);
}
```

#### 3.5 실제 통합 테스트

**테스트 시나리오**:

```
Test 1: LinkedIn 통합
요청: "LinkedIn 포스팅 API 통합"

검증:
- OAuth 흐름 구현
- 포스트 생성 API
- 분석 데이터 수집
- 에러 처리

성공 기준:
- 실제 LinkedIn에 포스트 가능
- 분석 데이터 수집 작동
- 모든 에러 시나리오 처리

Test 2: SendGrid 이메일
요청: "SendGrid 이메일 캠페인 통합"

검증:
- API 키 설정
- 이메일 전송
- 오픈율/클릭율 추적
- Webhook 수신

성공 기준:
- 이메일 발송 성공
- 통계 추적 작동
- Webhook 이벤트 처리
```

**Week 3 성공 기준**:
- [ ] 통합 스킬 5개 완성
- [ ] 공유 패턴 라이브러리 구축
- [ ] 리소스 잠금 메커니즘 작동
- [ ] 실제 외부 API 통합 성공
- [ ] 작업 상태 추적 시스템 작동

---

### Week 4: Complete System (완전한 시스템)

**목표**: 도메인별 전문화 및 E2E 검증

#### 4.1 도메인 스킬 (3개)

프로젝트별 비즈니스 로직 스킬:

```bash
# 예시: KPI Automation Platform
.claude/skills/sns-post-workflow/SKILL.md
.claude/skills/lead-pipeline-manager/SKILL.md
.claude/skills/analytics-dashboard/SKILL.md
```

**도메인 스킬 템플릿**:

```yaml
---
name: [domain]-workflow
description: [도메인] specialist for [주요 기능들].
skills: [의존 스킬들]
---

# [Domain] Workflow Skill

## Purpose
[비즈니스 로직 설명]

## End-to-End Workflows

### Workflow 1: [비즈니스 프로세스]
**Steps**:
1. [단계 1]
2. [단계 2]
3. [단계 3]

**Code Patterns**:
```[언어]
[구현 예시]
```

### Workflow 2: [비즈니스 프로세스]
[...]

## Integration Points
[다른 시스템과의 통합]

## Business Rules
[비즈니스 규칙]
```

#### 4.2 특화 에이전트 (3개)

도메인별 올인원 에이전트:

```bash
.claude/agents/specialists/sns-specialist.md
.claude/agents/specialists/lead-specialist.md
.claude/agents/specialists/analytics-specialist.md
```

**특화 에이전트 구조**:

```yaml
---
name: [domain]-specialist
description: [도메인] expert. Use for all [도메인]-related tasks.
model: sonnet
tools: Read, Write, Edit, Grep, Glob, Bash, Task
permissionMode: default
skills: [domain]-workflow, [related-skills]
---

# [Domain] Specialist

종합 에이전트 - Layer 3 Lead + Layer 4 Worker 역할 통합

## Capabilities
[할 수 있는 모든 작업]

## When to Use
[직접 호출하는 경우]

## Delegation vs Direct Execution
- Direct: [직접 수행할 작업]
- Delegate: [하위에 위임할 작업]
```

#### 4.3 워크플로우 테스트

**복합 시나리오 테스트**:

```markdown
## Test Suite: Complete Feature Development

### Test 1: 신규 기능 (순차 + 병렬)
요청: "Instagram 포스팅 기능 추가"

Phase 1 (순차): 스키마 확인
→ Infrastructure Lead

Phase 2 (병렬):
→ SNS Module Lead: UI + API
→ Integration Lead: Instagram OAuth

Phase 3 (순차): 통합 및 테스트
→ Quality Director

예상 결과:
- 파일 생성: 10개
- 테스트: 15개
- 완료 시간: < 30분
- 에스컬레이션: 0건

### Test 2: 버그 수정 (에스컬레이션)
요청: "리드 상태 업데이트 안됨"

Triage:
→ Project Orchestrator → Backend Director

Investigation:
→ Lead Module Lead → Bug Fixer

Diagnosis:
→ 데이터베이스 트랜잭션 이슈 발견

Resolution:
→ API Developer: 트랜잭션 추가
→ Test Writer: 테스트 추가

예상 결과:
- 수정 파일: 2개
- 테스트 추가: 3개
- 완료 시간: < 15분

### Test 3: 리팩토링 (순차)
요청: "중복 인증 로직 제거"

Analysis:
→ Code Analyzer: 중복 탐지

Planning:
→ Backend Director: 리팩토링 전략

Execution (순차):
→ API Developer: 공통 함수 추출
→ 각 사용처 업데이트 (5개 파일)

Verification:
→ Test Writer: 모든 테스트 통과
→ Code Reviewer: 승인

예상 결과:
- 코드 감소: -200 lines
- 중복도: 85% → 15%
- 테스트 통과: 100%
```

#### 4.4 성능 측정 및 최적화

**메트릭 수집**:

```json
// .claude/metrics.json
{
  "week4": {
    "tasks_completed": 45,
    "tasks_failed": 2,
    "tasks_escalated": 3,
    "avg_completion_time_minutes": 18,
    "success_rate": 95.6,
    "quality_metrics": {
      "tests_pass_rate": 98.2,
      "code_review_first_pass": 88.9,
      "duplicated_work": 0
    },
    "efficiency_metrics": {
      "parallel_tasks_ratio": 65.5,
      "resource_conflicts": 1,
      "average_layers_involved": 2.8
    }
  }
}
```

**최적화 영역**:
- 병렬 실행 비율 증가
- 에스컬레이션 원인 분석 및 개선
- 리소스 충돌 최소화
- 중복 작업 제거

**Week 4 성공 기준**:
- [ ] 도메인 스킬 3개 완성
- [ ] 특화 에이전트 3개 생성
- [ ] 복합 시나리오 테스트 통과
- [ ] 성공률 > 95%
- [ ] 개발 시간 30% 이상 단축

---

## 구현 체크리스트

### Phase 1 (Week 1) ✅ 진행 중

- [x] 디렉토리 구조 생성
- [x] Project Orchestrator 생성
- [x] Infrastructure Lead 생성
- [x] Database Engineer 생성
- [x] Code Analyzer 생성
- [x] Prisma Schema Manager 스킬
- [x] 상태 관리 파일 생성
- [ ] 기초 스킬 4개 완성
- [ ] Phase 1 검증 테스트

### Phase 2 (Week 2) ⏳ 대기

- [ ] Layer 2 Directors 4개
- [ ] Layer 3 Domain Leads 4개
- [ ] Layer 4 Workers 4개
- [ ] 기초 스킬 완성
- [ ] E2E 워크플로우 테스트

### Phase 3 (Week 3) ⏳ 대기

- [ ] 통합 스킬 5개
- [ ] 공유 패턴 라이브러리
- [ ] 리소스 잠금 구현
- [ ] 작업 상태 추적 구현
- [ ] 실제 통합 테스트

### Phase 4 (Week 4) ⏳ 대기

- [ ] 도메인 스킬 3개
- [ ] 특화 에이전트 3개
- [ ] 복합 시나리오 테스트
- [ ] 성능 측정 및 최적화
- [ ] 최종 검증

---

## 다음 단계

현재 **Phase 1** 진행 중입니다.

**즉시 수행 가능한 작업**:
1. 나머지 기초 스킬 4개 완성
2. Phase 1 검증 테스트 실행
3. 문제 발견 및 개선

**Phase 2 준비**:
1. 프로젝트 도메인 식별
2. Layer 3 에이전트 설계
3. 도메인별 책임 정의

---

**관련 문서**:
- [Quick Start](QUICK_START.md) - 빠른 시작 가이드
- [Architecture](ARCHITECTURE.md) - 전체 아키텍처
- [Workflows](WORKFLOWS.md) - 워크플로우 패턴
