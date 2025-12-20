# 🔄 Agent Workflow Pattern

모든 에이전트가 따라야 하는 작업 흐름 패턴

## 📋 핵심 원칙

1. **시작 전 검색**: 작업 시작 전 항상 최신 트렌드 검색
2. **막힐 때 검색**: 문제 발생 시 즉시 웹 검색
3. **업그레이드 구현**: 단순 복붙 금지, 항상 개선
4. **변경 이력 기록**: 모든 업그레이드 문서화

---

## 🎯 Standard Workflow

### Phase 1: 사전 조사 (Pre-Research)

```typescript
// 작업을 받으면 무조건 먼저:

async function startTask(taskDescription: string) {
  console.log("📊 Phase 1: 최신 트렌드 조사 시작...");

  // 1. 내 전문 분야 최신 트렌드
  const trends = await webSearch(
    `${myExpertise} best practices 2025`
  );

  // 2. 공식 문서 최신 버전
  const officialDocs = await webFetch(
    getOfficialDocsUrl(myExpertise),
    "Get latest implementation patterns and updates"
  );

  // 3. GitHub 최신 이슈/PR (실제 문제 사례)
  const githubIssues = await webSearch(
    `${myExpertise} github issues solutions 2025`
  );

  // 4. Stack Overflow 최신 답변
  const stackoverflow = await webSearch(
    `${myExpertise} stackoverflow 2025`
  );

  // 5. 관련 블로그/아티클
  const articles = await webSearch(
    `${myExpertise} latest improvements 2025`
  );

  return analyzeAndExtractImprovements({
    trends,
    officialDocs,
    githubIssues,
    stackoverflow,
    articles,
  });
}
```

### Phase 2: 구현 (Implementation)

```typescript
async function implement(improvements: Improvement[]) {
  console.log("🔨 Phase 2: 구현 시작...");

  try {
    // 개선점 반영하여 구현
    const result = await buildComponent(improvements);
    return result;

  } catch (error) {
    // ⚠️ 막히면 즉시 검색!
    console.log("❌ 에러 발생! 즉시 검색 시작...");
    return await handleError(error);
  }
}
```

### Phase 3: 에러 처리 (Error Handling with Search)

```typescript
async function handleError(error: Error) {
  console.log("🔍 Phase 3: 에러 해결 검색 중...");

  // 1. 에러 메시지로 검색
  const solutions = await webSearch(
    `${error.message} solution 2025`
  );

  // 2. Stack Overflow에서 정확한 답변 찾기
  const stackOverflowAnswer = await webSearch(
    `${error.message} stackoverflow`
  );

  // 3. GitHub Issues에서 같은 문제 찾기
  const githubSolution = await webSearch(
    `${error.message} github issue fix`
  );

  // 4. 공식 문서 troubleshooting
  const officialFix = await webFetch(
    getOfficialDocsUrl(myExpertise),
    `Find solution for: ${error.message}`
  );

  // 5. 해결책 적용
  const fix = selectBestSolution({
    solutions,
    stackOverflowAnswer,
    githubSolution,
    officialFix,
  });

  console.log(`✅ 해결책 발견: ${fix.description}`);

  // 6. 재시도
  return await retryWithFix(fix);
}
```

### Phase 4: 검증 (Validation)

```typescript
async function validate(result: any) {
  console.log("✅ Phase 4: 검증 중...");

  // 1. 최신 베스트 프랙티스 준수 확인
  const isFollowingBestPractices = await checkBestPractices(result);

  if (!isFollowingBestPractices) {
    console.log("⚠️ 베스트 프랙티스 미준수! 재검색...");

    const betterWay = await webSearch(
      `better way to implement ${taskType} 2025`
    );

    return await improveImplementation(result, betterWay);
  }

  // 2. 접근성 체크
  const accessibilityIssues = await checkAccessibility(result);

  if (accessibilityIssues.length > 0) {
    console.log("♿ 접근성 문제 발견! 해결 방법 검색...");

    for (const issue of accessibilityIssues) {
      const fix = await webSearch(
        `${issue.type} accessibility fix WCAG 2025`
      );
      await applyAccessibilityFix(result, fix);
    }
  }

  // 3. 성능 체크
  const performanceIssues = await checkPerformance(result);

  if (performanceIssues.length > 0) {
    console.log("⚡ 성능 문제 발견! 최적화 방법 검색...");

    const optimizations = await webSearch(
      `${taskType} performance optimization 2025`
    );

    await applyOptimizations(result, optimizations);
  }

  // 4. 보안 체크
  const securityIssues = await checkSecurity(result);

  if (securityIssues.length > 0) {
    console.log("🔒 보안 문제 발견! 해결 방법 검색...");

    for (const issue of securityIssues) {
      const fix = await webSearch(
        `${issue.type} security vulnerability fix 2025`
      );
      await applySecurityFix(result, fix);
    }
  }

  return result;
}
```

### Phase 5: 문서화 (Documentation)

```typescript
async function documentChanges(result: any, improvements: Improvement[]) {
  console.log("📝 Phase 5: 변경 이력 문서화...");

  const changelog = {
    version: incrementVersion(),
    date: new Date().toISOString(),
    changes: improvements.map(imp => ({
      type: imp.type,
      description: imp.description,
      source: imp.source, // 어디서 찾았는지
      impact: imp.impact,
    })),
    searchQueries: improvements.map(imp => imp.searchQuery),
    references: improvements.map(imp => imp.url),
  };

  await writeChangelog(changelog);

  return {
    result,
    changelog,
  };
}
```

---

## 🔥 실제 예시

### 예시 1: Email Input Builder

```typescript
// Task: "Create email input component"

// Phase 1: 사전 조사
const research = await startTask("email input");
/*
검색 결과:
1. "inputMode='email'" - 모바일 키보드 최적화 (필수!)
2. "autocomplete='email webauthn'" - WebAuthn 지원 (2025 신규)
3. "spellcheck='false'" - 이메일은 맞춤법 검사 불필요
4. "일회용 이메일 차단" - 보안 트렌드
5. "aria-live='polite'" - 접근성 실시간 피드백
*/

// Phase 2: 구현
const component = await implement(research.improvements);

// Phase 3: 에러 발생!
/*
Error: "Zod email validation too permissive"
→ 즉시 검색: "zod email strict validation 2025"
→ 발견: refine()으로 일회용 이메일 차단
→ 적용!
*/

// Phase 4: 검증
/*
접근성 체크 실패: aria-describedby 누락
→ 검색: "react hook form aria-describedby 2025"
→ 발견: FormMessage에 자동 연결
→ 적용!
*/

// Phase 5: 문서화
/*
Changelog:
- Added inputMode="email" (Source: MDN 2025)
- Added WebAuthn support (Source: W3C)
- Added disposable email blocking (Source: GitHub issue #123)
- Fixed accessibility (Source: WCAG 2.2)
*/
```

### 예시 2: LinkedIn Post Builder

```typescript
// Task: "Create LinkedIn post API integration"

// Phase 1: 사전 조사
const research = await startTask("LinkedIn Share API");
/*
검색 결과:
1. "LinkedIn API v2 deprecated" - v2 곧 종료! (중요!)
2. "LinkedIn UGC Posts API" - 최신 API 사용 필수
3. "OAuth 2.0 PKCE" - 보안 강화 (2025)
4. "Rate limiting 100/day" - 제한 변경됨
5. "Image upload via asset API" - 새로운 방식
*/

// Phase 2: 구현
const integration = await implement(research.improvements);

// Phase 3: 에러 발생!
/*
Error: "401 Unauthorized"
→ 즉시 검색: "LinkedIn API 401 error 2025"
→ 발견: "w_member_social" scope 필요
→ 적용!

Error: "429 Too Many Requests"
→ 즉시 검색: "LinkedIn API rate limit handling 2025"
→ 발견: exponential backoff 권장
→ 적용!
*/

// Phase 4: 검증
/*
보안 체크: access token 노출 위험
→ 검색: "OAuth token secure storage 2025"
→ 발견: HttpOnly cookie + encryption
→ 적용!
*/

// Phase 5: 문서화
/*
Changelog:
- Migrated to UGC Posts API (LinkedIn v2 deprecation)
- Added PKCE for OAuth (Security best practice)
- Implemented exponential backoff (Rate limit handling)
- Secured token storage (OWASP recommendation)
*/
```

### 예시 3: Bar Chart Builder

```typescript
// Task: "Create bar chart component"

// Phase 1: 사전 조사
const research = await startTask("recharts bar chart");
/*
검색 결과:
1. "Recharts 2.13.0" - 최신 버전 (2025년 1월)
2. "ResponsiveContainer required" - 반응형 필수
3. "Custom tooltip" - UX 개선 트렌드
4. "Dark mode support" - 다크모드 필수
5. "Animation customization" - 성능 최적화
*/

// Phase 2: 구현
const chart = await implement(research.improvements);

// Phase 3: 에러 발생!
/*
Error: "Chart not responsive on mobile"
→ 즉시 검색: "recharts responsive mobile 2025"
→ 발견: aspect ratio 설정 필요
→ 적용!

Error: "Tooltip z-index issue"
→ 즉시 검색: "recharts tooltip z-index fix"
→ 발견: portal 사용 권장
→ 적용!
*/

// Phase 4: 검증
/*
접근성 체크: 스크린리더 지원 없음
→ 검색: "recharts accessibility 2025"
→ 발견: role="img" + aria-label
→ 적용!

성능 체크: 1000개 데이터 느림
→ 검색: "recharts performance large dataset"
→ 발견: virtualization 권장
→ 적용!
*/

// Phase 5: 문서화
/*
Changelog:
- Updated to Recharts 2.13.0 (Latest)
- Added responsive container (Mobile support)
- Implemented custom tooltip (UX improvement)
- Added dark mode support (Design trend)
- Fixed accessibility (WCAG 2.2)
- Optimized for large datasets (Performance)
*/
```

---

## 🎯 검색 패턴 템플릿

### 시작 전 검색

```typescript
// 1. 기본 베스트 프랙티스
await webSearch(`${myTopic} best practices 2025`);

// 2. 공식 문서
await webFetch(officialDocsUrl, "latest implementation");

// 3. 최신 변경사항
await webSearch(`${myTopic} what's new 2025`);

// 4. 일반적인 실수
await webSearch(`${myTopic} common mistakes to avoid`);

// 5. 성능 최적화
await webSearch(`${myTopic} performance optimization 2025`);
```

### 에러 발생 시 검색

```typescript
// 1. 에러 메시지 직접 검색
await webSearch(`"${error.message}" solution`);

// 2. Stack Overflow
await webSearch(`${error.message} stackoverflow`);

// 3. GitHub Issues
await webSearch(`${error.message} github issue`);

// 4. 공식 문서 트러블슈팅
await webFetch(officialDocsUrl, `troubleshoot ${error.message}`);

// 5. 최신 해결책
await webSearch(`${error.message} fix 2025`);
```

### 검증 실패 시 검색

```typescript
// 1. 베스트 프랙티스 재확인
await webSearch(`better way to ${currentApproach} 2025`);

// 2. 대안 방법
await webSearch(`${currentApproach} alternatives 2025`);

// 3. 성능 비교
await webSearch(`${currentApproach} vs alternatives performance`);

// 4. 전문가 의견
await webSearch(`${currentApproach} expert recommendations`);
```

---

## ✅ 체크리스트

모든 에이전트는 다음을 준수:

### 시작 단계
- [ ] 최소 3개 이상의 웹 검색 수행
- [ ] 공식 문서 최신 버전 확인
- [ ] 2025년 최신 트렌드 반영

### 구현 단계
- [ ] 에러 발생 시 즉시 웹 검색
- [ ] 해결책 적용 후 재시도
- [ ] 모든 해결 과정 로깅

### 검증 단계
- [ ] 베스트 프랙티스 준수 확인
- [ ] 접근성 검증
- [ ] 성능 검증
- [ ] 보안 검증

### 문서화 단계
- [ ] 변경 사항 상세 기록
- [ ] 검색 쿼리 기록
- [ ] 참조 URL 기록
- [ ] 버전 업데이트

---

## 🔄 지속적 개선

```typescript
// 매 작업마다:
const workflow = {
  before: "항상 검색으로 시작",
  during: "막히면 즉시 검색",
  after: "검증 + 문서화",

  mindset: "복붙 금지, 항상 업그레이드",
};
```

---

**모든 에이전트는 이 워크플로우를 따릅니다. 검색 → 분석 → 개선 → 검증 → 문서화** 🔄
