# Core Specialists Summary

**Total: 35 Core Specialists Created**

All specialists follow the pattern:
1. **Pre-research**: WebSearch for 2025 latest trends before starting
2. **Implementation**: Upgraded version reflecting best practices
3. **Error handling**: Immediate WebSearch if stuck during work
4. **Model**: Haiku (fast and cost-effective for specialists)

---

## 📝 Form Inputs (10)

| Specialist | Description | Key Features |
|------------|-------------|--------------|
| `text-input-builder` | Text input 전문가 | autocomplete, maxLength, accessibility |
| `email-input-builder-v2` | Email validation 전문가 | WebAuthn, disposable email blocking, domain typo correction |
| `password-input-builder` | Password 전문가 | Show/hide toggle, strength indicator, OWASP compliance |
| `phone-input-builder` | Phone input 전문가 | Country code selector, E.164 format, auto-formatting |
| `number-input-builder` | Number input 전문가 | Min/max, step, thousand separator |
| `select-builder` | Select/Dropdown 전문가 | shadcn/ui Select, searchable, multi-select |
| `date-picker-builder` | Date picker 전문가 | shadcn/ui Calendar, date range, timezone |
| `checkbox-builder` | Checkbox 전문가 | Indeterminate state, group selection |
| `textarea-builder` | Textarea 전문가 | Auto-resize, character count, rich text |
| `radio-builder` | Radio button 전문가 | Grouped, description, card style |

---

## 🎨 Layouts (5)

| Specialist | Description | Key Features |
|------------|-------------|--------------|
| `card-builder` | Card 레이아웃 전문가 | Header, Content, Footer, shadcn/ui |
| `grid-builder` | Grid 레이아웃 전문가 | CSS Grid, responsive columns, gap |
| `modal-builder` | Modal/Dialog 전문가 | Overlay, accessibility, ESC close, focus trap |
| `table-builder` | Table 전문가 | Sorting, filtering, pagination, shadcn/ui |
| `tabs-builder` | Tabs 전문가 | Tab switching, keyboard navigation |

---

## 📊 Charts (5)

| Specialist | Description | Key Features |
|------------|-------------|--------------|
| `line-chart-builder` | Line Chart 전문가 | Time series, multiple lines, Recharts |
| `bar-chart-builder` | Bar Chart 전문가 | Comparison, stacked, horizontal/vertical |
| `pie-chart-builder` | Pie/Donut Chart 전문가 | Percentage, labels, animation |
| `area-chart-builder` | Area Chart 전문가 | Stacked area, gradient fill, trends |
| `gauge-chart-builder` | Gauge Chart 전문가 | KPI progress, radial bar, color thresholds |

---

## 🔌 API Routes (5)

| Specialist | Description | Key Features |
|------------|-------------|--------------|
| `get-route-creator` | GET API Route 전문가 | Pagination, filtering, sorting, Zod validation |
| `post-route-creator` | POST API Route 전문가 | Create resource, validation, duplicate check |
| `patch-route-creator` | PATCH API Route 전문가 | Partial update, optimistic locking, version control |
| `delete-route-creator` | DELETE API Route 전문가 | Soft delete, hard delete, cascade, dependencies |
| `bulk-operations-creator` | Bulk API 전문가 | Batch create/update/delete, transaction, 1000 items limit |

---

## 💾 Database (5)

| Specialist | Description | Key Features |
|------------|-------------|--------------|
| `schema-designer` | Prisma Schema 전문가 | Models, relations, constraints, indexes |
| `index-optimizer` | Index 최적화 전문가 | Composite index, covering index, partial index |
| `migration-writer` | Migration 전문가 | Zero-downtime, rollback, safety checklist |
| `seed-creator` | Database Seed 전문가 | faker.js, test data, consistency |
| `relation-manager` | Prisma 관계 전문가 | 1:1, 1:N, N:M, cascade, referential actions |

---

## 🔗 Integrations (5)

| Specialist | Description | Key Features |
|------------|-------------|--------------|
| `linkedin-oauth-expert` | LinkedIn OAuth 전문가 | Login, profile, posting permissions, token refresh |
| `facebook-post-expert` | Facebook Graph API 전문가 | Post creation, image upload, scheduling, rate limits |
| `google-calendar-expert` | Google Calendar API 전문가 | Event CRUD, reminders, attendees, recurrence |
| `sendgrid-expert` | SendGrid 이메일 전문가 | Transactional email, templates, tracking, webhooks |
| `stripe-expert` | Stripe 결제 전문가 | Checkout, subscription, webhooks, payment events |

---

## 🚀 Usage Pattern

Each specialist agent:

1. **Starts with research**:
```typescript
await webSearch("${expertise} best practices 2025");
await webFetch("${officialDocsUrl}", "latest patterns");
```

2. **Implements with latest trends**:
- Not copy-paste from old patterns
- Upgraded with 2025 best practices
- Modern libraries and techniques

3. **Handles errors intelligently**:
```typescript
if (error) {
  await webSearch("${error.message} solution 2025");
  applyFix();
  retry();
}
```

4. **Follows standards**:
- Accessibility (WCAG)
- Security (OWASP)
- Performance optimization
- TypeScript strict mode
- shadcn/ui design system

---

## 📁 File Locations

All specialist agents are located in:
```
multi-agent-system/.claude/agents/level-4-specialists/
```

Each specialist is a markdown file with:
- Agent metadata (name, description, tools, model)
- Pre-research workflow
- Implementation code
- Error handling patterns

---

## 🎯 Next Steps

These 35 core specialists form the foundation. The full 1000-agent system can be built by:

1. Adding more specialized variants (e.g., `email-input-with-autocomplete`, `phone-input-international`)
2. Creating domain-specific specialists (e.g., `lead-form-builder`, `invoice-table-builder`)
3. Adding testing specialists (e.g., `unit-test-writer`, `e2e-test-writer`)
4. Creating optimization specialists (e.g., `bundle-optimizer`, `image-optimizer`)

Each new specialist follows the same pattern established here.
