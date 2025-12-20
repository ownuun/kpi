import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const EmailConfigSchema = z.object({
  resendApiKey: z.string().min(1).startsWith('re_', {
    message: 'Resend API 키는 "re_"로 시작해야 합니다.'
  }),
  isActive: z.boolean().default(true),
});

// GET: Retrieve email configuration
export async function GET() {
  try {
    const config = await prisma.emailConfig.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ config });
  } catch (error) {
    console.error('Error fetching email config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email configuration' },
      { status: 500 }
    );
  }
}

// POST: Create or update email configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = EmailConfigSchema.parse(body);

    // Check if config already exists
    const existingConfig = await prisma.emailConfig.findFirst();

    let config;
    if (existingConfig) {
      // Update existing config
      config = await prisma.emailConfig.update({
        where: { id: existingConfig.id },
        data: {
          resendApiKey: validated.resendApiKey,
          isActive: validated.isActive,
        },
      });
    } else {
      // Create new config
      config = await prisma.emailConfig.create({
        data: {
          resendApiKey: validated.resendApiKey,
          isActive: validated.isActive,
        },
      });
    }

    // Update environment variable (for current runtime)
    process.env.RESEND_API_KEY = validated.resendApiKey;

    return NextResponse.json({
      config,
      message: 'Email configuration saved successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error saving email config:', error);
    return NextResponse.json(
      { error: 'Failed to save email configuration' },
      { status: 500 }
    );
  }
}

// DELETE: Remove email configuration
export async function DELETE() {
  try {
    const existingConfig = await prisma.emailConfig.findFirst();

    if (!existingConfig) {
      return NextResponse.json(
        { error: 'No configuration found' },
        { status: 404 }
      );
    }

    await prisma.emailConfig.delete({
      where: { id: existingConfig.id },
    });

    // Clear environment variable
    delete process.env.RESEND_API_KEY;

    return NextResponse.json({
      message: 'Email configuration deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting email config:', error);
    return NextResponse.json(
      { error: 'Failed to delete email configuration' },
      { status: 500 }
    );
  }
}
