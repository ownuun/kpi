# KPI Automation Platform (with AI Agents)

**계층적 AI 에이전트 시스템을 활용한 KPI 자동화 플랫폼**

## 프로젝트 개요

이 프로젝트는 **계층적 AI 에이전트 시스템**을 사용하여 KPI Automation Platform을 개발합니다.

### 기존 프로젝트와의 차이점

| 구분 | 기존 (`kpi-automation-platform`) | 이 프로젝트 (`kpi-with-agents`) |
|------|--------------------------------|--------------------------------|
| 개발 방식 | 수동 개발 | AI 에이전트 자동화 |
| 코드 리뷰 | 수동 리뷰 | Quality Director 자동 리뷰 |
| 작업 조율 | 수동 조율 | Project Orchestrator 자동 조율 |
| 테스트 작성 | 수동 작성 | Test Writer 자동 생성 |
| 병렬 작업 | 충돌 발생 가능 | 리소스 잠금으로 충돌 방지 |

## 에이전트 시스템 구조

```
.claude/
├── agents/                      # 16개 AI 에이전트
│   ├── layer1-strategic/       # 전략 계층 (1개)
│   │   └── project-orchestrator.md
│   │
│   ├── layer2-tactical/        # 전술 계층 (4개)
│   │   ├── architecture-director.md
│   │   ├── frontend-director.md
│   │   ├── backend-director.md
│   │   └── quality-director.md
│   │
│   ├── layer3-operational/     # 운영 계층 (5개)
│   │   ├── infrastructure-lead.md
│   │   ├── sns-module-lead.md
│   │   ├── lead-management-lead.md
│   │   ├── analytics-lead.md
│   │   └── integration-lead.md
│   │
│   └── layer4-execution/       # 실행 계층 (6개)
│       ├── database-engineer.md
│       ├── code-analyzer.md
│       ├── component-builder.md
│       ├── api-developer.md
│       ├── test-writer.md
│       └── bug-fixer.md
│
├── skills/                      # 11개 스킬 + 6개 패턴
│   ├── prisma-schema-manager/
│   ├── typescript-nextjs-dev/
│   ├── api-endpoint-builder/
│   ├── component-creator/
│   ├── code-analyzer-skill/
│   ├── external-api-integrator/
│   ├── oauth-flow-builder/
│   ├── webhook-handler/
│   ├── queue-automation/
│   ├── database-migration/
│   └── _shared/                # 공유 패턴
│
└── state/                       # 상태 관리
    ├── tasks/                  # 작업 추적
    ├── coordination/           # 리소스 잠금
    └── reports/                # 작업 보고서
```

## 빠른 시작

### 1. 프로젝트 초기화

```bash
cd kpi-with-agents

# Next.js 프로젝트 생성
pnpm create next-app@latest kpi-tracker --typescript --tailwind --app --src-dir --import-alias "@/*"

# 프로젝트 디렉토리로 이동
cd kpi-tracker

# 의존성 설치
pnpm install

# Prisma 설치
pnpm add -D prisma
pnpm add @prisma/client

# shadcn/ui 설치
pnpm dlx shadcn@latest init
```

### 2. 에이전트 시스템 테스트

간단한 요청으로 에이전트 시스템을 테스트합니다:

```
사용자: "코드베이스 구조를 분석해주세요"

실행 흐름:
1. Project Orchestrator 분석
2. Code Analyzer 위임
3. 프로젝트 구조 보고서 생성
```

### 3. 실제 개발 시작

```
사용자: "Prisma 스키마를 생성해주세요.
         User, Post, Lead, Deal 모델이 필요합니다."

자동 실행:
1. Project Orchestrator → Architecture Director
2. Architecture Director → Infrastructure Lead
3. Infrastructure Lead → Database Engineer
4. Database Engineer가 schema.prisma 생성
5. 완료 보고
```

## 에이전트 사용 예시

### 예시 1: 데이터베이스 스키마 생성
```
요청: "KPI 플랫폼을 위한 Prisma 스키마를 만들어주세요"

→ Architecture Director가 스키마 설계
→ Database Engineer가 구현
→ 자동으로 마이그레이션 생성
```

### 예시 2: LinkedIn 포스팅 기능
```
요청: "LinkedIn 포스팅 기능을 추가해주세요"

→ Project Orchestrator가 작업 분해
→ Frontend Director + Backend Director 병렬 작업
→ Component Builder가 UI 구현
→ API Developer가 엔드포인트 구현
→ Integration Lead가 LinkedIn API 연동
→ Test Writer가 테스트 추가
→ Quality Director가 코드 리뷰
```

### 예시 3: 버그 수정
```
요청: "리드 생성 API에서 500 에러가 발생합니다"

→ Project Orchestrator → Backend Director
→ Bug Fixer가 에러 진단 및 수정
→ Test Writer가 회귀 테스트 추가
→ Quality Director가 검증
```

## 프로젝트 구조 (계획)

```
kpi-with-agents/
├── .claude/                     # ✅ 에이전트 시스템 (완료)
│   ├── agents/
│   ├── skills/
│   └── state/
│
├── kpi-tracker/                 # 메인 Next.js 프로젝트
│   ├── src/
│   │   ├── app/                # Next.js 14 App Router
│   │   │   ├── (dashboard)/
│   │   │   │   ├── sns/
│   │   │   │   ├── leads/
│   │   │   │   ├── deals/
│   │   │   │   └── analytics/
│   │   │   └── api/
│   │   │
│   │   ├── components/         # React 컴포넌트
│   │   ├── lib/               # 유틸리티
│   │   └── types/             # TypeScript 타입
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   └── package.json
│
├── docs/                        # 프로젝트 문서
│   ├── ARCHITECTURE.md
│   ├── PERSON_A_GUIDE.md
│   ├── PERSON_B_GUIDE.md
│   └── PERSON_C_GUIDE.md
│
└── README.md                    # 이 파일
```

## 개발 워크플로우

### 일반 개발 흐름

1. **요청**: 사용자가 자연어로 요청
2. **분석**: Project Orchestrator가 요청 분석
3. **위임**: 적절한 에이전트에게 작업 위임
4. **실행**: 에이전트들이 순차/병렬로 작업 수행
5. **보고**: 완료 후 사용자에게 결과 보고

### 에이전트 간 통신

```
사용자 요청
    ↓
Layer 1: Project Orchestrator (전략 수립)
    ↓
Layer 2: Directors (기술 계획)
    ↓
Layer 3: Leads (도메인 구현 계획)
    ↓
Layer 4: Workers (실제 코드 작성)
    ↓
완료 보고 (역순)
```

## 기대 효과

### 개발 속도
- **40% 시간 단축**: 자동화된 작업 위임
- **병렬 작업**: 여러 도메인 동시 개발 가능
- **즉시 시작**: 패턴 라이브러리로 빠른 구현

### 코드 품질
- **일관성**: 모든 코드가 동일한 패턴
- **자동 리뷰**: Quality Director의 검증
- **자동 테스트**: Test Writer의 테스트 생성

### 팀 협업
- **충돌 방지**: 리소스 잠금 메커니즘
- **명확한 책임**: 도메인별 소유권
- **투명한 진행**: 실시간 상태 추적

## 성공 기준

- [ ] 에이전트 시스템으로 Prisma 스키마 생성 성공
- [ ] 에이전트 시스템으로 첫 번째 API 엔드포인트 생성 성공
- [ ] 에이전트 시스템으로 첫 번째 컴포넌트 생성 성공
- [ ] 병렬 작업 시 충돌 없이 진행
- [ ] 자동 테스트 생성 및 통과
- [ ] 전체 개발 시간 40% 단축 달성

## 다음 단계

### Phase 1: 프로젝트 초기화 (현재)
- [x] 에이전트 시스템 복사
- [ ] Next.js 프로젝트 생성
- [ ] 기본 구조 설정

### Phase 2: 첫 번째 테스트
- [ ] 코드베이스 분석 요청
- [ ] Prisma 스키마 생성 요청
- [ ] 에이전트 시스템 작동 확인

### Phase 3: 본격 개발
- [ ] SNS 모듈 개발
- [ ] Lead 모듈 개발
- [ ] Analytics 대시보드 개발

## 참고 문서

- 에이전트 시스템: `C:\Users\GoGo\Desktop\233\hierarchical-agents-system\SUMMARY.md`
- 기존 프로젝트: `C:\Users\GoGo\Desktop\233\kpi-automation-platform`
- 프로젝트 요약: `C:\Users\GoGo\Desktop\233\PROJECT_SUMMARY.md`

---

**프로젝트 시작일**: 2025-12-17
**목표**: AI 에이전트 시스템의 효과 검증 및 KPI 플랫폼 개발
**상태**: 초기화 완료 ✅
