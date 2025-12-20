# Pipeline Kanban Board - File Manifest

## 전체 파일 목록

이 문서는 리드 파이프라인 칸반 보드 시스템을 위해 생성된 모든 파일의 절대 경로를 나열합니다.

## 생성된 파일 (총 13개)

### 1. 타입 정의 (1개)

```
C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard\types\pipeline.ts
```
- Lead, PipelineStage, PipelineColumn 인터페이스
- PIPELINE_STAGES 상수 (7개 단계)
- 필터, 정렬 타입 정의

### 2. API Routes (2개)

#### 메인 파이프라인 API
```
C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard\app\api\pipeline\route.ts
```
- GET: 리드 목록 조회
- POST: 새 리드 생성
- Twenty CRM 통합 로직

#### 개별 리드 API
```
C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard\app\api\pipeline\[id]\route.ts
```
- GET: 개별 리드 조회
- PATCH: 리드 업데이트
- DELETE: 리드 삭제

### 3. 컴포넌트 (7개)

#### 메인 칸반 보드
```
C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard\components\pipeline\KanbanBoard.tsx
```
- DnD 컨텍스트 관리
- 필터링 및 정렬
- 통계 표시

#### 칸반 컬럼
```
C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard\components\pipeline\KanbanColumn.tsx
```
- 단계별 컬럼 렌더링
- 드롭 영역
- 리드 카운트 및 금액

#### 리드 카드
```
C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard\components\pipeline\LeadCard.tsx
```
- 드래그 가능한 리드 카드
- 리드 정보 표시
- 아바타/이니셜

#### 리드 상세 모달
```
C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard\components\pipeline\LeadDetailModal.tsx
```
- 전체 리드 정보
- 인라인 편집
- 삭제 기능

#### 빠른 추가 폼
```
C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard\components\pipeline\LeadQuickAdd.tsx
```
- 토글 가능한 폼
- 7개 입력 필드
- 유효성 검사

#### 통계 대시보드
```
C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard\components\pipeline\PipelineStats.tsx
```
- 6개 통계 카드
- 실시간 계산
- 통화 포맷팅

#### Export Index
```
C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard\components\pipeline\index.ts
```
- 모든 컴포넌트 export

### 4. 페이지 (1개)

```
C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard\app\pipeline\page.tsx
```
- 메인 파이프라인 페이지
- 데이터 페칭 및 상태 관리
- CRUD 핸들러

### 5. 설정 (1개)

```
C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard\.env.example
```
- Twenty CRM API 설정 템플릿
- 환경 변수 가이드

### 6. 문서 (2개)

#### 메인 README
```
C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard\PIPELINE_README.md
```
- 전체 기능 설명
- API 문서
- 사용 가이드
- 문제 해결

#### 구현 요약
```
C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard\PIPELINE_IMPLEMENTATION_SUMMARY.md
```
- 생성된 파일 목록
- 기술 스택
- 코드 통계
- 테스트 체크리스트

## 디렉토리 구조

```
C:\Users\GoGo\Desktop\233\kpi-automation-platform\apps\web-dashboard\
├── .env.example                                      # 환경 변수 템플릿
├── PIPELINE_README.md                                # 메인 문서
├── PIPELINE_IMPLEMENTATION_SUMMARY.md                # 구현 요약
├── PIPELINE_FILE_MANIFEST.md                         # 이 파일
│
├── types/
│   └── pipeline.ts                                   # 타입 정의
│
├── app/
│   ├── api/
│   │   └── pipeline/
│   │       ├── route.ts                              # GET, POST
│   │       └── [id]/
│   │           └── route.ts                          # GET, PATCH, DELETE
│   │
│   └── pipeline/
│       └── page.tsx                                  # 메인 페이지
│
└── components/
    └── pipeline/
        ├── index.ts                                  # Export index
        ├── KanbanBoard.tsx                           # 메인 보드
        ├── KanbanColumn.tsx                          # 컬럼
        ├── LeadCard.tsx                              # 카드
        ├── LeadDetailModal.tsx                       # 모달
        ├── LeadQuickAdd.tsx                          # 빠른 추가
        └── PipelineStats.tsx                         # 통계
```

## 파일별 크기 및 복잡도

| 파일 | 라인 수 | 복잡도 | 주요 기능 |
|------|---------|--------|-----------|
| pipeline.ts | ~120 | 낮음 | 타입 정의 |
| route.ts (main) | ~180 | 중간 | API 엔드포인트 |
| route.ts ([id]) | ~100 | 중간 | CRUD 작업 |
| KanbanBoard.tsx | ~270 | 높음 | DnD, 필터링, 정렬 |
| KanbanColumn.tsx | ~80 | 낮음 | 컬럼 렌더링 |
| LeadCard.tsx | ~140 | 중간 | 카드 표시 |
| LeadDetailModal.tsx | ~350 | 높음 | 상세 정보, 편집 |
| LeadQuickAdd.tsx | ~140 | 중간 | 폼 처리 |
| PipelineStats.tsx | ~100 | 낮음 | 통계 계산 |
| page.tsx | ~180 | 중간 | 페이지 로직 |
| index.ts | ~10 | 낮음 | Export |

## 의존성

### 새로 추가된 패키지
- @dnd-kit/core: ^6.3.1
- @dnd-kit/sortable: ^10.0.0
- @dnd-kit/utilities: ^3.2.2

### 기존 패키지 사용
- @kpi/integrations-twenty (Twenty CRM SDK)
- next: ^15.1.0
- react: ^19.0.0
- typescript: ^5.7.2
- tailwindcss: ^3.4.17

## 접근 경로

### 로컬 개발
```
http://localhost:3000/pipeline
```

### API 엔드포인트
```
GET    /api/pipeline           # 리드 목록
POST   /api/pipeline           # 리드 생성
GET    /api/pipeline/[id]      # 리드 조회
PATCH  /api/pipeline/[id]      # 리드 업데이트
DELETE /api/pipeline/[id]      # 리드 삭제
```

## 환경 설정 필요 사항

### 1. 환경 변수 (.env 파일)
```bash
TWENTY_API_KEY=your_twenty_api_key_here
TWENTY_API_URL=https://api.twenty.com/graphql
```

### 2. 패키지 설치
```bash
pnpm install
# 또는
npm install
```

### 3. 개발 서버 실행
```bash
pnpm dev
# 또는
npm run dev
```

## Git 커밋 추천 메시지

```bash
git add .
git commit -m "feat: Add lead pipeline kanban board with Twenty CRM integration

- Implement drag-and-drop pipeline with 7 stages
- Add lead CRUD operations
- Integrate with Twenty CRM API
- Create comprehensive statistics dashboard
- Add filtering and sorting capabilities
- Implement quick lead creation
- Add detailed lead modal with inline editing

Components:
- KanbanBoard, KanbanColumn, LeadCard
- LeadDetailModal, LeadQuickAdd, PipelineStats

API Routes:
- GET/POST /api/pipeline
- GET/PATCH/DELETE /api/pipeline/[id]

Tech Stack:
- @dnd-kit for drag-and-drop
- Next.js 15 App Router
- TypeScript
- Twenty CRM SDK"
```

## 체크리스트

### 구현 완료
- [x] 타입 정의
- [x] API 라우트 (GET, POST, PATCH, DELETE)
- [x] 6개 컴포넌트
- [x] 메인 페이지
- [x] 드래그 앤 드롭
- [x] 필터링 및 정렬
- [x] 통계 대시보드
- [x] 빠른 리드 추가
- [x] 리드 상세 모달
- [x] Twenty CRM 통합
- [x] 환경 변수 설정
- [x] 문서화

### 테스트 필요
- [ ] 리드 목록 로딩
- [ ] 드래그 앤 드롭
- [ ] API 통합
- [ ] 필터링
- [ ] 정렬
- [ ] CRUD 작업
- [ ] 에러 처리

### 배포 전 확인
- [ ] 환경 변수 설정
- [ ] Twenty CRM API 키 발급
- [ ] 빌드 테스트
- [ ] 성능 최적화

## 추가 리소스

### Twenty CRM 문서
- API: https://docs.twenty.com/
- GraphQL Schema: https://api.twenty.com/graphql

### @dnd-kit 문서
- Core: https://docs.dndkit.com/
- Sortable: https://docs.dndkit.com/presets/sortable

## 라이선스
MIT License

## 작성 정보
- 작성자: Claude Sonnet 4.5
- 작성일: 2025-12-18
- 프로젝트: KPI Automation Platform
- 모듈: Web Dashboard - Lead Pipeline
