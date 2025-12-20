/**
 * OAuth Config Management API
 *
 * Allows administrators to configure OAuth credentials through UI
 * GET /api/admin/oauth-config - List all OAuth configs
 * POST /api/admin/oauth-config - Create or update OAuth config
 * DELETE /api/admin/oauth-config?platform={platform} - Delete OAuth config
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { SocialPlatform } from '@prisma/client';
import { encryptToken, decryptToken } from '@/lib/social/oauth/encryption';

/**
 * GET - Retrieve all OAuth configurations
 */
export async function GET(request: NextRequest) {
  try {
    const configs = await prisma.oAuthConfig.findMany({
      orderBy: {
        platform: 'asc',
      },
    });

    // Return decrypted credentials for editing
    const decryptedConfigs = configs.map((config) => ({
      id: config.id,
      platform: config.platform,
      clientId: decryptToken(config.clientId),
      clientSecret: decryptToken(config.clientSecret),
      isActive: config.isActive,
      config: config.config ? JSON.parse(config.config) : null,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      configs: decryptedConfigs,
    });
  } catch (error: any) {
    console.error('[OAuth Config] GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch OAuth configurations',
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Create or update OAuth configuration
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, clientId, clientSecret, isActive, config } = body;

    // Validate required fields
    if (!platform || !clientId || !clientSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Platform, clientId, and clientSecret are required',
        },
        { status: 400 }
      );
    }

    // Validate platform
    if (!Object.values(SocialPlatform).includes(platform as SocialPlatform)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid platform',
        },
        { status: 400 }
      );
    }

    // Encrypt credentials before storing
    const encryptedClientId = encryptToken(clientId);
    const encryptedClientSecret = encryptToken(clientSecret);

    // Upsert configuration
    const oauthConfig = await prisma.oAuthConfig.upsert({
      where: {
        platform: platform as SocialPlatform,
      },
      create: {
        platform: platform as SocialPlatform,
        clientId: encryptedClientId,
        clientSecret: encryptedClientSecret,
        isActive: isActive !== undefined ? isActive : true,
        config: config ? JSON.stringify(config) : null,
      },
      update: {
        clientId: encryptedClientId,
        clientSecret: encryptedClientSecret,
        isActive: isActive !== undefined ? isActive : true,
        config: config ? JSON.stringify(config) : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `OAuth configuration for ${platform} saved successfully`,
      config: {
        id: oauthConfig.id,
        platform: oauthConfig.platform,
        isActive: oauthConfig.isActive,
      },
    });
  } catch (error: any) {
    console.error('[OAuth Config] POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to save OAuth configuration',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete OAuth configuration
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform');

    if (!platform) {
      return NextResponse.json(
        {
          success: false,
          error: 'Platform parameter is required',
        },
        { status: 400 }
      );
    }

    // Validate platform
    if (!Object.values(SocialPlatform).includes(platform as SocialPlatform)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid platform',
        },
        { status: 400 }
      );
    }

    await prisma.oAuthConfig.delete({
      where: {
        platform: platform as SocialPlatform,
      },
    });

    return NextResponse.json({
      success: true,
      message: `OAuth configuration for ${platform} deleted successfully`,
    });
  } catch (error: any) {
    console.error('[OAuth Config] DELETE error:', error);

    // Handle not found error
    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          error: 'OAuth configuration not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete OAuth configuration',
      },
      { status: 500 }
    );
  }
}
