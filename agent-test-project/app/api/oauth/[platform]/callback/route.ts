/**
 * OAuth Callback Route
 *
 * Handles OAuth callback from social media platforms.
 * GET /api/oauth/{platform}/callback
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
    const searchParams = request.nextUrl.searchParams;

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Check for OAuth errors
    if (error) {
      const errorDescription = searchParams.get('error_description') || error;
      console.error('[OAuth] Callback error:', errorDescription);

      return NextResponse.redirect(
        new URL(
          `/settings/accounts?error=${encodeURIComponent(errorDescription)}`,
          request.url
        )
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL(
          '/settings/accounts?error=Missing authorization code or state',
          request.url
        )
      );
    }

    // Verify state (CSRF protection)
    const storedState = request.cookies.get('oauth_state')?.value;
    if (state !== storedState) {
      console.error('[OAuth] State mismatch');
      return NextResponse.redirect(
        new URL(
          '/settings/accounts?error=Invalid state parameter',
          request.url
        )
      );
    }

    // Validate platform
    if (!Object.values(SocialPlatform).includes(platform)) {
      return NextResponse.redirect(
        new URL(
          '/settings/accounts?error=Invalid platform',
          request.url
        )
      );
    }

    // Get adapter for platform
    const adapter = getAdapter(platform);

    // Generate redirect URI (must match the one used in authorize)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/oauth/${platformName}/callback`;

    // Complete OAuth authentication
    const result = await oauthManager.authenticate(
      adapter,
      code,
      state,
      redirectUri,
      'system' // TODO: Get from session
    );

    // Clear OAuth state cookie
    const response = NextResponse.redirect(
      new URL(
        result.success
          ? `/settings/accounts?success=true&platform=${platformName}`
          : `/settings/accounts?error=${encodeURIComponent(result.error || 'Authentication failed')}`,
        request.url
      )
    );

    response.cookies.delete('oauth_state');

    return response;
  } catch (error: any) {
    console.error('[OAuth] Callback error:', error);
    return NextResponse.redirect(
      new URL(
        `/settings/accounts?error=${encodeURIComponent(error.message || 'Authentication failed')}`,
        request.url
      )
    );
  }
}
