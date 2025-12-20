/**
 * OAuth Authorization Route
 *
 * Initiates OAuth flow for a social media platform.
 * GET /api/oauth/{platform}/authorize
 */

import { NextRequest, NextResponse } from 'next/server';
import { SocialPlatform } from '@prisma/client';
import { getAdapter } from '@/lib/social/adapters';
import { oauthManager } from '@/lib/social/oauth';
import '@/lib/social/adapters/register'; // Initialize adapters

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const { platform: platformName } = await params;
    const platform = platformName.toUpperCase() as SocialPlatform;

    // Validate platform
    if (!Object.values(SocialPlatform).includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
    }

    // Get adapter for platform
    const adapter = getAdapter(platform);

    // Generate redirect URI
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/oauth/${platformName}/callback`;

    // Generate authorization URL
    const { url, state } = await oauthManager.generateAuthUrl(
      adapter,
      redirectUri,
      'system' // TODO: Get from session
    );

    // Store state in session/cookie for CSRF protection
    const response = NextResponse.redirect(url);
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error: any) {
    console.error('[OAuth] Authorization error:', error);
    return NextResponse.json(
      { error: error.message || 'Authorization failed' },
      { status: 500 }
    );
  }
}
