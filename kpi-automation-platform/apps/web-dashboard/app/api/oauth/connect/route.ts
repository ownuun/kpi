import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPostizClient } from '@/lib/postiz';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const platform = request.nextUrl.searchParams.get('platform');

    if (!platform) {
      return NextResponse.redirect(
        new URL('/settings/accounts?error=invalid_platform', request.url)
      );
    }

    const postiz = getPostizClient();

    // Postiz OAuth URL 생성
    const authUrl = await postiz.integrations.getAuthUrl({
      platform: platform.toLowerCase(),
      redirectUri: `${process.env.NEXTAUTH_URL}/api/oauth/callback`,
      state: session.user.id, // 사용자 식별용
    });

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('OAuth connect error:', error);
    return NextResponse.redirect(
      new URL('/settings/accounts?error=connection_failed', request.url)
    );
  }
}
