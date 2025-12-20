import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * PATCH /api/sns/[id] - Update post
 * Body: Partial post data
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if post exists
    const existingPost = await prisma.snsPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'SNS post not found' },
        { status: 404 }
      );
    }

    // If businessLineId is being updated, verify it exists
    if (body.businessLineId && body.businessLineId !== existingPost.businessLineId) {
      const businessLine = await prisma.businessLine.findUnique({
        where: { id: body.businessLineId },
      });

      if (!businessLine) {
        return NextResponse.json(
          { success: false, error: 'Business line not found' },
          { status: 404 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (body.platform !== undefined) updateData.platform = body.platform;
    if (body.postId !== undefined) updateData.postId = body.postId;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.mediaUrls !== undefined) {
      updateData.mediaUrls = body.mediaUrls ? JSON.stringify(body.mediaUrls) : null;
    }
    if (body.publishedAt !== undefined) updateData.publishedAt = new Date(body.publishedAt);
    if (body.utmSource !== undefined) updateData.utmSource = body.utmSource;
    if (body.utmMedium !== undefined) updateData.utmMedium = body.utmMedium;
    if (body.utmCampaign !== undefined) updateData.utmCampaign = body.utmCampaign;
    if (body.views !== undefined) updateData.views = body.views;
    if (body.likes !== undefined) updateData.likes = body.likes;
    if (body.comments !== undefined) updateData.comments = body.comments;
    if (body.shares !== undefined) updateData.shares = body.shares;
    if (body.clicks !== undefined) updateData.clicks = body.clicks;
    if (body.businessLineId !== undefined) updateData.businessLineId = body.businessLineId;

    // Update post
    const post = await prisma.snsPost.update({
      where: { id },
      data: updateData,
      include: {
        businessLine: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        landingVisits: {
          select: {
            id: true,
            convertedToLead: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Error updating SNS post:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update SNS post',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sns/[id] - Delete post
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if post exists
    const existingPost = await prisma.snsPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'SNS post not found' },
        { status: 404 }
      );
    }

    // Delete post (cascade will handle related records)
    await prisma.snsPost.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'SNS post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting SNS post:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete SNS post',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
