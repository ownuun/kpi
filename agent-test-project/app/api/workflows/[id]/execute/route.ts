import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { WorkflowExecuteSchema } from '@/lib/validations/workflow';
import { n8nClient } from '@/lib/n8n/client';
import { z } from 'zod';

/**
 * POST /api/workflows/[id]/execute
 * Execute a workflow
 * 
 * Body:
 * - input: Optional input data for the workflow (JSON object)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = WorkflowExecuteSchema.parse(body);

    const workflow = await prisma.workflow.findUnique({
      where: { id },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    if (workflow.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Workflow is not active' },
        { status: 400 }
      );
    }

    // Create execution record
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId: id,
        status: 'PENDING',
        input: validated.input ? JSON.stringify(validated.input) : null,
        startedAt: new Date(),
      },
    });

    // Execute in n8n if integrated
    if (workflow.n8nWorkflowId) {
      try {
        const n8nExecution = await n8nClient.executeWorkflow(
          workflow.n8nWorkflowId,
          validated.input
        );

        // Update execution with n8n execution ID
        await prisma.workflowExecution.update({
          where: { id: execution.id },
          data: {
            status: 'RUNNING',
            n8nExecutionId: n8nExecution.id,
          },
        });

        // Update workflow stats
        await prisma.workflow.update({
          where: { id },
          data: {
            executionCount: { increment: 1 },
            lastExecutedAt: new Date(),
          },
        });

        return NextResponse.json({
          execution: {
            ...execution,
            status: 'RUNNING',
            n8nExecutionId: n8nExecution.id,
          },
          message: 'Workflow execution started',
        });
      } catch (error) {
        console.error('Failed to execute n8n workflow:', error);

        // Update execution as failed
        await prisma.workflowExecution.update({
          where: { id: execution.id },
          data: {
            status: 'FAILED',
            error: error instanceof Error ? error.message : 'Unknown error',
            completedAt: new Date(),
          },
        });

        return NextResponse.json(
          { error: 'Failed to execute workflow in n8n' },
          { status: 500 }
        );
      }
    } else {
      // Simulate execution without n8n
      await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: 'SUCCESS',
          completedAt: new Date(),
          duration: 1000, // 1 second simulated
          output: JSON.stringify({ simulated: true }),
        },
      });

      // Update workflow stats
      await prisma.workflow.update({
        where: { id },
        data: {
          executionCount: { increment: 1 },
          lastExecutedAt: new Date(),
        },
      });

      return NextResponse.json({
        execution,
        message: 'Workflow executed (simulated)',
        warning: 'No n8n integration configured',
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error executing workflow:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
