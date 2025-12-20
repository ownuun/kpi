# Web Dashboard

KPI Automation Platform - Multi-Business Line Dashboard

## Overview

A comprehensive dashboard system for tracking KPIs across three business lines:
- **Outsourcing** (외주)
- **B2B**
- **ANYON**

## Features

- Real-time KPI metrics
- Revenue trend visualization
- Sales funnel analysis
- Platform performance tracking
- Business line comparison
- Target achievement monitoring
- Responsive design

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser
open http://localhost:3000/dashboard
```

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Dashboard Routes

- `/dashboard` - Main overview dashboard
- `/dashboard/outsourcing` - Outsourcing business line
- `/dashboard/b2b` - B2B business line
- `/dashboard/anyon` - ANYON business line

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **UI Components**: shadcn/ui + Radix UI
- **Database**: Prisma + SQLite
- **Icons**: Lucide React

## Project Structure

```
apps/web-dashboard/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── layout.tsx            # Dashboard layout
│   │   ├── outsourcing/page.tsx  # Outsourcing dashboard
│   │   ├── b2b/page.tsx          # B2B dashboard
│   │   └── anyon/page.tsx        # ANYON dashboard
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   └── dashboard/
│       ├── MetricCard.tsx        # KPI metric card
│       ├── RevenueChart.tsx      # Revenue trend chart
│       ├── FunnelChart.tsx       # Sales funnel visualization
│       ├── PlatformStats.tsx     # Platform performance
│       ├── BusinessLineSelector.tsx  # Business line navigation
│       └── DateRangePicker.tsx   # Date range selector
├── lib/
│   ├── db.ts                     # Prisma client
│   ├── dashboard-data.ts         # Data fetching functions
│   └── utils.ts                  # Utility functions
└── package.json
```

## Key Components

### MetricCard
Displays KPI metrics with icons, trends, and change indicators.

```tsx
<MetricCard
  title="Total Revenue"
  value={metrics.totalRevenue}
  format="currency"
  icon={<DollarSign />}
  trend="up"
  change={12.5}
/>
```

### RevenueChart
Line/Area chart for revenue trends with target comparison.

```tsx
<RevenueChart
  data={revenueData}
  title="Revenue Trend"
  description="Last 6 months"
/>
```

### FunnelChart
Visual sales funnel with conversion rates.

```tsx
<FunnelChart
  stages={[
    { name: 'Promotion', value: 100 },
    { name: 'Visits', value: 80 },
    { name: 'Inquiries', value: 40 },
    { name: 'Meetings', value: 20 },
    { name: 'Deals', value: 10 },
  ]}
/>
```

### PlatformStats
Platform performance comparison with charts.

```tsx
<PlatformStats
  data={platformStats}
  title="Platform Performance"
/>
```

## Data Functions

### getDashboardMetrics
Fetch KPI metrics for a business line.

```ts
const metrics = await getDashboardMetrics(businessLineId, startDate, endDate)
// Returns: { totalRevenue, totalLeads, totalDeals, totalMeetings, conversionRate, averageDealSize }
```

### getFunnelData
Get sales funnel stage counts.

```ts
const funnel = await getFunnelData(businessLineId, startDate, endDate)
// Returns: { promotion, visits, inquiries, meetings, deals }
```

### getRevenueByMonth
Revenue time series data.

```ts
const revenue = await getRevenueByMonth(businessLineId, months)
// Returns: [{ date: '2024-01', revenue: 50000000 }, ...]
```

### getPlatformStats
Platform performance metrics.

```ts
const platforms = await getPlatformStats(businessLineId, startDate, endDate)
// Returns: [{ platform: 'LinkedIn', posts: 10, engagement: 500, leads: 5 }, ...]
```

## Database Schema

Uses Prisma with the following main models:
- `BusinessLine` - Business line configuration
- `Deal` - Sales deals
- `Lead` - Customer leads
- `Meeting` - Scheduled meetings
- `Post` - Published content
- `LandingVisit` - Website visits
- `Platform` - Marketing platforms

## Environment Variables

```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

## Styling

### Tailwind Configuration
Custom colors and responsive breakpoints configured in `tailwind.config.ts`.

### Business Line Colors
- Outsourcing: Blue (#3B82F6)
- B2B: Green (#10B981)
- ANYON: Purple (#A855F7)

## Scripts

```bash
# Development
pnpm dev           # Start dev server on port 3000
pnpm build         # Build for production
pnpm start         # Start production server
pnpm lint          # Run ESLint
pnpm type-check    # Check TypeScript types
pnpm clean         # Remove .next directory
```

## API Routes

Dashboard pages use Server Components for data fetching. API routes available:

- `/api/leads` - Lead management
- `/api/pipeline` - Pipeline operations
- `/api/utm/generate` - UTM parameter generation
- `/api/utm/track` - UTM tracking

## Performance

- Server-side rendering for fast initial loads
- Parallel data fetching with Promise.all()
- Optimized Prisma queries
- Minimal client-side JavaScript
- Responsive images and lazy loading

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private - Internal use only

## Support

For issues or questions, contact the development team.

---

Built with Next.js and shadcn/ui
