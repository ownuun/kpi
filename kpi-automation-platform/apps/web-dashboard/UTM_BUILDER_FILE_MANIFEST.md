# UTM Link Generator - File Manifest

## Complete File List & Descriptions

### Core Components (4 files)

#### 1. UtmBuilder.tsx
**Path**: `components/utm/UtmBuilder.tsx`
**Size**: ~450 lines
**Type**: Client Component (React + TypeScript)

**Purpose**: Main builder component with form and state management

**Key Exports**:
- `UtmBuilder`: Main component (receives platforms prop)

**Responsibilities**:
- Form rendering with React Hook Form
- Zod schema validation
- Autocomplete dropdowns (source, medium, campaign)
- Real-time URL generation
- Search/filter functionality
- Component composition (UtmPreview, UtmHistory, QrCodeGenerator)

**Dependencies**:
- react-hook-form
- @hookform/resolvers/zod
- zod
- Custom validation schema from lib/validations/utm
- Sub-components (UtmPreview, UtmHistory, QrCodeGenerator)

---

#### 2. UtmPreview.tsx
**Path**: `components/utm/UtmPreview.tsx`
**Size**: ~120 lines
**Type**: Client Component (React + TypeScript)

**Purpose**: Display generated URLs and provide quick actions

**Key Features**:
- Full URL display in code block
- Parameter breakdown table
- Copy to clipboard with feedback
- URL length indicator with warnings
- Test link button
- Download as text file

**Dependencies**:
- React (useState for copy feedback)
- Browser Clipboard API

---

#### 3. QrCodeGenerator.tsx
**Path**: `components/utm/QrCodeGenerator.tsx`
**Size**: ~160 lines
**Type**: Client Component (React + TypeScript)

**Purpose**: Generate, display, and manage QR codes

**Key Features**:
- Dynamic qrcode library import
- Canvas-based rendering (300x300px)
- Error correction level H
- PNG format output
- Download QR code as image
- Copy to clipboard
- Metadata display
- Loading/error states

**Dependencies**:
- qrcode (dynamic import)
- React (useRef, useEffect, useState)

**Note**: Gracefully handles missing library with helpful error message

---

#### 4. UtmHistory.tsx
**Path**: `components/utm/UtmHistory.tsx`
**Size**: ~250 lines
**Type**: Client Component (React + TypeScript)

**Purpose**: Track and manage previously generated URLs

**Key Features**:
- Browser localStorage persistence
- Maintains last 20 URLs
- Quick actions (copy, test, delete)
- Export as CSV
- Clear all history
- Summary statistics
- Expandable/collapsible UI
- Timestamp tracking

**Dependencies**:
- React (useState, useEffect)
- Browser localStorage API

**Data Structure**:
```typescript
interface HistoryItem {
  id: string
  url: string
  source: string
  medium: string
  campaign: string
  createdAt: Date
}
```

---

### Validation & Configuration (1 file)

#### 5. lib/validations/utm.ts
**Path**: `lib/validations/utm.ts`
**Size**: ~90 lines
**Type**: Utility/Schema (TypeScript)

**Purpose**: Centralized validation schema and option definitions

**Key Exports**:
- `utmFormSchema`: Zod validation schema
- `UtmFormData`: TypeScript type for form data
- `UTM_SOURCES`: Array of 15 source options
- `UTM_MEDIUMS`: Array of 13 medium options
- `CAMPAIGN_TYPES`: Array of 9 campaign types

**UTM Sources** (15 options):
```
linkedin, facebook, instagram, twitter
google, email, website, referral
direct, organic, paid_search, display
affiliate, partner, event, newsletter
```

**UTM Mediums** (13 options):
```
social, email, cpc, organic, paid
referral, display, video, affiliate
native, podcast, webinar, event
```

**Campaign Types** (9 options):
```
spring_sale, summer_promotion, product_launch
holiday_campaign, webinar, event
awareness, lead_generation, retargeting, app_install
```

---

### Page Route (1 file)

#### 6. app/tools/utm-builder/page.tsx
**Path**: `app/tools/utm-builder/page.tsx`
**Size**: ~150 lines
**Type**: Server Component (Next.js + TypeScript)

**Purpose**: Main page for UTM builder tool

**Key Functions**:
- `getPlatforms()`: Async function to fetch active platforms from database
- `metadata`: Exports page metadata
- Default export: Page component

**Responsibilities**:
- Server-side data fetching (Prisma query)
- Navigation and header
- Info cards (explaining UTM parameters)
- Component composition (UtmBuilder)
- Educational footer content
- Responsive layout

**Database Queries**:
- Fetches active platforms from `Platform` table
- Returns: id, name (ordered by name)

---

### API Routes (2 files)

#### 7. app/api/utm/generate/route.ts
**Path**: `app/api/utm/generate/route.ts`
**Size**: ~90 lines
**Type**: API Route (Next.js + TypeScript)

**Endpoint**: `POST /api/utm/generate`

**Purpose**: Generate UTM links with validation

**Input Schema**:
```typescript
{
  baseUrl: string (URL)
  source: string (required)
  medium: string (required)
  campaign: string (required)
  term?: string (optional)
  content?: string (optional)
  businessLineId?: string (optional)
  platformId?: string (optional)
}
```

**Response Format**:
```typescript
{
  success: boolean
  url: string
  parameters: {
    utm_source: string
    utm_medium: string
    utm_campaign: string
    utm_term?: string
    utm_content?: string
  }
  metadata: {
    urlLength: number
    generatedAt: string (ISO timestamp)
  }
}
```

**Error Responses**:
- 400: Validation errors (Zod failures)
- 500: Server errors

---

#### 8. app/api/utm/track/route.ts
**Path**: `app/api/utm/track/route.ts`
**Size**: ~130 lines
**Type**: API Route (Next.js + TypeScript)

**Endpoints**: `POST /api/utm/track` and `GET /api/utm/track`

**POST - Save UTM Visit**:
- Saves visitor data to LandingVisit database table
- Returns: visitId, success message

**GET - Retrieve UTM Data**:
- Query parameters: campaign, source, limit
- Returns: Array of LandingVisit records with metadata
- Supports filtering and pagination

**Input Schema (POST)**:
```typescript
{
  pageUrl: string (URL)
  visitorId?: string
  ipAddress?: string
  userAgent?: string
  referrerUrl?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  platformId?: string
  leadId?: string
}
```

**Response Format (POST)**:
```typescript
{
  success: boolean
  visitId: string
  message: string
}
```

---

### Configuration (1 file - modified)

#### 9. package.json
**Path**: `apps/web-dashboard/package.json`
**Changes**:
- Added: `"qrcode": "^1.5.3"` to dependencies
- Added: `"@types/qrcode": "^1.5.2"` to devDependencies

---

### Documentation (4 files)

#### 10. UTM_BUILDER_README.md
**Path**: `apps/web-dashboard/UTM_BUILDER_README.md`
**Size**: ~600 lines
**Type**: Documentation (Markdown)

**Contents**:
- Overview and file structure
- Component breakdown with features
- UTM parameters reference
- Pre-configured options list
- API endpoint documentation
- Database integration details
- Installation & setup instructions
- Usage guide (for users and developers)
- Best practices
- Troubleshooting section
- Performance considerations
- Security notes
- Future enhancement ideas

**Audience**: Developers, technical leads

---

#### 11. UTM_BUILDER_QUICK_START.md
**Path**: `apps/web-dashboard/UTM_BUILDER_QUICK_START.md`
**Size**: ~170 lines
**Type**: Documentation (Markdown)

**Contents**:
- 30-second setup instructions
- Step-by-step usage guide
- Generated URL example
- Features at a glance
- File structure
- Common use cases (with examples)
- Database integration overview
- Keyboard shortcuts
- Troubleshooting (quick fixes)
- Best practices (DO/DON'T)
- API usage examples
- Next steps
- Resources

**Audience**: New users, marketers, developers

---

#### 12. UTM_BUILDER_SUMMARY.md
**Path**: `apps/web-dashboard/UTM_BUILDER_SUMMARY.md`
**Size**: ~400 lines
**Type**: Documentation (Markdown)

**Contents**:
- Project completion status (100%)
- Generated files & structure
- Component breakdown with UI mockups
- Validation & schema details
- API routes documentation
- Database integration
- Dependencies added
- How to use instructions
- Customization guide
- Key features summary
- File paths (absolute)
- Testing checklist
- Next steps for enhancements

**Audience**: Project managers, developers, stakeholders

---

#### 13. UTM_BUILDER_ARCHITECTURE.md
**Path**: `apps/web-dashboard/UTM_BUILDER_ARCHITECTURE.md`
**Size**: ~600 lines
**Type**: Documentation (Markdown)

**Contents**:
- High-level system overview diagram
- Data flow diagrams
- Component hierarchy
- State management details
- Validation flow
- API request/response cycles
- Responsive layout diagrams
- Error handling strategy
- Performance optimizations
- Security considerations
- Future extensibility roadmap

**Audience**: Architects, senior developers, technical designers

---

## Summary Statistics

### Files Created
```
Total Files: 13
├─ Components: 4 (tsx)
├─ API Routes: 2 (ts)
├─ Page Routes: 1 (tsx)
├─ Validation/Config: 1 (ts)
├─ Modified: 1 (package.json)
└─ Documentation: 4 (md)
```

### Code Statistics
```
TypeScript/TSX: ~1,300 lines
Documentation: ~1,900 lines
Total: ~3,200 lines
```

### Component Sizes
```
UtmBuilder.tsx: 450 lines
UtmHistory.tsx: 250 lines
QrCodeGenerator.tsx: 160 lines
UtmPreview.tsx: 120 lines
lib/validations/utm.ts: 90 lines
app/tools/utm-builder/page.tsx: 150 lines
app/api/utm/generate/route.ts: 90 lines
app/api/utm/track/route.ts: 130 lines
```

### Documentation Sizes
```
UTM_BUILDER_ARCHITECTURE.md: 600 lines
UTM_BUILDER_README.md: 600 lines
UTM_BUILDER_SUMMARY.md: 400 lines
UTM_BUILDER_QUICK_START.md: 170 lines
UTM_BUILDER_FILE_MANIFEST.md: (this file)
```

## File Dependencies Graph

```
page.tsx (Page Route)
├─ UtmBuilder.tsx (Component)
│  ├─ UtmPreview.tsx (Component)
│  ├─ QrCodeGenerator.tsx (Component)
│  ├─ UtmHistory.tsx (Component)
│  ├─ react-hook-form
│  ├─ zod
│  └─ lib/validations/utm.ts
│
├─ lib/prisma.ts (Database client)
│  └─ @kpi/database (Prisma client)
│
└─ lib/validations/utm.ts (Validation schema)

API Routes
├─ app/api/utm/generate/route.ts
│  ├─ zod (validation)
│  └─ lib/validations/utm.ts
│
└─ app/api/utm/track/route.ts
   ├─ zod (validation)
   ├─ lib/prisma.ts
   └─ Database models (LandingVisit, Platform)

Dependencies (package.json)
├─ qrcode: ^1.5.3
├─ @types/qrcode: ^1.5.2
├─ react-hook-form: ^7.54.2
├─ @hookform/resolvers: ^3.9.1
├─ zod: ^3.24.1
└─ (other existing dependencies)
```

## Installation Checklist

- [ ] All 13 files created in correct locations
- [ ] package.json updated with qrcode and @types/qrcode
- [ ] All imports resolved (no missing dependencies)
- [ ] TypeScript types all defined
- [ ] Prisma schema includes LandingVisit model fields
- [ ] Database URL environment variable set
- [ ] Run `npm install` to install qrcode dependency
- [ ] Run `npm run dev` to start development server
- [ ] Navigate to `/tools/utm-builder` to test

## File Access URLs

Once deployed:
- **Page Route**: `http://localhost:3000/tools/utm-builder`
- **API Generate**: `POST http://localhost:3000/api/utm/generate`
- **API Track**: `POST/GET http://localhost:3000/api/utm/track`

## Next Steps

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Test the application at `/tools/utm-builder`
4. Deploy to production
5. Integrate with Google Analytics
6. Create team documentation
7. Plan future enhancements

---

**Manifest Version**: 1.0
**Created**: December 18, 2024
**Status**: Complete
