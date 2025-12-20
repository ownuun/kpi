import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/oauth/accounts
 * Fetch all connected social media accounts
 */
export async function GET(request: NextRequest) {
  try {
    const accounts = await prisma.socialAccount.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ accounts: accounts || [] });
  } catch (error: any) {
    console.error('[OAuth Accounts] GET error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch accounts',
        accounts: []
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/oauth/accounts?id={accountId}
 * Disconnect/remove a social media account
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // Delete the account
    await prisma.socialAccount.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[OAuth Accounts] DELETE error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete account' },
      { status: 500 }
    );
  }
}
