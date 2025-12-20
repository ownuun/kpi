# Person B 작업 가이드: Lead & Deal Manager

## 🎯 담당 영역
- **Lead Manager**: 문의 접수, 리드 파이프라인, 미팅 관리
- **Deal Manager**: 거래 관리, 입금 추적, 구독 관리
- **Google Calendar 연동**: 미팅 일정 자동 동기화

---

## 📁 담당 파일 구조

```
kpi-tracker/
├── app/
│   ├── (dashboard)/
│   │   ├── leads/                  ⭐ 전체 담당
│   │   │   ├── page.tsx           # 리드 목록
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx       # 리드 상세
│   │   │   └── pipeline/
│   │   │       └── page.tsx       # 파이프라인 Kanban 보드
│   │   │
│   │   └── deals/                  ⭐ 전체 담당
│   │       ├── page.tsx           # 거래 목록
│   │       ├── [id]/
│   │       │   └── page.tsx       # 거래 상세
│   │       └── subscriptions/
│   │           └── page.tsx       # 구독 관리 (ANYON)
│   │
│   └── api/
│       ├── leads/                  ⭐ 전체 담당
│       │   ├── route.ts           # GET /api/leads, POST /api/leads
│       │   └── [id]/
│       │       └── route.ts       # GET/PUT/DELETE /api/leads/:id
│       │
│       ├── deals/                  ⭐ 전체 담당
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       │
│       ├── meetings/               ⭐ 전체 담당
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       │
│       └── webhooks/
│           └── google-calendar/    ⭐ Google Calendar Webhook
│               └── route.ts
│
├── components/
│   ├── leads/                      ⭐ 전체 담당
│   │   ├── LeadCard.tsx           # 리드 카드 컴포넌트
│   │   ├── LeadForm.tsx           # 리드 생성/수정 폼
│   │   ├── PipelineBoard.tsx      # Kanban 보드
│   │   ├── LeadStatusBadge.tsx    # 상태 배지
│   │   └── LeadTimeline.tsx       # 히스토리 타임라인
│   │
│   ├── deals/                      ⭐ 전체 담당
│   │   ├── DealCard.tsx
│   │   ├── DealForm.tsx
│   │   ├── PaymentTracker.tsx     # 입금 추적
│   │   └── SubscriptionCard.tsx   # 구독 카드
│   │
│   └── meetings/                   ⭐ 전체 담당
│       ├── MeetingCard.tsx
│       ├── MeetingForm.tsx
│       └── CalendarSync.tsx       # Calendar 동기화 UI
│
└── lib/
    ├── integrations/
    │   └── google-calendar.ts      ⭐ Google Calendar API 클라이언트
    │
    └── automation/
        └── lead-processor.ts       ⭐ 리드 자동 처리 로직
```

---

## 🗓️ 개발 일정 (6주)

### Week 1: 환경 설정 & 기본 구조
- [ ] Person C의 Prisma 스키마 완료 대기
- [ ] 로컬 환경 셋업
- [ ] Lead 폴더 구조 생성
- [ ] Google Calendar OAuth 앱 등록

### Week 2: Lead Manager - CRUD
- [ ] LeadForm 컴포넌트 작성
- [ ] POST /api/leads (리드 생성)
- [ ] GET /api/leads (리드 목록)
- [ ] LeadCard 컴포넌트
- [ ] 리드 상세 페이지

### Week 3: Lead Manager - Pipeline
- [ ] PipelineBoard Kanban 컴포넌트 (Twenty 참조)
- [ ] 리드 상태 변경 API
- [ ] 드래그앤드롭 기능
- [ ] LeadTimeline (히스토리)

### Week 4: Google Calendar 연동
- [ ] Google Calendar OAuth 인증
- [ ] 미팅 생성 API
- [ ] Webhook 엔드포인트
- [ ] 미팅 일정 자동 동기화

### Week 5: Deal Manager
- [ ] DealForm & DealCard 컴포넌트
- [ ] Deal CRUD API
- [ ] PaymentTracker (입금 추적)
- [ ] 전환율 계산 로직

### Week 6: 구독 관리 & 최적화
- [ ] SubscriptionCard 컴포넌트
- [ ] 구독 관리 페이지 (ANYON)
- [ ] 통합 테스트
- [ ] 에러 핸들링

---

## 📝 상세 작업 가이드

### 1. LeadForm 컴포넌트 작성

**참고**: `clones/twenty/packages/ui/` 폼 구조

#### 기본 구조
```tsx
// components/leads/LeadForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const leadSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요'),
  email: z.string().email('올바른 이메일을 입력하세요'),
  phone: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  businessLineId: z.string().min(1, '비즈니스 라인을 선택하세요'),
  source: z.string().optional(), // UTM source
  medium: z.string().optional(), // UTM medium
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  initialData?: Partial<LeadFormData>;
  onSuccess?: () => void;
}

export default function LeadForm({ initialData, onSuccess }: LeadFormProps) {
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      businessLineId: '',
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('리드 생성 실패');

      const lead = await res.json();
      console.log('리드 생성 완료:', lead);
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">이름 *</Label>
        <Input
          id="name"
          {...form.register('name')}
          placeholder="홍길동"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">이메일 *</Label>
        <Input
          id="email"
          type="email"
          {...form.register('email')}
          placeholder="hong@example.com"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">전화번호</Label>
        <Input
          id="phone"
          {...form.register('phone')}
          placeholder="010-1234-5678"
        />
      </div>

      <div>
        <Label htmlFor="company">회사명</Label>
        <Input
          id="company"
          {...form.register('company')}
          placeholder="ABC 주식회사"
        />
      </div>

      <div>
        <Label htmlFor="industry">업종</Label>
        <Input
          id="industry"
          {...form.register('industry')}
          placeholder="IT/소프트웨어"
        />
      </div>

      <div>
        <Label htmlFor="businessLineId">비즈니스 라인 *</Label>
        <Select onValueChange={(value) => form.setValue('businessLineId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outsource-id">외주</SelectItem>
            <SelectItem value="b2b-id">B2B</SelectItem>
            <SelectItem value="anyon-id">ANYON</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">메모</Label>
        <textarea
          id="notes"
          {...form.register('notes')}
          className="w-full min-h-[100px] p-2 border rounded"
          placeholder="추가 정보를 입력하세요"
        />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? '생성 중...' : '리드 생성'}
      </Button>
    </form>
  );
}
```

---

### 2. PipelineBoard (Kanban) 컴포넌트

**참고**: `clones/twenty/packages/ui/src/kanban/`

#### 기본 구조
```tsx
// components/leads/PipelineBoard.tsx
'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import LeadCard from './LeadCard';

type LeadStatus = 'NEW' | 'CONTACTED' | 'MEETING_SCHEDULED' | 'MEETING_COMPLETED' | 'PROPOSAL_SENT' | 'NEGOTIATING' | 'WON' | 'LOST';

interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  status: LeadStatus;
  createdAt: string;
}

const COLUMNS: { id: LeadStatus; title: string; color: string }[] = [
  { id: 'NEW', title: '신규', color: 'bg-gray-100' },
  { id: 'CONTACTED', title: '연락 완료', color: 'bg-blue-100' },
  { id: 'MEETING_SCHEDULED', title: '미팅 예정', color: 'bg-yellow-100' },
  { id: 'MEETING_COMPLETED', title: '미팅 완료', color: 'bg-purple-100' },
  { id: 'PROPOSAL_SENT', title: '견적 발송', color: 'bg-orange-100' },
  { id: 'NEGOTIATING', title: '협상 중', color: 'bg-pink-100' },
  { id: 'WON', title: '성사', color: 'bg-green-100' },
  { id: 'LOST', title: '실패', color: 'bg-red-100' },
];

export default function PipelineBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data);
    } catch (error) {
      console.error('리드 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId as LeadStatus;

    // 낙관적 업데이트 (UI 먼저 변경)
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === draggableId ? { ...lead, status: newStatus } : lead
      )
    );

    // API 호출
    try {
      await fetch(`/api/leads/${draggableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error('상태 변경 실패:', error);
      // 실패 시 롤백
      fetchLeads();
    }
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-4">
        {COLUMNS.map(column => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className={`${column.color} p-3 rounded-t-lg`}>
              <h3 className="font-semibold">{column.title}</h3>
              <span className="text-sm text-gray-600">
                {leads.filter(lead => lead.status === column.id).length}건
              </span>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[500px] p-2 rounded-b-lg border-2 border-t-0 ${
                    snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                >
                  {leads
                    .filter(lead => lead.status === column.id)
                    .map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-2 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                          >
                            <LeadCard lead={lead} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
```

**필요 패키지 추가**:
```bash
pnpm add @hello-pangea/dnd
```

---

### 3. Google Calendar API 연동

**참고**: `clones/n8n/packages/nodes/GoogleCalendar/`

#### OAuth 설정
```typescript
// lib/integrations/google-calendar.ts
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CALENDAR_CLIENT_ID,
  process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
  process.env.GOOGLE_CALENDAR_REDIRECT_URI
);

export class GoogleCalendarClient {
  private calendar;

  constructor(accessToken: string, refreshToken: string) {
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  }

  /**
   * 미팅 일정 생성
   */
  async createEvent(params: {
    summary: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    attendees?: string[]; // 이메일 리스트
  }) {
    const event = {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.startTime.toISOString(),
        timeZone: 'Asia/Seoul',
      },
      end: {
        dateTime: params.endTime.toISOString(),
        timeZone: 'Asia/Seoul',
      },
      attendees: params.attendees?.map(email => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 하루 전
          { method: 'popup', minutes: 30 }, // 30분 전
        ],
      },
    };

    const response = await this.calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return response.data;
  }

  /**
   * 미팅 일정 업데이트
   */
  async updateEvent(eventId: string, params: { summary?: string; startTime?: Date }) {
    const event: any = {};

    if (params.summary) {
      event.summary = params.summary;
    }

    if (params.startTime) {
      event.start = {
        dateTime: params.startTime.toISOString(),
        timeZone: 'Asia/Seoul',
      };
    }

    const response = await this.calendar.events.patch({
      calendarId: 'primary',
      eventId,
      requestBody: event,
    });

    return response.data;
  }

  /**
   * 미팅 일정 삭제
   */
  async deleteEvent(eventId: string) {
    await this.calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
  }
}

// 사용 예시
export async function createMeeting(leadId: string, meetingData: any) {
  const client = new GoogleCalendarClient(
    process.env.GOOGLE_ACCESS_TOKEN!,
    process.env.GOOGLE_REFRESH_TOKEN!
  );

  const event = await client.createEvent({
    summary: `미팅: ${meetingData.leadName}`,
    description: meetingData.notes,
    startTime: new Date(meetingData.scheduledAt),
    endTime: new Date(new Date(meetingData.scheduledAt).getTime() + 60 * 60 * 1000), // 1시간 후
    attendees: [meetingData.leadEmail],
  });

  return event;
}
```

---

### 4. API Route 작성

#### Lead CRUD API
```typescript
// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessLineId = searchParams.get('businessLineId');
    const status = searchParams.get('status');

    const where: any = {};

    if (businessLineId) where.businessLineId = businessLineId;
    if (status) where.status = status;

    const leads = await prisma.lead.findMany({
      where,
      include: {
        businessLine: true,
        meetings: {
          orderBy: { scheduledAt: 'desc' },
          take: 5,
        },
        deals: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('리드 조회 오류:', error);
    return NextResponse.json({ error: '리드 조회 실패' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        industry: body.industry,
        businessLineId: body.businessLineId,
        source: body.source || null,
        medium: body.medium || null,
        notes: body.notes || null,
        status: 'NEW',
        userId: 'current-user-id', // NextAuth에서 가져오기
      },
      include: {
        businessLine: true,
      },
    });

    // 랜딩 방문 기록 (UTM이 있는 경우)
    if (body.source || body.medium) {
      await prisma.landingVisit.create({
        data: {
          businessLineId: body.businessLineId,
          utmSource: body.source,
          utmMedium: body.medium,
          utmCampaign: body.campaign,
        },
      });
    }

    // TODO: Slack 알림 발송
    // await sendSlackNotification(`새 문의: ${lead.name} (${lead.email})`);

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('리드 생성 오류:', error);
    return NextResponse.json({ error: '리드 생성 실패' }, { status: 500 });
  }
}
```

#### Lead Update API
```typescript
// app/api/leads/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      include: {
        businessLine: true,
        meetings: {
          orderBy: { scheduledAt: 'desc' },
        },
        deals: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: '리드를 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error('리드 조회 오류:', error);
    return NextResponse.json({ error: '리드 조회 실패' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: body,
      include: {
        businessLine: true,
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error('리드 업데이트 오류:', error);
    return NextResponse.json({ error: '리드 업데이트 실패' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.lead.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('리드 삭제 오류:', error);
    return NextResponse.json({ error: '리드 삭제 실패' }, { status: 500 });
  }
}
```

---

### 5. Google Calendar Webhook

```typescript
// app/api/webhooks/google-calendar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Google Calendar의 이벤트 정보
    const { eventId, eventType, attendees, start, summary } = body;

    if (eventType === 'created' || eventType === 'updated') {
      // attendees에서 리드 이메일 찾기
      const leadEmail = attendees?.find((a: any) => a.email !== process.env.OUR_EMAIL);

      if (leadEmail) {
        const lead = await prisma.lead.findFirst({
          where: { email: leadEmail.email },
        });

        if (lead) {
          // 미팅 기록 생성 또는 업데이트
          await prisma.meeting.upsert({
            where: { googleCalendarEventId: eventId },
            create: {
              leadId: lead.id,
              title: summary,
              scheduledAt: new Date(start.dateTime),
              googleCalendarEventId: eventId,
            },
            update: {
              title: summary,
              scheduledAt: new Date(start.dateTime),
            },
          });

          // 리드 상태 업데이트
          if (lead.status === 'NEW' || lead.status === 'CONTACTED') {
            await prisma.lead.update({
              where: { id: lead.id },
              data: { status: 'MEETING_SCHEDULED' },
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook 처리 오류:', error);
    return NextResponse.json({ error: 'Webhook 처리 실패' }, { status: 500 });
  }
}
```

---

## 🔧 로컬 개발 환경 설정

### 1. 환경 변수
```.env.local
# Google Calendar
GOOGLE_CALENDAR_CLIENT_ID=your_client_id
GOOGLE_CALENDAR_CLIENT_SECRET=your_client_secret
GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
GOOGLE_ACCESS_TOKEN=your_access_token
GOOGLE_REFRESH_TOKEN=your_refresh_token

# Our email (for filtering)
OUR_EMAIL=team@company.com
```

### 2. Google Calendar OAuth 설정

1. https://console.cloud.google.com/ 접속
2. 프로젝트 생성
3. "APIs & Services" → "Credentials"
4. "Create Credentials" → "OAuth client ID"
5. Application type: "Web application"
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Client ID, Client Secret 복사

### 3. 패키지 추가
```bash
pnpm add googleapis @hello-pangea/dnd
pnpm add -D @types/googleapis
```

---

## 📚 참고할 오픈소스 코드

### Twenty CRM
```
clones/twenty/
├── packages/
│   ├── ui/                    ⭐ Kanban 보드 참조
│   │   └── src/
│   │       └── kanban/
│   │
│   └── server/                ⭐ GraphQL 스키마 참조
│       └── src/
│           └── engine/
```

### n8n (Google Calendar)
```
clones/n8n/
└── packages/nodes-base/
    └── nodes/
        └── Google/
            └── Calendar/      ⭐ Calendar API 연동 코드
```

---

## ✅ 체크리스트

### Week 2
- [ ] LeadForm 컴포넌트 완성
- [ ] POST /api/leads 작동
- [ ] 리드 목록 페이지 완성
- [ ] LeadCard 컴포넌트 완성

### Week 3
- [ ] PipelineBoard Kanban 완성
- [ ] 드래그앤드롭 작동
- [ ] 리드 상태 변경 API 작동
- [ ] LeadTimeline 컴포넌트 추가

### Week 4
- [ ] Google Calendar OAuth 인증
- [ ] 미팅 생성 API 작동
- [ ] Webhook 엔드포인트 작동
- [ ] 미팅 자동 기록

### Week 5
- [ ] DealForm 완성
- [ ] Deal CRUD API 작동
- [ ] PaymentTracker 컴포넌트
- [ ] 전환율 계산

### Week 6
- [ ] 구독 관리 페이지 (ANYON)
- [ ] 모든 기능 통합 테스트
- [ ] 에러 핸들링 완성

---

## 🚨 주의사항

1. **Google Calendar Rate Limit**: API 호출 제한 있음 (주의)
2. **OAuth Token 갱신**: Access Token은 1시간 후 만료 → Refresh Token으로 갱신 필요
3. **Webhook 보안**: Google에서 오는 요청인지 검증 필요

---

**담당자**: Person B
**예상 기간**: 6주
**문의**: Person A (SNS 연동), Person C (DB/인프라)
