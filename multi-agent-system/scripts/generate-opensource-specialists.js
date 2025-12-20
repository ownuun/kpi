const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', '.claude', 'agents', 'level-4-specialists');

function createSpecialist(name, description) {
  const content = `---
name: ${name}
description: ${description}
tools: Write, Edit, Read, WebSearch, WebFetch
model: haiku
permissionMode: acceptEdits
---

# ${name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}

## 🔍 Start
\`\`\`typescript
await webSearch("${description.split('.')[0]} best practices 2025");
await webSearch("${name.replace('-', ' ')} tools 2025");
\`\`\`

## 🎯 Implementation
\`\`\`typescript
// Specialized implementation for ${description}
// Searches for and applies latest 2025 best practices
\`\`\`
`;

  const filePath = path.join(baseDir, `${name}.md`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

let totalCreated = 0;

console.log('\n🔍 Creating Open Source & Integration Specialists...\n');

// Open Source Research & Analysis
const opensourceSpecs = [
  { name: 'license-checker', desc: 'License 분석 전문가. MIT, Apache, GPL 확인, 상업적 사용 가능 여부.' },
  { name: 'bundle-size-analyzer', desc: 'Bundle 크기 분석 전문가. Bundlephobia, webpack-bundle-analyzer.' },
  { name: 'security-auditor', desc: '보안 감사 전문가. Snyk, npm audit, CVE 취약점 검사.' },
  { name: 'documentation-evaluator', desc: '문서 품질 평가 전문가. API docs, examples, tutorials.' },
  { name: 'demo-finder', desc: 'Demo 찾기 전문가. CodeSandbox, StackBlitz, Codesandbox.' },
  { name: 'alternative-finder', desc: '대안 찾기 전문가. 유사 라이브러리, 비교 분석.' },
  { name: 'version-tracker', desc: '버전 추적 전문가. Breaking changes, migration guide, changelog.' },
  { name: 'community-analyzer', desc: '커뮤니티 분석 전문가. Discord, Slack, 응답 속도, 활성도.' },
  { name: 'benchmark-runner', desc: '벤치마크 실행 전문가. Performance comparison, speed tests.' },
  { name: 'compatibility-checker', desc: '호환성 검사 전문가. React 19, Next.js 15, browser support.' },
  { name: 'typescript-support-checker', desc: 'TypeScript 지원 검사 전문가. Type definitions, generics.' },
  { name: 'tree-shaking-analyzer', desc: 'Tree-shaking 분석 전문가. ESM support, side effects.' },
  { name: 'cdn-availability-checker', desc: 'CDN 가용성 검사 전문가. unpkg, jsDelivr, CDN links.' },
  { name: 'migration-guide-finder', desc: 'Migration Guide 찾기 전문가. Upgrade paths, breaking changes.' },
  { name: 'issue-tracker-analyzer', desc: 'Issue Tracker 분석 전문가. Open issues, response time, bugs.' },
  { name: 'fork-analyzer', desc: 'Fork 분석 전문가. Active forks, improvements, alternatives.' },
  { name: 'contributor-analyzer', desc: 'Contributor 분석 전문가. Core team, bus factor, diversity.' },
  { name: 'release-frequency-tracker', desc: 'Release 빈도 추적 전문가. Update cadence, stability.' },
  { name: 'breaking-change-detector', desc: 'Breaking Change 감지 전문가. API changes, deprecations.' },
  { name: 'polyfill-checker', desc: 'Polyfill 확인 전문가. Browser compatibility, polyfills needed.' },
];

opensourceSpecs.forEach(spec => {
  if (createSpecialist(spec.name, spec.desc)) totalCreated++;
});

console.log(`✅ Created ${opensourceSpecs.length} Open Source specialists`);

// Integration & Composition
const integrationSpecs = [
  { name: 'dependency-resolver', desc: 'Dependency 해결 전문가. Version conflicts, resolution strategies.' },
  { name: 'peer-deps-fixer', desc: 'Peer Dependencies 수정 전문가. Auto-install, version matching.' },
  { name: 'bundle-optimizer', desc: 'Bundle 최적화 전문가. Code splitting, lazy loading, chunks.' },
  { name: 'type-generator', desc: 'Type 생성 전문가. TypeScript definitions, type unions.' },
  { name: 'config-merger', desc: 'Config 병합 전문가. tailwind.config, tsconfig, webpack.' },
  { name: 'style-integrator', desc: 'Style 통합 전문가. Tailwind + CSS-in-JS, theme merging.' },
  { name: 'state-connector', desc: 'State 연결 전문가. Redux + React Query + Zustand 통합.' },
  { name: 'auth-integrator', desc: 'Auth 통합 전문가. NextAuth + Clerk + Auth0 조합.' },
  { name: 'api-layer-builder', desc: 'API 레이어 전문가. REST + GraphQL + tRPC 통합.' },
  { name: 'testing-integrator', desc: 'Testing 통합 전문가. Jest + Vitest + Playwright 조합.' },
  { name: 'provider-composer', desc: 'Provider 조합 전문가. Context providers, wrapper pattern.' },
  { name: 'middleware-composer', desc: 'Middleware 조합 전문가. Express, Next.js middleware stack.' },
  { name: 'plugin-system-builder', desc: 'Plugin 시스템 전문가. Extensible architecture, hooks.' },
  { name: 'wrapper-generator', desc: 'Wrapper 생성 전문가. Library wrappers, facade pattern.' },
  { name: 'adapter-pattern-builder', desc: 'Adapter Pattern 전문가. Interface adaptation, compatibility.' },
  { name: 'decorator-pattern-builder', desc: 'Decorator Pattern 전문가. Feature enhancement, composition.' },
  { name: 'factory-pattern-builder', desc: 'Factory Pattern 전문가. Object creation, dependency injection.' },
  { name: 'strategy-pattern-builder', desc: 'Strategy Pattern 전문가. Behavior switching, algorithms.' },
  { name: 'observer-pattern-builder', desc: 'Observer Pattern 전문가. Event handling, pub-sub.' },
  { name: 'singleton-pattern-builder', desc: 'Singleton Pattern 전문가. Global state, single instance.' },
];

integrationSpecs.forEach(spec => {
  if (createSpecialist(spec.name, spec.desc)) totalCreated++;
});

console.log(`✅ Created ${integrationSpecs.length} Integration specialists`);

// Custom Development (when no open source available)
const customDevSpecs = [
  { name: 'custom-hook-builder', desc: 'Custom Hook 개발 전문가. React hooks, state logic.' },
  { name: 'custom-component-builder', desc: 'Custom Component 개발 전문가. 완전 새로운 컴포넌트 제작.' },
  { name: 'custom-utility-builder', desc: 'Custom Utility 개발 전문가. Helper functions, utils.' },
  { name: 'custom-api-builder', desc: 'Custom API 개발 전문가. REST/GraphQL endpoints.' },
  { name: 'custom-middleware-builder', desc: 'Custom Middleware 개발 전문가. Express, Next.js middleware.' },
  { name: 'custom-validator-builder', desc: 'Custom Validator 개발 전문가. Validation logic, rules.' },
  { name: 'custom-transformer-builder', desc: 'Custom Transformer 개발 전문가. Data transformation, mapping.' },
  { name: 'custom-parser-builder', desc: 'Custom Parser 개발 전문가. Parsing logic, AST.' },
  { name: 'custom-generator-builder', desc: 'Custom Generator 개발 전문가. Code generation, templates.' },
  { name: 'custom-serializer-builder', desc: 'Custom Serializer 개발 전문가. Serialization, deserialization.' },
  { name: 'algorithm-implementer', desc: 'Algorithm 구현 전문가. Sorting, searching, optimization.' },
  { name: 'data-structure-builder', desc: 'Data Structure 전문가. Trees, graphs, queues, stacks.' },
  { name: 'optimization-specialist', desc: '최적화 전문가. Performance tuning, memoization.' },
  { name: 'refactoring-specialist', desc: 'Refactoring 전문가. Code cleanup, design patterns.' },
  { name: 'testing-specialist', desc: 'Testing 전문가. Unit tests, integration tests, E2E.' },
];

customDevSpecs.forEach(spec => {
  if (createSpecialist(spec.name, spec.desc)) totalCreated++;
});

console.log(`✅ Created ${customDevSpecs.length} Custom Development specialists`);

console.log(`\n🎉 Total Created: ${totalCreated} specialists`);
console.log(`\n📊 Summary:`);
console.log(`   - Open Source Research: ${opensourceSpecs.length}`);
console.log(`   - Integration & Composition: ${integrationSpecs.length}`);
console.log(`   - Custom Development: ${customDevSpecs.length}`);
