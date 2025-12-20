# Hierarchical AI Agents System

## 개요

회사 조직 구조와 유사한 4계층 계층적 AI 에이전트 시스템입니다. CEO → 임원 → 팀장 → 실무자 형태로 작동하며, 개발, 코드 리뷰, 프로젝트 관리를 자동화합니다.

## 시스템 아키텍처

```
Layer 1: Strategic (전략)
   └── Project Orchestrator (CEO 레벨)

Layer 2: Tactical (전술)
   ├── Architecture Director
   ├── Frontend Director
   ├── Backend Director
   └── Quality Director

Layer 3: Operational (운영)
   ├── SNS Module Lead
   ├── Lead Management Lead
   ├── Analytics Lead
   ├── Infrastructure Lead
   └── Integration Lead

Layer 4: Execution (실행)
   ├── Component Builder
   ├── API Developer
   ├── Database Engineer
   ├── Test Writer
   ├── Code Analyzer
   └── Bug Fixer
```

## 폴더 구조

```
hierarchical-agents-system/
├── agents/                          # AI 에이전트 정의
│   ├── layer1-strategic/           # 전략 계층
│   ├── layer2-tactical/            # 전술 계층
│   ├── layer3-operational/         # 운영 계층
│   └── layer4-execution/           # 실행 계층
│
├── skills/                          # 재사용 가능한 스킬
│   ├── typescript-nextjs-dev/      # Next.js 개발 패턴
│   ├── prisma-schema-manager/      # DB 스키마 관리
│   ├── api-endpoint-builder/       # API 엔드포인트 구축
│   ├── component-creator/          # React 컴포넌트 생성
│   ├── code-analyzer/              # 코드 분석
│   └── _shared/                    # 공유 패턴 라이브러리
│
├── state/                           # 상태 관리
│   ├── tasks/                      # 작업 상태 추적
│   ├── coordination/               # 조율 및 잠금
│   └── reports/                    # 보고서
│
├── docs/                            # 문서
│   ├── ARCHITECTURE.md             # 아키텍처 설명
│   ├── COMMUNICATION.md            # 통신 프로토콜
│   ├── WORKFLOWS.md                # 워크플로우 패턴
│   └── IMPLEMENTATION_GUIDE.md     # 구현 가이드
│
└── README.md                        # 이 파일
```

## 주요 기능

### 1. 계층적 작업 위임
- Layer 1 (Strategic): 작업 분석 및 전략 수립
- Layer 2 (Tactical): 기술적 계획 및 조율
- Layer 3 (Operational): 도메인별 구현 계획
- Layer 4 (Execution): 실제 코드 작성 및 테스트

### 2. 하이브리드 실행 모드
- **순차 실행**: 의존성이 있는 작업
- **병렬 실행**: 독립적인 작업
- **하이브리드**: 상황에 따라 자동 선택

### 3. 스킬 기반 전문화
- 재사용 가능한 스킬 라이브러리
- 에이전트별 맞춤 스킬 조합
- 도메인 특화 워크플로우

### 4. 상태 관리
- 작업 중복 방지
- 리소스 잠금 메커니즘
- 진행 상황 추적

## 빠른 시작

### 1. 프로젝트에 통합

기존 프로젝트의 `.claude/` 디렉토리에 복사:

```bash
# hierarchical-agents-system을 프로젝트에 복사
cp -r hierarchical-agents-system/agents/* your-project/.claude/agents/
cp -r hierarchical-agents-system/skills/* your-project/.claude/skills/
mkdir -p your-project/.claude/state
cp -r hierarchical-agents-system/state/* your-project/.claude/state/
```

### 2. 에이전트 호출

```
사용자: "LinkedIn 포스팅 기능을 추가해주세요"

→ Project Orchestrator가 자동으로:
  1. 작업 분석 (SNS 기능)
  2. Frontend Director + Backend Director에게 위임
  3. SNS Module Lead가 구현 조율
  4. Component Builder + API Developer가 실제 구현
  5. Test Writer가 테스트 추가
  6. 완료 보고
```

## 구현 단계

### Phase 1: 기초 (Week 1)
✅ 핵심 인프라 구축
- [x] 폴더 구조 생성
- [ ] Layer 1 에이전트 (Project Orchestrator)
- [ ] Layer 3 핵심 에이전트 (Infrastructure Lead)
- [ ] Layer 4 기본 에이전트 (Database Engineer, Code Analyzer)
- [ ] 기초 스킬 5개

### Phase 2: 핵심 개발 (Week 2)
🔄 병렬 개발 활성화
- [ ] Layer 2 모든 디렉터
- [ ] Layer 3 도메인 리드 (SNS, Lead, Analytics)
- [ ] Layer 4 개발 에이전트

### Phase 3: 품질 및 통합 (Week 3)
⏳ 대기 중
- [ ] 통합 스킬 5개
- [ ] 리소스 잠금 메커니즘
- [ ] 작업 상태 추적

### Phase 4: 완전한 시스템 (Week 4)
⏳ 대기 중
- [ ] 도메인 스킬 3개
- [ ] 특화 에이전트
- [ ] E2E 워크플로우 테스트

## 성공 기준

### 시스템 성능
- **작업 완료율**: > 95% (사람 개입 없이)
- **에스컬레이션 비율**: < 5%
- **평균 작업 시간**: < 20% 오버헤드
- **코드 품질**: 100% 첫/두 번째 시도에 리뷰 통과
- **테스트 통과율**: > 98%

### 팀 효율성
- **개발 시간 단축**: 40% 이상
- **병렬 작업**: 충돌 없이 동시 작업
- **중복 작업**: 0건
- **스킬 활용도**: > 80%

## 프로젝트별 커스터마이징

### KPI Automation Platform 예시

```yaml
# .claude/agents/layer3-operational/sns-module-lead.md
---
name: sns-module-lead
description: SNS posting specialist for Person A's domain
skills: sns-post-workflow, external-api-integrator
tools: Read, Write, Edit, Bash, Task
---

담당 영역:
- app/(dashboard)/sns/**
- app/api/sns/**
- lib/integrations/linkedin.ts

참고 문서:
- docs/PERSON_A_GUIDE.md
- clones/postiz-app/
```

### 다른 프로젝트 적용

1. **도메인 파악**: 프로젝트의 주요 모듈 식별
2. **Layer 3 커스터마이징**: 프로젝트 도메인에 맞는 Operational 에이전트 생성
3. **스킬 추가**: 프로젝트별 특화 스킬 개발
4. **통합**: 기존 개발 워크플로우에 통합

## 라이선스

MIT License

## 작성자

- 설계: Claude Sonnet 4.5
- 날짜: 2025-12-17
- 버전: 1.0.0

## 다음 단계

1. [구현 가이드](docs/IMPLEMENTATION_GUIDE.md) 읽기
2. Phase 1 에이전트 생성
3. 간단한 작업으로 테스트
4. 피드백 기반 개선
