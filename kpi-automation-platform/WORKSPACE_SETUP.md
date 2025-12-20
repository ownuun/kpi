# PNPM Workspace 설정 가이드

## 개요
KPI 자동화 플랫폼의 pnpm workspace가 성공적으로 설정되었습니다.

## 디렉토리 구조

```
kpi-automation-platform/
├── pnpm-workspace.yaml          # Workspace 정의
├── package.json                 # 루트 package.json (공통 dependencies)
├── .npmrc                       # pnpm 설정
├── tsconfig.json                # TypeScript 기본 설정
├── .gitignore                   # Git 무시 파일
│
├── apps/                        # 애플리케이션 워크스페이스
│   ├── web-dashboard/          # @kpi/web-dashboard (Next.js 15.1)
│   ├── api/                    # @kpi/api (Next.js API Routes)
│   └── automation-engine/      # @kpi/automation-engine
│
├── packages/                    # 공유 패키지 워크스페이스
│   ├── shared-types/           # @kpi/shared-types (TypeScript 타입)
│   ├── ui-components/          # @kpi/ui-components (React 19 컴포넌트)
│   ├── database/               # @kpi/database (Prisma 6.2.0)
│   └── integrations/           # @kpi/integrations (외부 API)
│
├── services/                    # 마이크로서비스 워크스페이스
│   ├── sns-collector/          # @kpi/sns-collector
│   ├── email-tracker/          # @kpi/email-tracker
│   ├── analytics-processor/    # @kpi/analytics-processor
│   └── lead-manager/           # @kpi/lead-manager
│
└── kpi-tracker/                 # 기존 프로젝트 (레거시)
```

## 주요 설정 파일

### 1. pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
  - 'kpi-tracker'
```

### 2. 루트 package.json
- **공통 Dependencies**: Next.js 15.1, React 19, Prisma 6.2.0, Tailwind CSS
- **Workspace 스크립트**:
  - `pnpm dev`: 모든 앱 병렬 실행
  - `pnpm build`: packages → apps → services 순차 빌드
  - `pnpm db:generate`: Prisma 스키마 생성
  - `pnpm lint`: 모든 패키지 린트 검사

### 3. .npmrc
- `shamefully-hoist=true`: 종속성 호이스팅
- `link-workspace-packages=true`: workspace 프로토콜 사용
- `auto-install-peers=true`: peer dependencies 자동 설치

## 패키지 간 의존성 관리

### Workspace 프로토콜 사용
패키지 간 참조 시 `workspace:*` 사용:

```json
{
  "dependencies": {
    "@kpi/shared-types": "workspace:*",
    "@kpi/ui-components": "workspace:*",
    "@kpi/database": "workspace:*"
  }
}
```

### 패키지 네이밍 규칙
- Apps: `@kpi/app-name`
- Packages: `@kpi/package-name`
- Services: `@kpi/service-name`

## 사용 방법

### 1. 의존성 설치
```bash
cd kpi-automation-platform
pnpm install
```

### 2. 개발 서버 실행
```bash
# 모든 앱 동시 실행
pnpm dev

# 특정 패키지만 실행
pnpm --filter @kpi/web-dashboard dev
pnpm --filter @kpi/api dev
```

### 3. 빌드
```bash
# 전체 빌드 (순차)
pnpm build

# 특정 패키지 빌드
pnpm --filter @kpi/shared-types build
```

### 4. 데이터베이스 관리
```bash
# Prisma 스키마 생성
pnpm db:generate

# DB 푸시 (개발 환경)
pnpm db:push

# 마이그레이션
pnpm db:migrate

# Prisma Studio
pnpm db:studio
```

### 5. 린트 & 타입 체크
```bash
# 모든 패키지 린트
pnpm lint

# 모든 패키지 타입 체크
pnpm type-check
```

### 6. 패키지 추가
```bash
# 특정 워크스페이스에 패키지 추가
pnpm --filter @kpi/web-dashboard add axios

# 루트에 devDependencies 추가
pnpm add -D -w prettier

# 모든 워크스페이스에 추가
pnpm add -r lodash
```

### 7. 정리
```bash
# 모든 node_modules & 빌드 파일 삭제
pnpm clean
```

## 기술 스택

### Frontend
- Next.js 15.1 (App Router)
- React 19
- TypeScript 5.7
- Tailwind CSS 3.4
- Radix UI + Shadcn/ui

### Backend
- Next.js API Routes
- Prisma 6.2.0 (ORM)
- PostgreSQL
- NextAuth.js 5.0 (인증)

### 상태 관리 & 쿼리
- Zustand 5.0
- React Query 5.62
- React Hook Form 7.54

### 자동화 & 큐
- BullMQ 5.32
- Redis (ioredis 5.4)
- node-cron 3.0

### UI 라이브러리
- Recharts 2.15 (차트)
- Tremor React 3.19 (대시보드)
- Lucide React (아이콘)

## TypeScript 경로 매핑

tsconfig.json에 다음 경로가 설정됨:

```json
{
  "paths": {
    "@kpi/shared-types": ["./packages/shared-types/src"],
    "@kpi/ui-components": ["./packages/ui-components/src"],
    "@kpi/database": ["./packages/database/src"],
    "@kpi/integrations": ["./packages/integrations/src"]
  }
}
```

## 다음 단계

1. **각 패키지에 src/ 디렉토리 생성**
   ```bash
   mkdir -p packages/shared-types/src
   mkdir -p packages/ui-components/src
   mkdir -p packages/database/src
   mkdir -p packages/integrations/src
   ```

2. **index.ts 파일 생성**
   각 패키지의 src/ 디렉토리에 진입점 생성

3. **Prisma 스키마 설정**
   ```bash
   cd packages/database
   mkdir prisma
   # prisma/schema.prisma 파일 생성
   ```

4. **의존성 설치 및 검증**
   ```bash
   pnpm install
   pnpm type-check
   ```

5. **개발 시작**
   ```bash
   pnpm dev
   ```

## 트러블슈팅

### 의존성 충돌 시
```bash
pnpm install --force
```

### 캐시 문제 시
```bash
pnpm store prune
pnpm install
```

### TypeScript 오류 시
```bash
pnpm type-check
# 각 워크스페이스의 tsconfig.json 확인
```

## 참고 사항

- 모든 패키지는 `private: true` 설정 (npm 배포 방지)
- pnpm@10.24.0 이상 필수
- Node.js 20.0.0 이상 필수
- workspace 프로토콜로 패키지 간 심볼릭 링크 생성
- 공통 dependencies는 루트에, 패키지별 dependencies는 각 package.json에 정의

## 문의

설정 관련 문제가 있으면 이슈를 등록해주세요.
