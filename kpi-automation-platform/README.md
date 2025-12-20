# KPI 자동화 트래킹 시스템

매출 3,000만원 달성을 위한 **3개 비즈니스 라인의 전체 퍼널 KPI를 자동 트래킹**하는 사내 SaaS

> **✅ Phase 6 완료!** (2025-12-18)
> Metabase 기반 분석 시스템 구축 완료. 5개 대시보드 + JWT 임베딩으로 실시간 데이터 시각화 지원.
> 자세한 내용: [PHASE_6_REPORT.md](./PHASE_6_REPORT.md)

## 🎯 프로젝트 개요

### 비즈니스 라인
1. **외주** (아웃소싱 서비스)
2. **B2B** (컨설팅 기업 대상)
3. **ANYON B2C** (프로덕트)

### 핵심 원칙
- **"작업 = 트래킹"**: SNS 포스팅, 문의 관리 등을 플랫폼에서 수행 → 자동 지표 집계
- **자동화 우선**: API 연동 가능한 건 모두 자동화
- **오픈소스 활용**: 검증된 오픈소스를 조합하여 빠르게 구축

---

## 📁 프로젝트 구조

```
233/
├── clones/                          # 오픈소스 클론 저장소
│   ├── postiz-app/                 # SNS 관리 (17개 플랫폼 지원)
│   ├── twenty/                     # CRM & Lead 관리
│   ├── metabase/                   # 비즈니스 분석 & 대시보드
│   ├── mautic/                     # 이메일 마케팅 자동화
│   └── n8n/                        # 워크플로우 자동화 엔진
│
└── kpi-automation-platform/         # 메인 프로젝트
    ├── apps/                        # 애플리케이션
    │   ├── web-dashboard/          # Next.js 통합 대시보드
    │   ├── api/                    # 백엔드 API (NestJS or Next.js API)
    │   └── automation-engine/      # 자동화 워크플로우 엔진
    │
    ├── packages/                    # 공유 패키지
    │   ├── shared-types/           # TypeScript 타입 정의
    │   ├── ui-components/          # 재사용 가능한 UI 컴포넌트
    │   ├── database/               # DB 스키마 & ORM 설정
    │   └── integrations/           # 외부 API 통합 (SNS, Email 등)
    │
    ├── services/                    # 마이크로서비스
    │   ├── sns-collector/          # SNS 데이터 수집 서비스
    │   ├── email-tracker/          # 이메일 트래킹 서비스
    │   ├── analytics-processor/    # 분석 데이터 처리
    │   └── lead-manager/           # 리드 관리 서비스
    │
    ├── scripts/                     # 유틸리티 스크립트
    └── docs/                        # 문서
```

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand or React Query

### Backend
- **API**: Next.js API Routes or NestJS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma or Drizzle ORM
- **Authentication**: NextAuth.js

### 오픈소스 통합
- **Postiz**: SNS 포스팅 & 스케줄링 (17개 플랫폼)
- **Twenty CRM**: 리드/거래 파이프라인 관리
- **n8n**: 워크플로우 자동화 (API 연결, 데이터 동기화)
- **Metabase**: 비즈니스 인텔리전스 & 대시보드
- **Mautic**: 이메일 마케팅 캠페인 & 트래킹

### Infrastructure
- **Deployment**: Vercel (Frontend) + Docker (Services)
- **Database**: Supabase or PostgreSQL
- **Cache**: Redis
- **Queue**: BullMQ

---

## 🚀 주요 기능

### 1. SNS Manager (홍보 모듈)
- ✅ 17개 플랫폼 동시 포스팅 (Postiz 활용)
- ✅ LinkedIn, Facebook, Instagram, YouTube, TikTok, Threads, Reddit
- ✅ 영상 업로드 자동화
- ✅ 조회수/반응 자동 수집 (스케줄러)
- ✅ 수동 입력 (오픈톡방, 밴드, 보배드림)

### 2. Landing Tracker (랜딩페이지 트래킹)
- ✅ UTM 파라미터 자동 생성
- ✅ 트래킹 스크립트 (GA4 + 커스텀)
- ✅ 플랫폼별 유입 추적
- ✅ 전환 이벤트 트래킹 (문의, 다운로드)

### 3. Lead Manager (문의/미팅 관리)
- ✅ 랜딩 폼 자동 연동 (Twenty CRM)
- ✅ 리드 파이프라인: 신규 → 미팅 → 견적 → 계약
- ✅ Google Calendar 미팅 동기화
- ✅ 업종별 리드 분류
- ✅ PoC 관리 (B2B)

### 4. Deal Manager (거래 관리)
- ✅ 거래 금액/계약 조건 관리
- ✅ 입금 추적
- ✅ 구독 관리 (ANYON B2C)
- ✅ 플랫폼별/업종별 거래 분석

### 5. Email Module (콜드메일 자동화)
- ✅ Mautic 연동 대량 발송
- ✅ 이메일 템플릿 관리
- ✅ 오픈율/클릭율 자동 트래킹
- ✅ 답장률 분석

### 6. Analytics Dashboard (통합 분석)
- ✅ 비즈니스 라인별 매출 현황
- ✅ 퍼널 분석 (홍보 → 유입 → 문의 → 미팅 → 거래)
- ✅ 플랫폼별 ROI 분석
- ✅ 주간/월간 리포트

---

## 🔄 자동화 워크플로우 (n8n)

### 예시 워크플로우
```
1. SNS 자동 수집
   매일 자정 → Postiz API 호출 → 조회수/반응 수 가져오기 → DB 저장

2. 랜딩 유입 → 리드 생성
   랜딩 폼 제출 → Webhook 트리거 → Twenty CRM에 리드 생성 → Slack 알림

3. 미팅 일정 동기화
   Google Calendar 이벤트 생성 → Twenty CRM 미팅 기록 → 통계 업데이트

4. 이메일 캠페인 자동화
   Mautic 캠페인 발송 → 오픈/클릭 이벤트 → DB 저장 → 대시보드 업데이트

5. 주간 리포트 자동 발송
   매주 월요일 → Metabase 리포트 생성 → 이메일/Slack 발송
```

---

## 🏗️ 개발 로드맵

### Phase 1: 인프라 구축 (1주)
- [ ] PostgreSQL + Supabase 셋업
- [ ] Next.js 프로젝트 초기화
- [ ] Monorepo 구조 설정 (Turborepo or pnpm workspace)
- [ ] Docker Compose로 오픈소스 서비스 실행

### Phase 2: 오픈소스 통합 (2주)
- [ ] Postiz 셀프호스팅 + API 연동
- [ ] Twenty CRM 셀프호스팅 + API 연동
- [ ] n8n 워크플로우 엔진 셋업
- [ ] Mautic 이메일 서버 연동

### Phase 3: 커스텀 대시보드 (2-3주)
- [ ] 통합 대시보드 UI (비즈니스 라인별)
- [ ] SNS 포스팅 인터페이스 (Postiz 임베드)
- [ ] 리드 파이프라인 뷰 (Twenty 임베드 or 커스텀)
- [ ] UTM 생성기 + 랜딩 트래커

### Phase 4: 자동화 구축 (1-2주)
- [ ] SNS 데이터 수집 스케줄러 (n8n)
- [ ] 랜딩 → 리드 자동 생성 워크플로우
- [ ] Google Calendar 동기화
- [ ] 이메일 트래킹 자동화

### Phase 5: 분석 & 리포트 (1주)
- [ ] Metabase 대시보드 구축
- [ ] 퍼널 분석 쿼리
- [ ] 주간/월간 리포트 자동화

### Phase 6: 고도화 (진행 중)
- [ ] 모바일 반응형
- [ ] 알림 시스템 (Slack, Email)
- [ ] 권한 관리 (팀원 협업)

---

## 📊 예상 비용

| 항목 | 비용 (월) |
|------|-----------|
| Vercel (호스팅) | 무료 ~ $20 |
| Supabase (DB) | 무료 ~ $25 |
| VPS (오픈소스 호스팅) | $10 ~ $20 |
| 도메인 | ~$1.5/월 |
| **총계** | **무료 ~ $66.5/월** |

---

## 🔐 환경 변수 (.env.example)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kpi_platform

# Postiz API
POSTIZ_API_URL=http://localhost:5000
POSTIZ_API_KEY=your_api_key

# Twenty CRM API
TWENTY_API_URL=http://localhost:3000
TWENTY_API_KEY=your_api_key

# n8n
N8N_URL=http://localhost:5678
N8N_API_KEY=your_api_key

# Mautic
MAUTIC_URL=http://localhost:8080
MAUTIC_CLIENT_ID=your_client_id
MAUTIC_CLIENT_SECRET=your_client_secret

# Google APIs
GOOGLE_CALENDAR_CLIENT_ID=
GOOGLE_CALENDAR_CLIENT_SECRET=

# Social Media APIs
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
YOUTUBE_API_KEY=
TIKTOK_CLIENT_KEY=

# Analytics
GA4_MEASUREMENT_ID=
```

---

## 🚦 시작하기

### 1. 오픈소스 서비스 실행
```bash
# Docker Compose로 모든 서비스 실행
cd kpi-automation-platform
docker-compose up -d
```

### 2. 메인 프로젝트 실행
```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

### 3. 접속
- **통합 대시보드**: http://localhost:3000
- **Postiz**: http://localhost:5000
- **Twenty CRM**: http://localhost:3001
- **n8n**: http://localhost:5678
- **Metabase**: http://localhost:3002

---

## 📝 라이선스

이 프로젝트는 사내용 시스템이며, 오픈소스 컴포넌트는 각각의 라이선스를 따릅니다:
- Postiz: Apache 2.0
- Twenty: AGPL-3.0
- n8n: Sustainable Use License
- Metabase: AGPL
- Mautic: GPL v3

---

## 👥 기여자

- **개발자**: [이름]
- **기획**: [이름]

---

## 📞 문의

문제가 발생하거나 질문이 있으시면 이슈를 등록해주세요.
