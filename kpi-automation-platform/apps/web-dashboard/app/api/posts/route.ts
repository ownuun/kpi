import { NextRequest, NextResponse } from 'next/server';
import { getPostizClient } from '@/lib/postiz';
import { formatErrorResponse } from '@/lib/api-utils';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import {
  CreatePostRequest,
  ListPostsParams,
  PostStatus,
  Platform,
} from '@/types/posts';

const prisma = new PrismaClient();

/**
 * GET /api/posts
 * List posts with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params: ListPostsParams = {
      status: searchParams.get('status') as PostStatus | undefined,
      platforms: searchParams.get('platforms')
        ? [searchParams.get('platforms') as Platform]
        : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      sort: (searchParams.get('sort') as 'createdAt' | 'scheduledAt' | 'publishedAt') || 'createdAt',
      order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
    };

    const postiz = getPostizClient();
    const result = await postiz.posts.listPosts(params);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    const { success, error: errorData, statusCode } = formatErrorResponse(
      error,
      'Failed to fetch posts'
    );
    return NextResponse.json({ success, error: errorData }, { status: statusCode });
  }
}

/**
 * POST /api/posts
 * Create a new post with auto account selection
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 사용자 인증 확인
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Login required',
          },
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { isDraft, ...postData } = body;
    const platforms: Platform[] = postData.platforms || [];

    // 2. 각 플랫폼별로 사용자의 연결된 계정 찾기
    const userAccounts = await prisma.socialAccount.findMany({
      where: {
        userId: session.user.id,
        platform: { in: platforms.map(p => p.toString()) },
        isActive: true,
      },
    });

    // 3. 플랫폼별 기본 계정 선택
    const accountsByPlatform = platforms.map((platform) => {
      const accounts = userAccounts.filter((acc) => acc.platform === platform);

      if (accounts.length === 0) {
        throw new Error(
          `${platform} 계정이 연결되지 않았습니다. 설정에서 계정을 먼저 연결해주세요.`
        );
      }

      return accounts.find((acc) => acc.isPrimary) || accounts[0];
    });

    const postiz = getPostizClient();

    // 4. 각 계정으로 포스트 발행
    const results = await Promise.all(
      accountsByPlatform.map((account) =>
        postiz.integrations.createPostWithIntegration(
          account.postizIntegrationId,
          {
            content: postData.content,
            platforms: [account.platform as Platform],
            media: postData.media,
            scheduledAt: isDraft ? undefined : postData.scheduledAt,
            tags: postData.tags,
            mentions: postData.mentions,
          }
        )
      )
    );

    return NextResponse.json({
      success: true,
      data: {
        message: `${platforms.length}개 플랫폼에 포스트가 발행되었습니다`,
        platforms: platforms,
        accounts: accountsByPlatform.map((acc) => ({
          platform: acc.platform,
          accountName: acc.accountName,
        })),
        results,
      },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    const { success, error: errorData, statusCode } = formatErrorResponse(
      error,
      'Failed to create post'
    );
    return NextResponse.json({ success, error: errorData }, { status: statusCode });
  }
}
