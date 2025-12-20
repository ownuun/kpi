# UTM Link Generator - System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (Client)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   Page: /tools/utm-builder                │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │    UtmBuilder (Form Component)                       │ │ │
│  │  │    ├─ React Hook Form + Zod Validation             │ │ │
│  │  │    ├─ State: baseUrl, source, medium, campaign     │ │ │
│  │  │    ├─ Autocomplete dropdowns (15 sources)          │ │ │
│  │  │    ├─ Real-time URL generation                     │ │ │
│  │  │    └─ Submit → Calls API                           │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │    UtmPreview (Display Component)                   │ │ │
│  │  │    ├─ Shows generated URL                           │ │ │
│  │  │    ├─ Parameter breakdown table                     │ │ │
│  │  │    ├─ Copy to clipboard button                      │ │ │
│  │  │    ├─ URL length indicator                          │ │ │
│  │  │    └─ Test & download buttons                       │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │    QrCodeGenerator (QR Component)                   │ │ │
│  │  │    ├─ Dynamic qrcode lib import                     │ │ │
│  │  │    ├─ Canvas rendering (300x300px)                 │ │ │
│  │  │    ├─ Error correction: Level H                     │ │ │
│  │  │    ├─ Download PNG button                           │ │ │
│  │  │    └─ Copy to clipboard                             │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │    UtmHistory (Sidebar Component)                   │ │ │
│  │  │    ├─ localStorage: utm_history                     │ │ │
│  │  │    ├─ Stores last 20 URLs                           │ │ │
│  │  │    ├─ Quick actions (copy, test, delete)            │ │ │
│  │  │    ├─ Export as CSV                                 │ │ │
│  │  │    └─ Clear history                                 │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  localStorage                     Clipboard API                  │
│  ├─ utm_history (20 items)   └─ Copy on button click           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                  ↕ (fetch)
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Server)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Page Route: /app/tools/utm-builder/page.tsx             │ │
│  │  ├─ getMetadata: Set page title & description            │ │
│  │  ├─ getPlatforms: Query active platforms from DB         │ │
│  │  ├─ Pass platforms to UtmBuilder component               │ │
│  │  └─ Render educational footer                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  API: POST /api/utm/generate                             │ │
│  │  ├─ Input: baseUrl, source, medium, campaign, etc.      │ │
│  │  ├─ Validation: Zod schema                               │ │
│  │  ├─ Process: Build URL with URLSearchParams              │ │
│  │  ├─ Response: url, parameters, metadata                  │ │
│  │  └─ Error: Validation or server errors                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  API: POST /api/utm/track                                │ │
│  │  ├─ Input: pageUrl, utm params, visitorId, etc.         │ │
│  │  ├─ Validation: Zod schema                               │ │
│  │  ├─ Process: Save to LandingVisit table                  │ │
│  │  ├─ Response: visitId, success message                   │ │
│  │  └─ Error: Validation or database errors                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  API: GET /api/utm/track                                 │ │
│  │  ├─ Query: campaign, source, limit                       │ │
│  │  ├─ Process: Query LandingVisit with filters             │ │
│  │  ├─ Response: Array of visits with metadata              │ │
│  │  └─ Error: Database or validation errors                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Validation Schema: lib/validations/utm.ts               │ │
│  │  ├─ utmFormSchema: Zod validation rules                  │ │
│  │  ├─ UTM_SOURCES: 15 predefined options                   │ │
│  │  ├─ UTM_MEDIUMS: 13 predefined options                   │ │
│  │  └─ CAMPAIGN_TYPES: 9 predefined options                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                  ↕
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (Prisma)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Platform Table                                           │ │
│  │  ├─ id: string (primary key)                             │ │
│  │  ├─ name: string (LinkedIn, Facebook, etc.)              │ │
│  │  ├─ type: string (social, email, ads)                    │ │
│  │  ├─ isActive: boolean                                     │ │
│  │  └─ businessLineId: foreign key                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  LandingVisit Table                                       │ │
│  │  ├─ id: string (primary key)                             │ │
│  │  ├─ pageUrl: string                                      │ │
│  │  ├─ utmSource: string (linkedin, facebook, etc.)         │ │
│  │  ├─ utmMedium: string (social, email, cpc, etc.)         │ │
│  │  ├─ utmCampaign: string (spring_sale, etc.)              │ │
│  │  ├─ utmTerm: string (optional keyword)                   │ │
│  │  ├─ utmContent: string (optional ad variant)             │ │
│  │  ├─ visitorId: string (cookie-based visitor ID)          │ │
│  │  ├─ platformId: foreign key                              │ │
│  │  ├─ leadId: foreign key                                  │ │
│  │  ├─ converted: boolean (conversion flag)                 │ │
│  │  ├─ createdAt, updatedAt: timestamps                     │ │
│  │  └─ Indexes: utmSource, utmCampaign, createdAt           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Flow 1: URL Generation (Client-Side)
```
User Input in Form
    ↓
React Hook Form
    ↓
Zod Validation
    ↓
Valid? Yes
    ↓
useEffect watches form changes
    ↓
generateUrl() function
    ↓
URLSearchParams builds query string
    ↓
URL displayed in UtmPreview
    ↓
LocalStorage saves to history
```

### Flow 2: User Actions
```
User Action
    ├─ Click "Copy URL"
    │  └─ navigator.clipboard.writeText()
    │     └─ Visual feedback (button changes color)
    │
    ├─ Click "Generate QR Code"
    │  └─ Dynamic import qrcode library
    │     └─ QRCode.toCanvas() renders to <canvas>
    │        └─ User can download or copy
    │
    ├─ Click "Test Link"
    │  └─ window.open(url, '_blank')
    │
    ├─ Click "Download URL"
    │  └─ Create blob and trigger download
    │
    └─ Click "Export History"
       └─ Convert history array to CSV
          └─ Create download link
```

### Flow 3: Database Tracking (Optional)
```
URL Generated on Client
    ↓
User (Optional) Calls POST /api/utm/track
    ↓
Backend validates with Zod
    ↓
Valid? Yes
    ↓
prisma.landingVisit.create()
    ↓
Data saved to LandingVisit table
    ↓
Return visitId and success message
```

### Flow 4: Analytics Retrieval
```
User/App requests GET /api/utm/track?campaign=spring_sale
    ↓
Backend extracts query parameters
    ↓
prisma.landingVisit.findMany() with filters
    ↓
Query Database
    ↓
Return matching visits with metadata
    ↓
Client displays data in analytics dashboard (future)
```

---

## Component Hierarchy

```
/tools/utm-builder/page.tsx (Server Component)
│
├─ Header Section
│  └─ Title + Navigation
│
├─ Info Cards (4 cards explaining UTM parameters)
│
├─ UtmBuilder Component (Client)
│  │
│  ├─ State Management (React Hook Form)
│  │  ├─ baseUrl
│  │  ├─ source
│  │  ├─ medium
│  │  ├─ campaign
│  │  ├─ term
│  │  ├─ content
│  │  └─ businessLine
│  │
│  ├─ Form Section (Left)
│  │  ├─ BaseUrl Input
│  │  ├─ Source Dropdown (autocomplete)
│  │  ├─ Medium Dropdown (autocomplete)
│  │  ├─ Campaign Dropdown (autocomplete)
│  │  ├─ Optional Parameters Section
│  │  │  ├─ Term Input
│  │  │  └─ Content Input
│  │  └─ Business Line Dropdown
│  │
│  ├─ UtmPreview Component (Right Top)
│  │  ├─ Copy Button
│  │  ├─ URL Display
│  │  ├─ Parameters Table
│  │  └─ Quick Actions
│  │
│  ├─ QrCodeGenerator Component (Right Middle)
│  │  ├─ Toggle Button
│  │  ├─ Canvas (hidden by default)
│  │  ├─ Download Button
│  │  └─ Copy Button
│  │
│  └─ UtmHistory Component (Right Sidebar)
│     ├─ Expandable Header
│     ├─ History Items List
│     │  └─ Each Item
│     │     ├─ Timestamp
│     │     ├─ URL
│     │     ├─ Parameters (source, medium, campaign)
│     │     └─ Actions (copy, test, delete)
│     ├─ Bulk Actions
│     │  ├─ Export CSV
│     │  └─ Clear All
│     └─ Summary Stats
│
└─ Footer Section
   ├─ Best Practices
   ├─ Example Usage
   └─ Resources
```

---

## State Management

### UtmBuilder Component State
```typescript
// Form State (React Hook Form)
formValues = {
  baseUrl: string
  source: string
  medium: string
  campaign: string
  term?: string
  content?: string
  businessLine?: string
}

// UI State
generatedUrl: string
showQrCode: boolean
searchSource: string
searchMedium: string
searchCampaign: string
showSourceDropdown: boolean
showMediumDropdown: boolean
showCampaignDropdown: boolean
```

### UtmHistory Component State
```typescript
// Storage State
history: HistoryItem[] = [
  {
    id: string
    url: string
    source: string
    medium: string
    campaign: string
    createdAt: Date
  }
]

// UI State
isExpanded: boolean
```

### Browser Storage
```
localStorage.utm_history = JSON.stringify([
  {
    id: "1734567890123",
    url: "https://example.com?utm_source=...",
    source: "linkedin",
    medium: "social",
    campaign: "spring_sale",
    createdAt: "2024-12-18T10:30:00Z"
  }
])
```

---

## Validation Flow

```
User Input
    ↓
React Hook Form captures value
    ↓
Controller component passes to input
    ↓
useWatch tracks changes
    ↓
Real-time validation with Zod schema:
│
├─ baseUrl
│  └─ Must be valid URL
│     └─ z.string().url()
│
├─ source
│  └─ Must not be empty
│     └─ z.string().min(1)
│
├─ medium
│  └─ Must not be empty
│     └─ z.string().min(1)
│
└─ campaign
   └─ Must not be empty
      └─ z.string().min(1)
│
└─ Errors displayed below each field
```

---

## API Request/Response Cycles

### Generate Endpoint
```
Client → POST /api/utm/generate
{
  baseUrl: "https://example.com",
  source: "linkedin",
  medium: "social",
  campaign: "spring_sale",
  term: "marketing",
  content: "banner_top"
}
    ↓
Backend: Validate with utmGenerateSchema
    ↓
Backend: Build URLSearchParams
    ↓
Backend: Create URL object
    ↓
Server ← 200 OK
{
  success: true,
  url: "https://example.com?utm_source=linkedin&...",
  parameters: { utm_source, utm_medium, utm_campaign, utm_term, utm_content },
  metadata: { urlLength: 145, generatedAt: "2024-12-18T10:30:00Z" }
}
    ↓
Client: Update generatedUrl state
```

### Track Endpoint
```
Client → POST /api/utm/track
{
  pageUrl: "https://example.com",
  utmSource: "linkedin",
  utmMedium: "social",
  utmCampaign: "spring_sale",
  platformId: "platform_123"
}
    ↓
Backend: Validate with utmTrackingSchema
    ↓
Backend: Call prisma.landingVisit.create()
    ↓
Database: Insert record into LandingVisit table
    ↓
Server ← 201 Created
{
  success: true,
  visitId: "visit_123",
  message: "UTM tracking data saved successfully"
}
    ↓
Client: Confirm save successful
```

---

## Responsive Layout

### Desktop (lg: 1024px+)
```
┌─────────────────────────────────────────────────────┐
│  Header (full width)                                │
├───────────────────────────┬─────────────────────────┤
│                           │                         │
│  Form Section             │  Preview & History      │
│  (33% width)              │  (67% width)            │
│                           │                         │
│  - Base URL               │  URL Preview            │
│  - Source                 │  QR Code                │
│  - Medium                 │  History Sidebar        │
│  - Campaign               │                         │
│  - Optional Params        │                         │
│                           │                         │
└───────────────────────────┴─────────────────────────┘
│  Footer (full width)                                │
└─────────────────────────────────────────────────────┘
```

### Tablet (md: 768px - 1023px)
```
┌──────────────────────────────────┐
│  Header (full width)             │
├──────────────────────────────────┤
│                                  │
│  Form Section (full width)       │
│  - Base URL                      │
│  - Source, Medium, Campaign      │
│  - Optional Params               │
│                                  │
├──────────────────────────────────┤
│                                  │
│  Preview (full width)            │
│  URL Preview & QR Code           │
│                                  │
├──────────────────────────────────┤
│                                  │
│  History (full width)            │
│  Generated URLs                  │
│                                  │
├──────────────────────────────────┤
│  Footer (full width)             │
└──────────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────┐
│  Header      │
├──────────────┤
│              │
│  Form        │
│  (full)      │
│              │
├──────────────┤
│              │
│  Preview     │
│  (full)      │
│              │
├──────────────┤
│              │
│  QR Code     │
│  (full)      │
│              │
├──────────────┤
│              │
│  History     │
│  (full)      │
│              │
├──────────────┤
│  Footer      │
└──────────────┘
```

---

## Error Handling

### Client-Side Errors
```
Validation Error
    ↓
Zod catches schema violation
    ↓
formState.errors populated
    ↓
Error message displayed below field
    └─ Example: "Invalid email address"
```

### API Errors
```
API Request → Error
    ↓
Try-Catch block catches error
    ↓
Response Code:
├─ 400: Validation failed → Show validation details
├─ 500: Server error → Show generic error message
└─ Other: Show error with details
    ↓
Error displayed in UI
```

### User Feedback
```
Success
└─ Copy to Clipboard → Button changes color to green
└─ API Save → Toast/alert message

Error
└─ Validation → Red text below field
└─ API Error → Error box at top of form
└─ QR Generation → Error message in QR section
```

---

## Performance Optimizations

1. **Lazy Loading**: QRCode library imported only when needed
2. **memoization**: Components wrapped with React.memo where appropriate
3. **Debouncing**: Dropdown search debounced to prevent excessive re-renders
4. **localStorage**: History limited to 20 items to prevent storage bloat
5. **URL Generation**: Client-side processing to reduce server load
6. **API Validation**: Zod schema prevents invalid data reaching database

---

## Security Considerations

1. **No sensitive data in UTM params**: Guidelines warn against passwords/tokens
2. **Input Validation**: Zod schemas validate all inputs
3. **URL Encoding**: URLSearchParams automatically encodes special characters
4. **XSS Prevention**: React escapes all rendered content
5. **localStorage**: Only stores non-sensitive history data
6. **API Routes**: Basic validation on backend prevents malformed data

---

## Future Extensibility

```
Current Architecture supports:
├─ Adding new UTM sources (edit validations/utm.ts)
├─ Custom validation rules (modify Zod schema)
├─ Database logging (existing LandingVisit model ready)
├─ Analytics queries (API endpoints support filters)
├─ URL shortening (new API endpoint)
├─ Bulk generation (new component/API)
├─ Team sharing (new database model)
└─ Analytics dashboard (new page using api/utm/track GET)
```

---

This architecture provides a scalable, maintainable foundation for the UTM Link Generator with clear separation of concerns and extensibility for future features.
