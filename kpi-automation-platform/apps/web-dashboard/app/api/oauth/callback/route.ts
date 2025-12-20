import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getPostizClient } from '@/lib/postiz';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state'); // userId

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/settings/accounts?error=invalid_request', request.url)
      );
    }

    const postiz = getPostizClient();

    // Postiz에서 access token 교환
    const integration = await postiz.integrations.exchangeToken(code);

    // 이미 연결된 계정이 있는지 확인
    const existingAccount = await prisma.socialAccount.findUnique({
      where: {
        userId_platform_accountId: {
          userId: state,
          platform: integration.platform.toUpperCase(),
          accountId: integration.accountId,
        },
      },
    });

    if (existingAccount) {
      // 기존 계정 업데이트 (토큰 갱신)
      await prisma.socialAccount.update({
        where: { id: existingAccount.id },
        data: {
          postizIntegrationId: integration.id,
          accessToken: integration.accessToken,
          refreshToken: integration.refreshToken,
          expiresAt: integration.expiresAt ? new Date(integration.expiresAt) : null,
          isActive: true,
        },
      });
    } else {
      // 해당 플랫폼의 첫 계정인지 확인
      const platformAccounts = await prisma.socialAccount.findMany({
        where: {
          userId: state,
          platform: integration.platform.toUpperCase(),
          isActive: true,
        },
      });

      // 새 계정 생성
      await prisma.socialAccount.create({
        data: {
          userId: state,
          platform: integration.platform.toUpperCase(),
          accountName: integration.accountName,
          accountId: integration.accountId,
          postizIntegrationId: integration.id,
          accessToken: integration.accessToken,
          refreshToken: integration.refreshToken,
          expiresAt: integration.expiresAt ? new Date(integration.expiresAt) : null,
          isPrimary: platformAccounts.length === 0, // 첫 계정은 기본 계정으로
          isActive: true,
        },
      });
    }

    return NextResponse.redirect(
      new URL('/settings/accounts?success=true', request.url)
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/settings/accounts?error=connection_failed', request.url)
    );
  }
}
