import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { WorkflowUpdateSchema } from '@/lib/validations/workflow';
import { n8nClient } from '@/lib/n8n/client';
import { z } from 'zod';

/**
 * GET /api/workflows/[id]
 * Get a single workflow
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const includeExecutions = request.nextUrl.searchParams.get('includeExecutions') === 'true';

    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: includeExecutions ? {
        executions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      } : undefined,
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(workflow);
  } catch (error) {
    console.error('Error fetching workflow:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/workflows/[id]
 * Update a workflow
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = WorkflowUpdateSchema.parse(body);

    const existing = await prisma.workflow.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // If status is being changed to ACTIVE, activate in n8n
    if (validated.status === 'ACTIVE' && existing.n8nWorkflowId) {
      try {
        await n8nClient.activateWorkflow(existing.n8nWorkflowId);
      } catch (error) {
        console.error('Failed to activate n8n workflow:', error);
        return NextResponse.json(
          { error: 'Failed to activate workflow in n8n' },
          { status: 500 }
        );
      }
    }

    // If status is being changed to INACTIVE, deactivate in n8n
    if (validated.status === 'INACTIVE' && existing.n8nWorkflowId) {
      try {
        await n8nClient.deactivateWorkflow(existing.n8nWorkflowId);
      } catch (error) {
        console.error('Failed to deactivate n8n workflow:', error);
      }
    }

    const workflow = await prisma.workflow.update({
      where: { id },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.trigger && { trigger: validated.trigger }),
        ...(validated.status && { status: validated.status }),
        ...(validated.config !== undefined && { config: validated.config }),
        ...(validated.n8nWorkflowId !== undefined && { n8nWorkflowId: validated.n8nWorkflowId }),
        ...(validated.webhookUrl !== undefined && { webhookUrl: validated.webhookUrl }),
      },
    });

    return NextResponse.json(workflow);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating workflow:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/workflows/[id]
 * Delete a workflow
 * 
 * Also deletes the workflow in n8n if n8nWorkflowId exists
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: {
        _count: {
          select: { executions: true },
        },
      },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Delete from n8n if exists
    if (workflow.n8nWorkflowId) {
      try {
        await n8nClient.deleteWorkflow(workflow.n8nWorkflowId);
      } catch (error) {
        console.error('Failed to delete n8n workflow:', error);
        // Continue with local deletion even if n8n deletion fails
      }
    }

    await prisma.workflow.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Workflow deleted successfully',
      id,
      deletedExecutions: workflow._count.executions,
    });
  } catch (error) {
    console.error('Error deleting workflow:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
