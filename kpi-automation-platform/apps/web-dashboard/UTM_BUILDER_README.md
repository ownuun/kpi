# UTM Link Generator - Complete Implementation Guide

## Overview

The UTM Link Generator is a comprehensive marketing tool for creating trackable URLs with UTM parameters. It enables marketers to track campaign performance across multiple channels and platforms.

## File Structure

```
apps/web-dashboard/
├── app/
│   ├── tools/
│   │   └── utm-builder/
│   │       └── page.tsx                 # Main UTM builder page
│   └── api/
│       └── utm/
│           ├── generate/route.ts        # Generate UTM links API
│           └── track/route.ts           # Track UTM visits API
├── components/
│   └── utm/
│       ├── UtmBuilder.tsx               # Main builder component
│       ├── UtmPreview.tsx               # URL preview and copy
│       ├── UtmHistory.tsx               # Generate history (localStorage)
│       └── QrCodeGenerator.tsx          # QR code generation
└── lib/
    └── validations/
        └── utm.ts                       # Zod validation schemas
```

## Components Breakdown

### 1. **UtmBuilder.tsx** (Main Component)
**Purpose**: Main form for building UTM links with validation and real-time URL generation.

**Features**:
- Form validation using React Hook Form + Zod
- Autocomplete dropdowns for source, medium, and campaign
- Real-time URL generation
- Optional parameters (term, content)
- Platform/business line selection (if available)

**Key Props**:
```typescript
interface UtmBuilderProps {
  platforms?: Array<{ id: string; name: string }>
}
```

**Form Fields**:
- **baseUrl** (Required): The landing page URL
- **source** (Required): UTM source (linkedin, facebook, google, etc.)
- **medium** (Required): UTM medium (social, email, cpc, etc.)
- **campaign** (Required): Campaign name
- **term** (Optional): Keyword for paid search
- **content** (Optional): Ad variant identifier
- **businessLine** (Optional): Platform association

### 2. **UtmPreview.tsx** (Preview & Copy Component)
**Purpose**: Display generated URLs with parameter breakdown and quick actions.

**Features**:
- Display full URL
- Show parameter breakdown in organized table
- One-click copy to clipboard
- URL length indicator
- Test link button (opens in new tab)
- Download URL as text file

### 3. **QrCodeGenerator.tsx** (QR Code Component)
**Purpose**: Generate and manage QR codes for UTM links.

**Features**:
- Uses `qrcode` library for generation
- Canvas-based rendering
- Download as PNG
- Copy to clipboard
- Error handling with helpful messages
- Shows QR code metadata (size, error correction level)

**Note**: Requires `qrcode` package to be installed

### 4. **UtmHistory.tsx** (History Component)
**Purpose**: Track and manage previously generated URLs.

**Features**:
- Stores history in browser's localStorage
- Keeps last 20 generated URLs
- Quick copy and test buttons
- Export history as CSV
- Clear all history
- Shows generation timestamps

**Storage Structure** (localStorage key: `utm_history`):
```typescript
interface HistoryItem {
  id: string              // Unique ID (timestamp)
  url: string             // Full URL
  source: string          // UTM source
  medium: string          // UTM medium
  campaign: string        // UTM campaign
  createdAt: Date         // Generation timestamp
}
```

## UTM Parameters Reference

### Required Parameters

| Parameter | Example | Purpose |
|-----------|---------|---------|
| **utm_source** | linkedin, facebook, google | Identify the traffic source |
| **utm_medium** | social, email, cpc | Identify the marketing medium |
| **utm_campaign** | spring_sale, product_launch | Group related campaigns |

### Optional Parameters

| Parameter | Example | Purpose |
|-----------|---------|---------|
| **utm_term** | marketing automation | Identify paid keywords |
| **utm_content** | banner_top, text_link | Differentiate ad variants |

### Example Generated URL
```
https://example.com/page?utm_source=linkedin&utm_medium=social&utm_campaign=spring_sale&utm_term=marketing&utm_content=banner_top
```

## Pre-configured Options

### UTM Sources (utm.ts)
```typescript
- linkedin, facebook, instagram, twitter
- google, email, website, referral
- direct, organic, paid_search, display
- affiliate, partner, event, newsletter
```

### UTM Mediums (utm.ts)
```typescript
- social, email, cpc, organic, paid
- referral, display, video, affiliate
- native, podcast, webinar, event
```

### Campaign Types (utm.ts)
```typescript
- spring_sale, summer_promotion, product_launch
- holiday_campaign, webinar, event
- awareness, lead_generation, retargeting, app_install
```

## API Endpoints

### POST `/api/utm/generate`
Generate a UTM link with validation.

**Request**:
```json
{
  "baseUrl": "https://example.com",
  "source": "linkedin",
  "medium": "social",
  "campaign": "spring_sale",
  "term": "marketing",
  "content": "banner_top",
  "platformId": "platform_id_123" // Optional
}
```

**Response**:
```json
{
  "success": true,
  "url": "https://example.com?utm_source=linkedin&utm_medium=social&utm_campaign=spring_sale&utm_term=marketing&utm_content=banner_top",
  "parameters": {
    "utm_source": "linkedin",
    "utm_medium": "social",
    "utm_campaign": "spring_sale",
    "utm_term": "marketing",
    "utm_content": "banner_top"
  },
  "metadata": {
    "urlLength": 145,
    "generatedAt": "2024-12-18T10:30:00Z"
  }
}
```

### POST `/api/utm/track`
Save UTM visit data to database (LandingVisit model).

**Request**:
```json
{
  "pageUrl": "https://example.com",
  "visitorId": "visitor_123",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "referrerUrl": "https://linkedin.com",
  "utmSource": "linkedin",
  "utmMedium": "social",
  "utmCampaign": "spring_sale",
  "utmTerm": "marketing",
  "utmContent": "banner_top",
  "platformId": "platform_123",
  "leadId": "lead_123" // Optional
}
```

**Response**:
```json
{
  "success": true,
  "visitId": "visit_123",
  "message": "UTM tracking data saved successfully"
}
```

### GET `/api/utm/track`
Retrieve UTM tracking data with optional filters.

**Query Parameters**:
- `campaign`: Filter by campaign name
- `source`: Filter by UTM source
- `limit`: Number of results (default: 50)

**Example**: `/api/utm/track?campaign=spring_sale&source=linkedin&limit=100`

## Database Integration

### LandingVisit Model (Prisma)
The generated UTM data is saved to the `LandingVisit` model:

```typescript
model LandingVisit {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Visitor Info
  visitorId  String?
  ipAddress  String?
  userAgent  String?

  // Visit Details
  pageUrl     String
  referrerUrl String?
  utmSource   String?        // UTM parameter
  utmMedium   String?        // UTM parameter
  utmCampaign String?        // UTM parameter
  utmTerm     String?        // UTM parameter
  utmContent  String?        // UTM parameter

  // Relations
  platformId String?
  platform   Platform? @relation(...)
  leadId      String?
  lead        Lead? @relation(...)

  converted   Boolean @default(false)
  duration    Int?
  exitedAt    DateTime?
}
```

### Platform Model Integration
Platforms are fetched from the database and displayed as a dropdown option:

```typescript
// In page.tsx
const platforms = await prisma.platform.findMany({
  where: { isActive: true },
  select: { id: true, name: true },
  orderBy: { name: 'asc' },
})
```

## Installation & Setup

### 1. Install Dependencies
```bash
cd apps/web-dashboard
npm install
# or
pnpm install
```

The package.json now includes:
- `qrcode`: "^1.5.3" - QR code generation
- `@types/qrcode`: "^1.5.2" - TypeScript types

### 2. Environment Setup
Ensure your database URL is configured:
```bash
# In root .env or apps/web-dashboard/.env
DATABASE_URL="file:./dev.db" # or your database connection string
```

### 3. Prisma Setup
The Prisma client is already configured in `@kpi/database` package.

## Usage Guide

### For End Users

1. **Navigate to UTM Builder**:
   - Go to `/tools/utm-builder`

2. **Enter Base URL**:
   - Provide the landing page URL

3. **Select UTM Parameters** (Required):
   - Click on Source dropdown and select or type
   - Click on Medium dropdown and select or type
   - Click on Campaign dropdown and select or type

4. **Optional Parameters**:
   - Add utm_term for keywords
   - Add utm_content for ad variants
   - Select Platform if applicable

5. **Copy or Share**:
   - Copy generated URL to clipboard
   - Generate QR code for printing/mobile sharing
   - Test the link
   - Download as text file

6. **Track History**:
   - View all previously generated URLs
   - Re-use URLs from history
   - Export history as CSV

### For Developers

#### Adding Custom UTM Options

Edit `/lib/validations/utm.ts`:

```typescript
export const UTM_SOURCES = [
  { value: 'custom_source', label: 'Custom Source Label' },
  // ... other options
]
```

#### Customizing Validation Rules

Edit the `utmFormSchema` in `/lib/validations/utm.ts`:

```typescript
export const utmFormSchema = z.object({
  baseUrl: z.string().url('Custom error message'),
  source: z.string().min(1, 'Custom error message'),
  // ... other fields
})
```

#### Extending QR Code Options

Modify `QrCodeGenerator.tsx`:

```typescript
await QRCode.toCanvas(canvasRef.current, url, {
  errorCorrectionLevel: 'H',  // Can be L, M, Q, H
  type: 'image/png',
  quality: 0.95,
  margin: 1,
  width: 300,  // Increase for larger QR codes
  // Add custom styling
})
```

## Best Practices

1. **Naming Conventions**:
   - Use lowercase and underscores: `spring_sale` not `Spring Sale`
   - Keep campaign names concise
   - Be consistent across campaigns

2. **Parameter Usage**:
   - Always fill required fields (source, medium, campaign)
   - Use term only for paid search campaigns
   - Use content to differentiate ad variants

3. **URL Management**:
   - Keep URLs under 2000 characters for compatibility
   - Test generated links before sharing
   - Document your UTM naming scheme

4. **Tracking Strategy**:
   - Export history regularly
   - Use consistent source and medium values
   - Create a shared campaign naming guide for teams

5. **QR Code Best Practices**:
   - Use error correction level H for outdoor printing
   - Maintain adequate spacing around QR codes
   - Test QR codes before printing large batches

## Troubleshooting

### QR Code Not Generating
- Ensure `qrcode` package is installed: `npm install qrcode`
- Check browser console for errors
- Verify URL is valid

### History Not Saving
- Check localStorage is enabled in browser
- Verify localStorage isn't full
- Clear browser cache if issues persist

### Database Operations Failing
- Verify DATABASE_URL is correct
- Ensure Prisma migrations are run: `npx prisma migrate dev`
- Check database file permissions

### URL Length Issues
- Keep utm_campaign and utm_content concise
- Avoid unnecessary parameters
- Use URL shortener if needed (separate tool)

## Performance Considerations

- **localStorage History**: Limited to 20 items to prevent storage overflow
- **API Validation**: Uses Zod for efficient schema validation
- **QR Code Generation**: Done client-side to reduce server load
- **Database Queries**: Indexed on utm_source and utm_campaign for fast filtering

## Security Notes

- URL generation is performed client-side for most functionality
- Sensitive data should never be included in UTM parameters
- Database operations include basic input validation via Zod
- API routes validate all incoming data

## Future Enhancement Ideas

1. **URL Shortening**: Integration with bit.ly or tinyurl
2. **Campaign Templates**: Save and reuse campaign configurations
3. **Analytics Dashboard**: Real-time campaign performance metrics
4. **Team Collaboration**: Share UTM links with team members
5. **Bulk Generator**: Create multiple URLs with variations
6. **API Integration**: Sync with Google Analytics and other platforms
7. **Mobile App**: React Native version for on-the-go URL generation
8. **Scheduled Reports**: Email campaign performance summaries

## Related Files

- **Page**: `app/tools/utm-builder/page.tsx`
- **Validation Schema**: `lib/validations/utm.ts`
- **API Routes**: `app/api/utm/*`
- **Database Schema**: `packages/database/prisma/schema.prisma`

## Support & Documentation

For more information on UTM parameters:
- [Google Analytics UTM Guide](https://support.google.com/analytics/answer/1033173)
- [Standard UTM Parameters](https://en.wikipedia.org/wiki/UTM_parameters)
- [QR Code Best Practices](https://www.qr-code-generator.com/qr-code-marketing/qr-codes-basics/)
