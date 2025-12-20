import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { SocialAccountSchema } from '@/lib/validations/social-account';
import { encrypt, maskToken } from '@/lib/crypto/encrypt';
import { z } from 'zod';

/**
 * GET /api/social/accounts
 * List all social accounts
 * 
 * Note: Access tokens are masked in the response for security
 */
export async function GET(request: NextRequest) {
  try {
    const platform = request.nextUrl.searchParams.get('platform');
    const isActive = request.nextUrl.searchParams.get('isActive');

    const accounts = await prisma.socialAccount.findMany({
      where: {
        ...(platform && { platform: platform as any }),
        ...(isActive !== null && { isActive: isActive === 'true' }),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    // Mask tokens in response
    const maskedAccounts = accounts.map(account => ({
      ...account,
      accessToken: maskToken(account.accessToken),
      refreshToken: account.refreshToken ? maskToken(account.refreshToken) : null,
    }));

    return NextResponse.json(maskedAccounts);
  } catch (error) {
    console.error('Error fetching social accounts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/social/accounts
 * Create a new social account
 * 
 * Encrypts OAuth tokens before storing in database
 * Only allows one account per platform (unique constraint)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = SocialAccountSchema.parse(body);

    // Check if account for this platform already exists
    const existing = await prisma.socialAccount.findUnique({
      where: { platform: validated.platform },
    });

    if (existing) {
      return NextResponse.json(
        { 
          error: `Social account for ${validated.platform} already exists`,
          existingId: existing.id,
        },
        { status: 409 }
      );
    }

    // Encrypt tokens
    const encryptedAccessToken = encrypt(validated.accessToken);
    const encryptedRefreshToken = validated.refreshToken
      ? encrypt(validated.refreshToken)
      : null;

    const account = await prisma.socialAccount.create({
      data: {
        platform: validated.platform,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : null,
        accountId: validated.accountId,
        accountUsername: validated.accountUsername,
        accountName: validated.accountName,
        isActive: validated.isActive,
      },
    });

    // Return with masked tokens
    return NextResponse.json(
      {
        ...account,
        accessToken: maskToken(validated.accessToken),
        refreshToken: validated.refreshToken ? maskToken(validated.refreshToken) : null,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating social account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
