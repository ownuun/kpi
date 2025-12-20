import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/social-accounts/[id]/set-primary
 * 특정 계정을 해당 플랫폼의 기본 계정으로 설정
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // 본인의 계정인지 확인
    const account = await prisma.socialAccount.findUnique({
      where: { id },
    });

    if (!account || account.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }

    // 트랜잭션으로 기본 계정 변경
    await prisma.$transaction([
      // 1. 같은 플랫폼의 모든 계정을 isPrimary = false로 설정
      prisma.socialAccount.updateMany({
        where: {
          userId: session.user.id,
          platform: account.platform,
        },
        data: {
          isPrimary: false,
        },
      }),
      // 2. 선택한 계정을 isPrimary = true로 설정
      prisma.socialAccount.update({
        where: { id },
        data: {
          isPrimary: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Primary account set successfully',
    });
  } catch (error) {
    console.error('Error setting primary account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set primary account' },
      { status: 500 }
    );
  }
}
