import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { SocialAccountUpdateSchema } from '@/lib/validations/social-account';
import { encrypt, decrypt, maskToken } from '@/lib/crypto/encrypt';
import { z } from 'zod';

/**
 * GET /api/social/accounts/[id]
 * Get a single social account
 * 
 * Query parameters:
 * - includeToken: Set to 'true' to include decrypted access token (use with caution)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const includeToken = request.nextUrl.searchParams.get('includeToken') === 'true';
    const includePosts = request.nextUrl.searchParams.get('includePosts') === 'true';

    const account = await prisma.socialAccount.findUnique({
      where: { id },
      include: includePosts ? {
        posts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      } : undefined,
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Social account not found' },
        { status: 404 }
      );
    }

    // Decrypt token if requested (use with caution!)
    let responseAccount: any = { ...account };

    if (includeToken) {
      try {
        responseAccount.accessToken = decrypt(account.accessToken);
        responseAccount.refreshToken = account.refreshToken
          ? decrypt(account.refreshToken)
          : null;
      } catch (error) {
        console.error('Failed to decrypt tokens:', error);
        return NextResponse.json(
          { error: 'Failed to decrypt tokens' },
          { status: 500 }
        );
      }
    } else {
      // Mask tokens
      responseAccount.accessToken = maskToken(account.accessToken);
      responseAccount.refreshToken = account.refreshToken
        ? maskToken(account.refreshToken)
        : null;
    }

    return NextResponse.json(responseAccount);
  } catch (error) {
    console.error('Error fetching social account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/social/accounts/[id]
 * Update a social account
 * 
 * Encrypts any new tokens before storing
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = SocialAccountUpdateSchema.parse(body);

    const existing = await prisma.socialAccount.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Social account not found' },
        { status: 404 }
      );
    }

    // Encrypt new tokens if provided
    const updateData: any = {};

    if (validated.accessToken) {
      updateData.accessToken = encrypt(validated.accessToken);
    }

    if (validated.refreshToken !== undefined) {
      updateData.refreshToken = validated.refreshToken
        ? encrypt(validated.refreshToken)
        : null;
    }

    if (validated.expiresAt !== undefined) {
      updateData.expiresAt = validated.expiresAt
        ? new Date(validated.expiresAt)
        : null;
    }

    if (validated.accountId !== undefined) {
      updateData.accountId = validated.accountId;
    }

    if (validated.accountUsername !== undefined) {
      updateData.accountUsername = validated.accountUsername;
    }

    if (validated.accountName !== undefined) {
      updateData.accountName = validated.accountName;
    }

    if (validated.isActive !== undefined) {
      updateData.isActive = validated.isActive;
    }

    const account = await prisma.socialAccount.update({
      where: { id },
      data: updateData,
    });

    // Return with masked tokens
    return NextResponse.json({
      ...account,
      accessToken: maskToken(account.accessToken),
      refreshToken: account.refreshToken ? maskToken(account.refreshToken) : null,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating social account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/social/accounts/[id]
 * Delete a social account
 * 
 * Note: This will also delete associated posts (cascade)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const account = await prisma.socialAccount.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Social account not found' },
        { status: 404 }
      );
    }

    await prisma.socialAccount.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Social account deleted successfully',
      id,
      deletedPosts: account._count.posts,
    });
  } catch (error) {
    console.error('Error deleting social account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
