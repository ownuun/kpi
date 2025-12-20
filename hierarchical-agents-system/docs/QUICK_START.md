# Quick Start Guide

계층적 AI 에이전트 시스템을 프로젝트에 빠르게 적용하는 가이드입니다.

## 1. 시스템 복사

### 기존 프로젝트에 통합

```bash
# 프로젝트 루트에서
cd your-project

# .claude 디렉토리가 없다면 생성
mkdir -p .claude

# 에이전트 복사
cp -r /path/to/hierarchical-agents-system/agents/* .claude/agents/

# 스킬 복사
cp -r /path/to/hierarchical-agents-system/skills/* .claude/skills/

# 상태 관리 디렉토리 생성
mkdir -p .claude/state/tasks
mkdir -p .claude/state/coordination
mkdir -p .claude/state/reports
cp /path/to/hierarchical-agents-system/state/tasks/*.json .claude/state/tasks/
cp /path/to/hierarchical-agents-system/state/coordination/*.json .claude/state/coordination/
```

## 2. 첫 번째 테스트

### 간단한 작업으로 시스템 테스트

```
사용자 → Claude: "코드베이스 구조를 분석해주세요"

예상 실행:
1. Project Orchestrator가 요청 분석
2. Code Analyzer에게 작업 위임
3. 프로젝트 구조 보고서 생성
4. 사용자에게 결과 보고
```

## 3. 프로젝트별 커스터마이징

### Step 1: 도메인 파악

프로젝트의 주요 모듈을 식별하세요:

```
예시 (E-commerce):
- Product Management (상품 관리)
- Order Processing (주문 처리)
- User Management (사용자 관리)
- Analytics (분석)
```

### Step 2: Layer 3 에이전트 커스터마이징

각 도메인별로 Operational 에이전트 생성:

```bash
# .claude/agents/layer3-operational/ 에 새 에이전트 추가
touch .claude/agents/layer3-operational/product-module-lead.md
touch .claude/agents/layer3-operational/order-module-lead.md
```

**예시: product-module-lead.md**

```yaml
---
name: product-module-lead
description: Product management specialist. Use for product CRUD, inventory, and catalog features.
model: sonnet
tools: Read, Write, Edit, Grep, Glob, Bash, Task
permissionMode: default
---

# Product Module Lead

담당 영역:
- app/products/**
- app/api/products/**
- components/products/**
- lib/services/product-service.ts

책임:
- 상품 CRUD 기능
- 재고 관리
- 카테고리 관리
- 상품 검색 및 필터링

참고 문서:
- docs/PRODUCT_MODULE.md
```

### Step 3: 도메인 스킬 추가

프로젝트별 특화 스킬 생성:

```bash
mkdir -p .claude/skills/product-management
touch .claude/skills/product-management/SKILL.md
```

**예시: product-management skill**

```yaml
---
name: product-management
description: E-commerce product management patterns and best practices.
---

# Product Management Skill

## 주요 패턴

### Pattern 1: Product CRUD
[프로젝트별 상품 관리 패턴]

### Pattern 2: Inventory Tracking
[재고 추적 로직]

### Pattern 3: Price Management
[가격 관리 전략]
```

## 4. 일반적인 사용 시나리오

### 시나리오 1: 새 기능 개발

```
사용자: "상품 리뷰 기능을 추가해주세요"

시스템 동작:
1. Project Orchestrator 분석
   - 새 기능 (DB + API + UI)
   - 도메인: Product

2. Architecture Director 위임
   - Review 모델 설계

3. Frontend + Backend Director 병렬 위임
   - Frontend: ReviewForm 컴포넌트
   - Backend: Review CRUD API

4. Product Module Lead 조율
   - Component Builder: UI 구현
   - API Developer: 엔드포인트 구현
   - Database Engineer: 스키마 마이그레이션

5. Quality Director 검증
   - Test Writer: 테스트 추가
   - Code Reviewer: 리뷰

6. 완료 보고
```

### 시나리오 2: 버그 수정

```
사용자: "장바구니 총액 계산이 잘못됩니다"

시스템 동작:
1. Project Orchestrator 트리아지
   - 버그 수정, Order 도메인

2. Backend Director 위임
   - Order Module Lead에게 전달

3. Order Module Lead 진단
   - Bug Fixer: 원인 파악
   - 계산 로직 오류 발견

4. Bug Fixer 수정
   - 최소 변경으로 수정
   - Test Writer: 회귀 테스트 추가

5. 완료 보고
```

### 시나리오 3: 코드 리팩토링

```
사용자: "중복된 결제 로직을 정리해주세요"

시스템 동작:
1. Project Orchestrator 분석
   - 리팩토링, Payment 도메인

2. Backend Director 위임
   - Payment Module Lead 조율

3. Code Analyzer 분석
   - 중복 코드 패턴 탐지
   - 5개 파일에서 유사 로직 발견

4. Payment Module Lead 리팩토링 계획
   - API Developer: 공통 함수 추출
   - 각 사용처 업데이트

5. Quality Director 검증
   - Test Writer: 기존 테스트 통과 확인
   - Code Reviewer: 리팩토링 승인

6. 완료 보고
```

## 5. 팁 & 트릭

### 효율적인 위임

**좋은 요청:**
```
"사용자 인증 기능을 JWT 방식으로 구현해주세요.
NextAuth.js를 사용하고 Prisma User 모델과 연동해야 합니다."
```

**명확성 부족:**
```
"로그인 만들어줘"
→ 너무 모호함, AskUserQuestion으로 명확화 필요
```

### 병렬 작업 최대화

**비효율적:**
```
순차: 스키마 → API → UI → 테스트
```

**효율적:**
```
Phase 1: 스키마
Phase 2 (병렬): API + UI
Phase 3: 통합 테스트
```

### 리소스 충돌 회피

**prisma/schema.prisma 수정 시:**
1. Infrastructure Lead만 수정 가능
2. 다른 에이전트는 대기 또는 에스컬레이션
3. 잠금 메커니즘 활용

## 6. 문제 해결

### Q: 에이전트가 응답하지 않음

**해결:**
1. 에이전트 파일 확인 (`.claude/agents/`)
2. YAML frontmatter 문법 확인
3. 에이전트 description이 명확한지 확인

### Q: 작업이 중복 실행됨

**해결:**
1. `.claude/state/tasks/active.json` 확인
2. 중복 작업 제거
3. 작업 ID 체계 개선

### Q: 리소스 잠금 해제 안됨

**해결:**
1. `.claude/state/coordination/resource-locks.json` 확인
2. 만료 시간 확인
3. 수동으로 잠금 제거

## 7. 다음 단계

### Phase 2 확장 (Week 2)

```bash
# Layer 2 디렉터 추가
touch .claude/agents/layer2-tactical/architecture-director.md
touch .claude/agents/layer2-tactical/frontend-director.md
touch .claude/agents/layer2-tactical/backend-director.md
touch .claude/agents/layer2-tactical/quality-director.md

# Layer 4 실행 에이전트 추가
touch .claude/agents/layer4-execution/component-builder.md
touch .claude/agents/layer4-execution/api-developer.md
touch .claude/agents/layer4-execution/test-writer.md
touch .claude/agents/layer4-execution/bug-fixer.md
```

### 추가 스킬 개발

```bash
# 통합 스킬
mkdir -p .claude/skills/external-api-integrator
mkdir -p .claude/skills/oauth-flow-builder
mkdir -p .claude/skills/webhook-handler

# 도메인 스킬
mkdir -p .claude/skills/your-domain-workflow
```

### 메트릭 추적

작업 완료율, 에스컬레이션 비율, 개발 시간을 추적하여 시스템 개선:

```json
// metrics.json
{
  "week1": {
    "tasks_completed": 15,
    "tasks_escalated": 1,
    "avg_completion_time_minutes": 25,
    "success_rate": 93.3
  }
}
```

## 8. 참고 자료

- [전체 아키텍처](ARCHITECTURE.md)
- [통신 프로토콜](COMMUNICATION.md)
- [워크플로우 패턴](WORKFLOWS.md)
- [구현 가이드](IMPLEMENTATION_GUIDE.md)

## 9. 지원

문제가 발생하면:

1. `docs/` 디렉토리의 문서 확인
2. 유사 프로젝트 예시 참조
3. 에이전트 로그 분석
4. 필요시 시스템 초기화 및 재시작

---

**다음**: [ARCHITECTURE.md](ARCHITECTURE.md)에서 전체 시스템 아키텍처를 자세히 알아보세요.
