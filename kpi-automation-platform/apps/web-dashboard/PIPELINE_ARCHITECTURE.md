# Pipeline Architecture Documentation

## System Overview

리드 파이프라인 칸반 보드는 Twenty CRM과 통합된 완전한 리드 관리 시스템입니다.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser Client                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           app/pipeline/page.tsx (Main Page)             │    │
│  │  - State Management (leads, loading, error)             │    │
│  │  - CRUD Handlers (add, update, delete)                  │    │
│  │  - API Calls                                             │    │
│  └────────────────┬───────────────────────────────────────┘    │
│                   │                                              │
│                   ▼                                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │        components/pipeline/KanbanBoard.tsx             │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │ DndContext (Drag & Drop Manager)                 │  │    │
│  │  │  - onDragStart, onDragEnd                        │  │    │
│  │  │  - Active overlay                                │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │ Filters & Sort                                   │  │    │
│  │  │  - Search, Business Line, Assignee               │  │    │
│  │  │  - Sort by: date, amount, name                   │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  └────────────────┬───────────────────────────────────────┘    │
│                   │                                              │
│       ┌───────────┼───────────┬─────────────┐                   │
│       ▼           ▼           ▼             ▼                   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐             │
│  │PipeLine │ │ Kanban  │ │ Kanban  │ │  Lead    │             │
│  │ Stats   │ │ Column  │ │ Column  │ │  Detail  │             │
│  │         │ │  (new)  │ │(contact)│ │  Modal   │             │
│  └─────────┘ └────┬────┘ └────┬────┘ └──────────┘             │
│                   │           │                                 │
│              ┌────┼───────────┼────┐                            │
│              ▼    ▼           ▼    ▼                            │
│         ┌────────┐  ┌──────────┐  ┌─────────┐                  │
│         │  Lead  │  │   Lead   │  │  Lead   │                  │
│         │  Quick │  │   Card   │  │  Card   │                  │
│         │  Add   │  │  (drag)  │  │  (drag) │                  │
│         └────────┘  └──────────┘  └─────────┘                  │
│                                                                  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       │ HTTP Requests
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           app/api/pipeline/route.ts                     │    │
│  │  GET    - List all leads (with filters)                │    │
│  │  POST   - Create new lead                              │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │        app/api/pipeline/[id]/route.ts                   │    │
│  │  GET    - Get single lead                              │    │
│  │  PATCH  - Update lead (including stage change)         │    │
│  │  DELETE - Delete lead                                  │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       │ GraphQL Requests
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              @kpi/integrations-twenty (SDK)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TwentySDK Methods:                                             │
│  - listPeople()      : Fetch leads                             │
│  - getPerson(id)     : Get single lead                         │
│  - createPerson()    : Create new lead                         │
│  - updatePerson(id)  : Update lead                             │
│  - deletePerson(id)  : Delete lead                             │
│                                                                  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       │ GraphQL over HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Twenty CRM API                              │
│                (https://api.twenty.com/graphql)                  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
page.tsx (Pipeline Page)
│
└─── KanbanBoard
     │
     ├─── PipelineStats
     │    └─── StatCard (x6)
     │
     ├─── Filters & Controls
     │    ├─── Search Input
     │    ├─── Business Line Select
     │    ├─── Assignee Select
     │    └─── Sort Select
     │
     ├─── DndContext
     │    │
     │    └─── KanbanColumn (x7)
     │         │
     │         ├─── Column Header
     │         │    ├─── Stage Badge
     │         │    ├─── Lead Count
     │         │    └─── Total Amount
     │         │
     │         ├─── LeadQuickAdd
     │         │    └─── Quick Add Form
     │         │
     │         └─── SortableContext
     │              └─── LeadCard (multiple)
     │                   ├─── Avatar/Initials
     │                   ├─── Name & Title
     │                   ├─── Company
     │                   ├─── Contact Info
     │                   ├─── Amount & Probability
     │                   └─── Tags
     │
     └─── LeadDetailModal
          ├─── Header
          ├─── Stage Selector
          ├─── Contact Fields
          ├─── Deal Information
          ├─── Business Line & Assignee
          ├─── Notes
          ├─── Metadata
          └─── Action Buttons
```

## Data Flow

### 1. Initial Load

```
User visits /pipeline
    │
    ▼
page.tsx useEffect()
    │
    ▼
fetchLeads() → GET /api/pipeline
    │
    ▼
API route.ts → TwentySDK.listPeople()
    │
    ▼
Twenty CRM GraphQL API
    │
    ▼
Response: Person[] → mapped to Lead[]
    │
    ▼
State updated: setLeads()
    │
    ▼
KanbanBoard receives leads prop
    │
    ▼
Filter & Sort applied (useMemo)
    │
    ▼
Group by stage (useMemo)
    │
    ▼
Render 7 KanbanColumns with filtered leads
```

### 2. Drag & Drop Flow

```
User drags LeadCard
    │
    ▼
DndContext.onDragStart()
    │
    ├─── Set activeId
    └─── Show DragOverlay
         │
         ▼
User drops on different KanbanColumn
    │
    ▼
DndContext.onDragEnd()
    │
    ├─── Get leadId (active.id)
    ├─── Get newStage (over.id)
    └─── Call onUpdateLead(leadId, { stage: newStage })
         │
         ▼
page.tsx handleUpdateLead()
    │
    ├─── Optimistic update: setLeads() with new stage
    │
    └─── PATCH /api/pipeline/[id]
         │
         ▼
API [id]/route.ts → TwentySDK.updatePerson()
    │
    ▼
Twenty CRM updates Person.stage
    │
    ▼
Success → UI already updated (optimistic)
    │
    ▼
Failure → Revert with fetchLeads()
```

### 3. Quick Add Flow

```
User clicks "리드 추가" in column
    │
    ▼
LeadQuickAdd shows form
    │
    ▼
User fills form and submits
    │
    ▼
LeadQuickAdd.onAdd({ ...formData, stage })
    │
    ▼
KanbanColumn.onAddLead()
    │
    ▼
page.tsx handleAddLead()
    │
    ├─── POST /api/pipeline
    │    │
    │    ▼
    │    API route.ts → TwentySDK.createPerson()
    │    │
    │    ▼
    │    Twenty CRM creates Person
    │
    └─── Response: new Lead
         │
         ▼
State updated: setLeads([...leads, newLead])
    │
    ▼
New LeadCard appears in column
```

### 4. Lead Detail Flow

```
User clicks LeadCard
    │
    ▼
LeadCard.onClick()
    │
    ▼
KanbanColumn.onLeadClick(lead)
    │
    ▼
KanbanBoard: setSelectedLead(lead)
    │
    ▼
LeadDetailModal opens (isOpen=true)
    │
    ├─── Display all lead information
    │
    └─── User clicks "수정"
         │
         ▼
Edit mode: setIsEditing(true)
    │
    ▼
User modifies fields
    │
    ▼
User clicks "저장"
    │
    ▼
LeadDetailModal.onUpdate(id, updates)
    │
    ▼
page.tsx handleUpdateLead()
    │
    └─── PATCH /api/pipeline/[id]
         │
         ▼
Twenty CRM updates Person
         │
         ▼
UI updates (optimistic)
```

### 5. Filter & Sort Flow

```
User changes filter/sort options
    │
    ▼
State update: setFilter() or setSortField()
    │
    ▼
useMemo recalculates filtered/sorted leads
    │
    ├─── Apply search filter
    ├─── Apply businessLine filter
    ├─── Apply assignedTo filter
    │
    └─── Apply sorting
         │
         ▼
groupByStage() recalculates
    │
    ▼
KanbanColumns re-render with new lead lists
```

## State Management

### Page Level State (page.tsx)

```typescript
const [leads, setLeads] = useState<Lead[]>([]);        // All leads from API
const [isLoading, setIsLoading] = useState(true);      // Loading state
const [error, setError] = useState<string | null>(null); // Error state
```

### Board Level State (KanbanBoard.tsx)

```typescript
const [activeId, setActiveId] = useState<string | null>(null);     // Currently dragging
const [selectedLead, setSelectedLead] = useState<Lead | null>(null); // For modal
const [filter, setFilter] = useState<PipelineFilter>({});          // Filters
const [sortField, setSortField] = useState<SortOption>('createdAt'); // Sort field
const [sortDirection, setSortDirection] = useState<SortDirection>('desc'); // Sort direction
```

### Computed State (useMemo)

```typescript
// Filtered and sorted leads
const filteredAndSortedLeads = useMemo(() => {
  // Apply filters and sorting
}, [leads, filter, sortField, sortDirection]);

// Grouped by stage
const leadsByStage = useMemo(() => {
  // Group leads by pipeline stage
}, [filteredAndSortedLeads]);
```

## API Request/Response Formats

### GET /api/pipeline

Request:
```
GET /api/pipeline?businessLine=Enterprise&assignedTo=김영업
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "lead-123",
      "firstName": "홍",
      "lastName": "길동",
      "email": "hong@example.com",
      "stage": "new",
      "amount": 10000000,
      ...
    }
  ],
  "count": 42
}
```

### POST /api/pipeline

Request:
```json
{
  "firstName": "홍",
  "lastName": "길동",
  "email": "hong@example.com",
  "phone": "010-1234-5678",
  "jobTitle": "CEO"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "lead-456",
    "firstName": "홍",
    "lastName": "길동",
    ...
  }
}
```

### PATCH /api/pipeline/[id]

Request:
```json
{
  "stage": "contacted",
  "notes": "첫 연락 완료",
  "amount": 15000000
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "lead-123",
    "stage": "contacted",
    ...
  }
}
```

## Performance Considerations

### 1. Memoization

```typescript
// Filter and sort only when dependencies change
const filteredAndSortedLeads = useMemo(() => {
  // Expensive filtering and sorting
}, [leads, filter, sortField, sortDirection]);

// Group by stage only when filtered leads change
const leadsByStage = useMemo(() => {
  // Grouping logic
}, [filteredAndSortedLeads]);
```

### 2. Optimistic Updates

```typescript
// Update UI immediately
setLeads(prevLeads =>
  prevLeads.map(lead =>
    lead.id === id ? { ...lead, ...updates } : lead
  )
);

// Then sync with API
await fetch(`/api/pipeline/${id}`, {
  method: 'PATCH',
  body: JSON.stringify(updates)
});
```

### 3. Drag Constraint

```typescript
useSensor(PointerSensor, {
  activationConstraint: {
    distance: 8  // Prevent accidental drags
  }
});
```

## Error Handling

### Client Side

```typescript
try {
  const response = await fetch('/api/pipeline');
  const result = await response.json();

  if (!result.success) {
    setError(result.error);
  }
} catch (err) {
  setError(err.message);
  // Show error UI
}
```

### Server Side

```typescript
try {
  const data = await twenty.listPeople();
  return NextResponse.json({ success: true, data });
} catch (error) {
  return NextResponse.json(
    { success: false, error: error.message },
    { status: 500 }
  );
}
```

## Security Considerations

1. **API Key Protection**: Twenty API key stored in environment variables
2. **Server-Side Only**: API calls made from Next.js API routes (server-side)
3. **Input Validation**: All user inputs should be validated (TODO: add Zod validation)
4. **CORS**: API routes protected by Next.js default CORS policy
5. **Authentication**: TODO: Add user authentication before production

## Scalability

### Current Limitations

- Fetches all leads at once (1000 limit)
- Client-side filtering and sorting
- No pagination

### Future Improvements

1. **Pagination**: Virtual scrolling for large datasets
2. **Server-side Filtering**: Move filtering to API level
3. **Caching**: Implement React Query for data caching
4. **Real-time Updates**: WebSocket for live collaboration
5. **Lazy Loading**: Load leads on-demand per stage

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| UI Framework | React 19 | Component rendering |
| Meta Framework | Next.js 15 | Full-stack framework |
| Type Safety | TypeScript 5.7 | Static typing |
| Drag & Drop | @dnd-kit | DnD functionality |
| Styling | Tailwind CSS | Utility-first CSS |
| API | Next.js API Routes | Backend endpoints |
| CRM Integration | Twenty SDK | CRM operations |
| Data Protocol | GraphQL | API communication |

## Monitoring & Debugging

### Console Logs

```typescript
// Success logs
console.log('Leads fetched:', leads.length);

// Error logs
console.error('Failed to update lead:', error);
```

### React DevTools

- Inspect component props
- Check state values
- View component hierarchy

### Network Tab

- Monitor API requests
- Check response times
- Debug failed requests

## Testing Strategy (Recommended)

### Unit Tests

```typescript
// Test individual components
describe('LeadCard', () => {
  it('displays lead information correctly', () => {
    // Test implementation
  });
});
```

### Integration Tests

```typescript
// Test component interactions
describe('KanbanBoard', () => {
  it('moves lead between stages on drag', () => {
    // Test implementation
  });
});
```

### E2E Tests

```typescript
// Test full user flows
describe('Pipeline', () => {
  it('creates and moves a lead through pipeline', () => {
    // Test implementation
  });
});
```

## Deployment Checklist

- [ ] Set environment variables (TWENTY_API_KEY)
- [ ] Test Twenty CRM connection
- [ ] Run production build
- [ ] Test all CRUD operations
- [ ] Verify drag & drop works
- [ ] Check mobile responsiveness
- [ ] Monitor performance
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure logging
- [ ] Set up backup strategy

## Conclusion

이 아키텍처는 확장 가능하고 유지보수가 쉬운 리드 파이프라인 시스템을 제공합니다. Twenty CRM과의 완전한 통합, 직관적인 드래그 앤 드롭 인터페이스, 그리고 포괄적인 데이터 관리 기능을 갖추고 있습니다.
