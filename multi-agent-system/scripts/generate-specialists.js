const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', '.claude', 'agents', 'level-4-specialists');

// 전문가 템플릿 생성 함수
function createSpecialist(name, description, category, searchQueries, implementation) {
  const content = `---
name: ${name}
description: ${description}
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# ${name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}

## 🔍 Start
\`\`\`typescript
${searchQueries.map(q => `await webSearch("${q}");`).join('\n')}
\`\`\`

## 🎯 Implementation
${implementation}
`;

  const filePath = path.join(baseDir, `${name}.md`);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Created: ${name}`);
}

// 1. Advanced Form Inputs (90개)
const advancedFormInputs = [
  // Search & Autocomplete (15개)
  { name: 'search-input-builder', desc: '검색 입력 전문가. 실시간 검색, 하이라이트, 키보드 네비게이션.' },
  { name: 'autocomplete-builder', desc: '자동완성 전문가. Fuzzy search, 최근 검색, 인기 검색어.' },
  { name: 'combobox-builder', desc: 'Combobox 전문가. Select + Input, 커스텀 값 입력.' },
  { name: 'multi-select-builder', desc: '다중 선택 전문가. Chips, 전체선택, 검색 필터.' },
  { name: 'tags-input-builder', desc: 'Tags 입력 전문가. 태그 추가/삭제, 중복 방지, 자동완성.' },
  { name: 'mention-input-builder', desc: 'Mention 입력 전문가. @mentions, # hashtags, 사용자 검색.' },
  { name: 'command-palette-builder', desc: 'Command Palette 전문가. ⌘K 단축키, 명령 검색, 실행.' },
  { name: 'global-search-builder', desc: '전역 검색 전문가. 전체 콘텐츠 검색, 카테고리 필터.' },
  { name: 'filter-search-builder', desc: '필터 검색 전문가. 고급 필터, 저장된 검색, 쿼리 빌더.' },
  { name: 'faceted-search-builder', desc: 'Faceted Search 전문가. 다중 필터, 카운트, 범위.' },

  // Rich Text & Code (15개)
  { name: 'rich-text-editor-builder', desc: 'Rich Text Editor 전문가. TipTap, formatting, 이미지.' },
  { name: 'markdown-editor-builder', desc: 'Markdown Editor 전문가. Live preview, syntax highlight.' },
  { name: 'code-editor-builder', desc: 'Code Editor 전문가. Monaco Editor, syntax, autocomplete.' },
  { name: 'wysiwyg-editor-builder', desc: 'WYSIWYG Editor 전문가. Quill, formatting toolbar.' },
  { name: 'html-editor-builder', desc: 'HTML Editor 전문가. HTML/CSS 편집, live preview.' },
  { name: 'json-editor-builder', desc: 'JSON Editor 전문가. 구조 편집, validation, format.' },
  { name: 'sql-editor-builder', desc: 'SQL Editor 전문가. Syntax highlight, 쿼리 실행.' },
  { name: 'formula-editor-builder', desc: 'Formula Editor 전문가. Excel-like 수식, 함수.' },
  { name: 'latex-editor-builder', desc: 'LaTeX Editor 전문가. 수식 편집, live preview.' },
  { name: 'diagram-editor-builder', desc: 'Diagram Editor 전문가. Mermaid, 플로우차트, UML.' },

  // Date & Time (10개)
  { name: 'datetime-picker-builder', desc: 'DateTime Picker 전문가. 날짜 + 시간, timezone.' },
  { name: 'date-range-picker-builder', desc: 'Date Range Picker 전문가. 시작-종료일, 프리셋.' },
  { name: 'time-picker-builder', desc: 'Time Picker 전문가. 12/24시간, AM/PM, 분 단위.' },
  { name: 'duration-picker-builder', desc: 'Duration Picker 전문가. 시간 간격, HH:MM:SS.' },
  { name: 'calendar-builder', desc: 'Calendar 전문가. 월간 달력, 이벤트 표시, 선택.' },
  { name: 'year-picker-builder', desc: 'Year Picker 전문가. 연도 선택, 범위.' },
  { name: 'month-picker-builder', desc: 'Month Picker 전문가. 월 선택, 연/월 조합.' },
  { name: 'week-picker-builder', desc: 'Week Picker 전문가. 주 단위 선택, ISO week.' },
  { name: 'timezone-picker-builder', desc: 'Timezone Picker 전문가. Timezone 선택, UTC offset.' },
  { name: 'recurring-schedule-builder', desc: 'Recurring Schedule 전문가. 반복 일정, RRULE.' },

  // Numeric & Sliders (10개)
  { name: 'currency-input-builder', desc: 'Currency 입력 전문가. 통화 기호, 천단위 구분.' },
  { name: 'percentage-input-builder', desc: 'Percentage 입력 전문가. % 기호, 0-100 제한.' },
  { name: 'slider-builder', desc: 'Slider 전문가. Range slider, 단계, 레이블.' },
  { name: 'range-slider-builder', desc: 'Range Slider 전문가. Min-Max 범위, 듀얼 핸들.' },
  { name: 'rating-input-builder', desc: 'Rating 입력 전문가. 별점, 하트, 이모지.' },
  { name: 'stepper-input-builder', desc: 'Stepper 입력 전문가. +/- 버튼, 증감.' },
  { name: 'calculator-input-builder', desc: 'Calculator 입력 전문가. 계산기 UI, 수식 입력.' },
  { name: 'unit-converter-input-builder', desc: 'Unit Converter 입력 전문가. 단위 변환, 환율.' },
  { name: 'gauge-input-builder', desc: 'Gauge 입력 전문가. 게이지 UI로 값 입력.' },
  { name: 'knob-input-builder', desc: 'Knob 입력 전문가. 노브 UI, 회전 입력.' },

  // Advanced Inputs (20개)
  { name: 'signature-pad-builder', desc: 'Signature Pad 전문가. 서명 입력, Canvas, 저장.' },
  { name: 'drawing-canvas-builder', desc: 'Drawing Canvas 전문가. 드로잉, 펜, 색상.' },
  { name: 'qr-code-scanner-builder', desc: 'QR Scanner 전문가. QR/바코드 스캔, 카메라.' },
  { name: 'barcode-scanner-builder', desc: 'Barcode Scanner 전문가. 1D/2D 바코드 스캔.' },
  { name: 'voice-input-builder', desc: 'Voice Input 전문가. Speech-to-text, 음성 인식.' },
  { name: 'ocr-input-builder', desc: 'OCR 입력 전문가. 이미지에서 텍스트 추출.' },
  { name: 'location-picker-builder', desc: 'Location Picker 전문가. 지도, GPS, 주소 검색.' },
  { name: 'address-input-builder', desc: 'Address 입력 전문가. 주소 자동완성, 우편번호.' },
  { name: 'credit-card-input-builder', desc: 'Credit Card 입력 전문가. 카드번호, CVV, 만료일.' },
  { name: 'bank-account-input-builder', desc: 'Bank Account 입력 전문가. 계좌번호, 은행 선택.' },
  { name: 'ssn-input-builder', desc: 'SSN 입력 전문가. 주민번호, 마스킹, validation.' },
  { name: 'passport-input-builder', desc: 'Passport 입력 전문가. 여권번호, validation.' },
  { name: 'license-plate-input-builder', desc: 'License Plate 입력 전문가. 차량번호, 형식.' },
  { name: 'ip-address-input-builder', desc: 'IP Address 입력 전문가. IPv4/IPv6, validation.' },
  { name: 'mac-address-input-builder', desc: 'MAC Address 입력 전문가. MAC 주소, 형식.' },
  { name: 'hex-color-input-builder', desc: 'Hex Color 입력 전문가. #RRGGBB, validation.' },
  { name: 'rgb-color-input-builder', desc: 'RGB Color 입력 전문가. RGB(r,g,b), sliders.' },
  { name: 'hsl-color-input-builder', desc: 'HSL Color 입력 전문가. HSL(h,s,l), sliders.' },
  { name: 'emoji-picker-builder', desc: 'Emoji Picker 전문가. 이모지 선택, 검색, 최근.' },
  { name: 'icon-picker-builder', desc: 'Icon Picker 전문가. 아이콘 라이브러리, 검색.' },

  // Validation & Formatting (20개)
  { name: 'regex-validator-builder', desc: 'Regex Validator 전문가. 정규식 검증, 패턴.' },
  { name: 'custom-validator-builder', desc: 'Custom Validator 전문가. 커스텀 validation 로직.' },
  { name: 'async-validator-builder', desc: 'Async Validator 전문가. API 검증, 중복 체크.' },
  { name: 'debounced-validator-builder', desc: 'Debounced Validator 전문가. Debounce, 실시간 검증.' },
  { name: 'conditional-validator-builder', desc: 'Conditional Validator 전문가. 조건부 validation.' },
  { name: 'cross-field-validator-builder', desc: 'Cross Field Validator 전문가. 필드 간 검증.' },
  { name: 'format-enforcer-builder', desc: 'Format Enforcer 전문가. 입력 형식 강제, 마스킹.' },
  { name: 'input-mask-builder', desc: 'Input Mask 전문가. 입력 마스크, placeholder.' },
  { name: 'auto-format-builder', desc: 'Auto Format 전문가. 자동 포맷팅, 정리.' },
  { name: 'input-sanitizer-builder', desc: 'Input Sanitizer 전문가. XSS 방지, sanitize.' },
  { name: 'trim-whitespace-builder', desc: 'Trim Whitespace 전문가. 공백 제거, normalize.' },
  { name: 'normalize-unicode-builder', desc: 'Unicode Normalizer 전문가. 유니코드 정규화.' },
  { name: 'transliterate-builder', desc: 'Transliterate 전문가. 한글↔영문 변환.' },
  { name: 'slug-generator-builder', desc: 'Slug Generator 전문가. URL-safe slug 생성.' },
  { name: 'uuid-generator-builder', desc: 'UUID Generator 전문가. UUID v4 생성.' },
  { name: 'random-password-generator-builder', desc: 'Password Generator 전문가. 안전한 비밀번호 생성.' },
  { name: 'checksum-validator-builder', desc: 'Checksum Validator 전문가. Checksum 검증.' },
  { name: 'luhn-validator-builder', desc: 'Luhn Validator 전문가. Luhn algorithm, 카드번호.' },
  { name: 'iban-validator-builder', desc: 'IBAN Validator 전문가. IBAN 검증.' },
  { name: 'bic-validator-builder', desc: 'BIC Validator 전문가. BIC/SWIFT 코드 검증.' }
];

// 생성 실행
console.log('🚀 Generating Advanced Form Input Specialists...\n');

advancedFormInputs.forEach((spec, index) => {
  const searchQueries = [
    `${spec.desc.split('.')[0]} best practices 2025`,
    `${spec.name.replace('-builder', '')} React component 2025`
  ];

  const implementation = `\`\`\`tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function ${spec.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}({ name, ...props }) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <Input
        {...register(name)}
        {...props}
        aria-invalid={errors[name] ? 'true' : 'false'}
      />
      {errors[name] && (
        <p className="text-sm text-destructive mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
}
\`\`\``;

  createSpecialist(spec.name, spec.desc, 'form-inputs', searchQueries, implementation);
});

console.log(`\n✅ Created ${advancedFormInputs.length} Advanced Form Input Specialists!`);
