# 🌐 다국어 지원 (i18n) 가이드

KPI Tracker는 이제 **한국어**와 **영어**를 지원합니다!

---

## ✨ 기능

- 🇰🇷 **한국어** (기본)
- 🇬🇧 **English**
- 🔄 실시간 언어 전환
- 💾 LocalStorage에 선택 저장
- 🎨 우측 상단 언어 전환 버튼

---

## 🎯 사용 방법

### 사용자 입장

1. **언어 전환 버튼**: 화면 우측 상단에 있는 언어 전환 버튼 클릭
   ```
   ┌─────────────────┐
   │ 한국어 | English │
   └─────────────────┘
   ```

2. **자동 저장**: 선택한 언어는 브라우저에 자동 저장됩니다.

3. **새로고침**: 페이지를 새로고침해도 선택한 언어가 유지됩니다.

---

## 🔧 개발자 가이드

### 구조

```
lib/i18n/
├── locales.ts        # 지원 언어 정의
├── translations.ts   # 번역 데이터
└── context.tsx       # i18n Context Provider

components/
└── LanguageSwitcher.tsx  # 언어 전환 버튼
```

### 새 번역 추가하기

#### 1. translations.ts에 키 추가

```typescript
// lib/i18n/translations.ts
export const translations = {
  en: {
    // ... 기존 번역
    newFeature: 'New Feature',
    newButton: 'Click Here',
  },
  ko: {
    // ... 기존 번역
    newFeature: '새로운 기능',
    newButton: '여기를 클릭',
  },
};
```

#### 2. 컴포넌트에서 사용

```typescript
'use client';

import { useI18n } from '@/lib/i18n/context';

export default function MyComponent() {
  const { t } = useI18n();
  
  return (
    <div>
      <h1>{t('newFeature')}</h1>
      <button>{t('newButton')}</button>
    </div>
  );
}
```

### 서버 컴포넌트 vs 클라이언트 컴포넌트

**❌ 서버 컴포넌트에서는 사용 불가**:
```typescript
// ❌ 작동하지 않음
export default async function ServerPage() {
  const { t } = useI18n(); // Error!
  // ...
}
```

**✅ 클라이언트 컴포넌트로 분리**:
```typescript
// app/page.tsx (서버)
export default async function Page() {
  const data = await fetchData();
  return <ClientPage data={data} />;
}

// app/ClientPage.tsx (클라이언트)
'use client';

export default function ClientPage({ data }) {
  const { t } = useI18n(); // ✅ 작동
  return <div>{t('title')}</div>;
}
```

---

## 📝 번역된 텍스트

### 현재 번역 목록

| 키 | 영어 | 한국어 |
|---|---|---|
| `appTitle` | KPI Tracker | KPI 트래커 |
| `appSubtitle` | Manage your... | 소셜 미디어... |
| `snsPostsTitle` | SNS Posts | SNS 포스트 |
| `emailCampaignsTitle` | Email Campaigns | 이메일 캠페인 |
| `leadsTitle` | Leads | 리드 |
| `totalLeads` | Total Leads | 전체 리드 |
| `openRate` | open rate | 오픈율 |
| `sent` | Sent | 발송 |
| `opened` | Opened | 열람 |
| `clicked` | Clicked | 클릭 |
| `bounced` | Bounced | 반송 |
| `new` | NEW | 신규 |
| `contacted` | CONTACTED | 연락됨 |
| `qualified` | QUALIFIED | 검증됨 |
| `converted` | CONVERTED | 전환됨 |
| `lost` | LOST | 손실 |

**총 40개 이상의 번역 키 지원**

---

## 🎨 UI 요소

### 언어 전환 버튼

**위치**: 화면 우측 상단 (fixed position)

**디자인**:
- 흰색 배경
- 그림자 효과
- 선택된 언어: 파란색 배경
- 호버 효과: 회색 배경

**코드**:
```tsx
<LanguageSwitcher />
```

---

## 🔄 언어 전환 로직

### 1. 초기 로딩
```typescript
// LocalStorage에서 저장된 언어 불러오기
useEffect(() => {
  const savedLocale = localStorage.getItem('locale');
  if (savedLocale) {
    setLocale(savedLocale);
  }
}, []);
```

### 2. 언어 변경
```typescript
// 새 언어 설정 & LocalStorage에 저장
const setLocale = (newLocale: Locale) => {
  setLocaleState(newLocale);
  localStorage.setItem('locale', newLocale);
};
```

### 3. 번역 함수
```typescript
// 현재 언어에 맞는 번역 반환
const t = (key: TranslationKey): string => {
  return translations[locale][key] || key;
};
```

---

## 🌍 새 언어 추가하기

### 1. locales.ts 수정

```typescript
export type Locale = 'en' | 'ko' | 'ja'; // 일본어 추가

export const locales: Locale[] = ['en', 'ko', 'ja'];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
};
```

### 2. translations.ts에 번역 추가

```typescript
export const translations = {
  en: { /* ... */ },
  ko: { /* ... */ },
  ja: {
    appTitle: 'KPI トラッカー',
    appSubtitle: 'ソーシャルメディア...',
    // ... 모든 키 번역
  },
};
```

### 3. 완료!

언어 전환 버튼에 자동으로 표시됩니다.

---

## 📊 차트 번역

모든 Recharts 차트도 번역됩니다:

### 이메일 성과 차트
```tsx
<Bar dataKey="sent" name={t('sent')} />
<Bar dataKey="opened" name={t('opened')} />
```

### 소셜 성과 차트
```tsx
<Line dataKey="views" name={t('views')} />
<Line dataKey="likes" name={t('likes')} />
```

### 리드 퍼널 차트
```tsx
<h3>{t('leadFunnelTitle')}</h3>
<Bar dataKey="count" name={t('leads')} />
```

---

## 🔍 번역 누락 처리

번역이 없는 키는 **키 이름 자체**를 표시합니다:

```typescript
const t = (key: TranslationKey): string => {
  return translations[locale][key] || 
         translations[defaultLocale][key] || 
         key; // 폴백: 키 이름 반환
};
```

---

## 💡 Best Practices

### 1. 일관성 유지
- 동일한 의미는 동일한 키 사용
- 예: `sent` 키는 모든 차트에서 동일하게 사용

### 2. 명확한 키 이름
- ❌ `text1`, `label2`
- ✅ `emailPerformanceTitle`, `totalLeads`

### 3. 컨텍스트 제공
- 단순 단어보다 의미 있는 문장 번역
- 예: `openRate` → "open rate" / "오픈율"

### 4. 테스트
- 양쪽 언어에서 모든 페이지 확인
- 텍스트 길이 차이로 인한 레이아웃 깨짐 체크

---

## 🎯 번역 완료 체크리스트

- [x] 홈 페이지 헤더
- [x] 3개 주요 카드 (SNS, Email, Leads)
- [x] 통계 카드 (4개)
- [x] 차트 제목 (3개)
- [x] 차트 범례
- [x] 테이블 헤더
- [x] 리드 상태
- [x] 푸터 텍스트
- [x] 언어 전환 버튼

---

## 🚀 실행

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 확인
http://localhost:3000
```

우측 상단 언어 전환 버튼으로 한국어 ↔️ 영어 전환!

---

**구현 완료일**: 2025-12-18
**지원 언어**: 한국어 (기본), English
**번역 키 수**: 40+
