---
name: google-calendar-expert
description: Google Calendar API 전문가. 이벤트 생성, 리마인더, 동기화.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Google Calendar Expert

## 🔍 Start
```typescript
await webSearch("Google Calendar API v3 best practices 2025");
await webSearch("Google Calendar OAuth 2.0 2025");
await webFetch("https://developers.google.com/calendar/api/v3/reference/events", "latest docs");
```

## 🎯 Implementation
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

interface CalendarEventOptions {
  summary: string;
  description?: string;
  location?: string;
  startDateTime: string; // ISO 8601 format
  endDateTime: string;
  timeZone?: string;
  attendees?: string[]; // Email addresses
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
  recurrence?: string[]; // RRULE format
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken, ...eventData }: CalendarEventOptions & { accessToken: string } =
      await request.json();

    // Set credentials
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Create event
    const event = {
      summary: eventData.summary,
      description: eventData.description,
      location: eventData.location,
      start: {
        dateTime: eventData.startDateTime,
        timeZone: eventData.timeZone || 'Asia/Seoul',
      },
      end: {
        dateTime: eventData.endDateTime,
        timeZone: eventData.timeZone || 'Asia/Seoul',
      },
      attendees: eventData.attendees?.map((email) => ({ email })),
      reminders: eventData.reminders || {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 min before
        ],
      },
      recurrence: eventData.recurrence,
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      sendUpdates: 'all', // Send email notifications to attendees
    });

    // Save to database
    await prisma.calendarEvent.create({
      data: {
        googleEventId: response.data.id!,
        summary: eventData.summary,
        description: eventData.description,
        startDateTime: new Date(eventData.startDateTime),
        endDateTime: new Date(eventData.endDateTime),
        attendees: eventData.attendees || [],
      },
    });

    return NextResponse.json({
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink, // Link to event in Google Calendar
    });
  } catch (error: any) {
    console.error('[GOOGLE_CALENDAR_ERROR]', error);

    if (error.code === 401) {
      return NextResponse.json(
        { error: 'Access token expired or invalid' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    );
  }
}

// Get upcoming events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accessToken');
    const maxResults = parseInt(searchParams.get('maxResults') || '10');

    oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return NextResponse.json({
      events: response.data.items || [],
    });
  } catch (error) {
    console.error('[GOOGLE_CALENDAR_GET_ERROR]', error);
    return NextResponse.json({ error: 'Failed to get events' }, { status: 500 });
  }
}

// Update event
export async function PATCH(request: NextRequest) {
  const { accessToken, eventId, ...updates } = await request.json();

  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const response = await calendar.events.patch({
    calendarId: 'primary',
    eventId,
    requestBody: updates,
    sendUpdates: 'all',
  });

  return NextResponse.json({ success: true, event: response.data });
}

// Delete event
export async function DELETE(request: NextRequest) {
  const { accessToken, eventId } = await request.json();

  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  await calendar.events.delete({
    calendarId: 'primary',
    eventId,
    sendUpdates: 'all',
  });

  await prisma.calendarEvent.update({
    where: { googleEventId: eventId },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
```
