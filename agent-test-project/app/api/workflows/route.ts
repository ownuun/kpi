import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { WorkflowSchema } from '@/lib/validations/workflow';
import { n8nClient } from '@/lib/n8n/client';
import { z } from 'zod';

/**
 * GET /api/workflows
 * List workflows
 * 
 * Query parameters:
 * - status: Filter by status
 * - trigger: Filter by trigger type
 * - limit: Number of results (default: 20, max: 100)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const status = searchParams.get('status');
    const trigger = searchParams.get('trigger');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (trigger) {
      where.trigger = trigger;
    }

    const workflows = await prisma.workflow.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        executions: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Include last 5 executions
        },
      },
    });

    return NextResponse.json(workflows);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workflows
 * Create a new workflow
 * 
 * Optionally creates the workflow in n8n if n8nWorkflowId is not provided
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = WorkflowSchema.parse(body);

    // If n8nWorkflowId is provided, verify it exists in n8n
    let n8nWorkflowId = validated.n8nWorkflowId;
    let webhookUrl = validated.webhookUrl;

    if (n8nWorkflowId) {
      try {
        await n8nClient.getWorkflow(n8nWorkflowId);
      } catch (error) {
        return NextResponse.json(
          { error: 'n8n workflow not found' },
          { status: 404 }
        );
      }
    } else {
      // Create workflow in n8n
      try {
        const n8nWorkflow = await n8nClient.createWorkflow({
          name: validated.name,
          nodes: [], // Empty workflow, to be configured in n8n UI
          connections: {},
          active: false,
        });

        n8nWorkflowId = n8nWorkflow.id;
        
        // Generate webhook URL if webhook node exists
        // In a real implementation, you'd need to parse the workflow and find webhook nodes
        webhookUrl = `${process.env.N8N_API_URL?.replace('/api/v1', '')}/webhook/${n8nWorkflowId}`;
      } catch (error) {
        console.error('Failed to create n8n workflow:', error);
        // Continue without n8n integration
      }
    }

    const workflow = await prisma.workflow.create({
      data: {
        name: validated.name,
        description: validated.description,
        trigger: validated.trigger,
        status: validated.status,
        config: validated.config,
        n8nWorkflowId,
        webhookUrl,
      },
    });

    return NextResponse.json(workflow, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
