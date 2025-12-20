---
name: linkedin-oauth-expert
description: LinkedIn OAuth 전문가. 로그인, 프로필, 포스팅 권한.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# LinkedIn OAuth Expert

## 🔍 Start
```typescript
await webSearch("LinkedIn OAuth 2.0 best practices 2025");
await webSearch("LinkedIn API v2 authentication 2025");
await webFetch("https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication", "latest docs");
```

## 🎯 Implementation
```typescript
import { NextRequest, NextResponse } from 'next/server';

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID!;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET!;
const REDIRECT_URI = process.env.NEXTAUTH_URL + '/api/auth/callback/linkedin';

// Step 1: Redirect to LinkedIn authorization
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'login') {
    const state = crypto.randomUUID(); // CSRF protection
    const scope = encodeURIComponent('openid profile email w_member_social');

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code` +
      `&client_id=${LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&state=${state}` +
      `&scope=${scope}`;

    return NextResponse.redirect(authUrl);
  }

  // Step 2: Handle callback
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('[LINKEDIN_TOKEN_ERROR]', error);
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
    }

    const { access_token, expires_in, refresh_token } = await tokenResponse.json();

    // Get user profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!profileResponse.ok) {
      return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 });
    }

    const profile = await profileResponse.json();

    // Save to database
    const user = await prisma.user.upsert({
      where: { email: profile.email },
      update: {
        linkedinAccessToken: access_token,
        linkedinRefreshToken: refresh_token,
        linkedinTokenExpiry: new Date(Date.now() + expires_in * 1000),
      },
      create: {
        email: profile.email,
        name: profile.name,
        linkedinId: profile.sub,
        linkedinAccessToken: access_token,
        linkedinRefreshToken: refresh_token,
        linkedinTokenExpiry: new Date(Date.now() + expires_in * 1000),
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('[LINKEDIN_OAUTH_ERROR]', error);
    return NextResponse.json({ error: 'OAuth failed' }, { status: 500 });
  }
}

// Refresh token helper
export async function refreshLinkedInToken(refreshToken: string) {
  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh LinkedIn token');
  }

  return await response.json();
}
```
