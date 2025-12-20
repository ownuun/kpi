import { NextRequest, NextResponse } from 'next/server';

/**
 * PATCH /api/pipeline/[id]
 * Update lead (mock for now)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedLead = {
      id,
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedLead
    });

  } catch (error: any) {
    console.error('Failed to update lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update lead'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/pipeline/[id]
 * Delete lead (mock for now)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    return NextResponse.json({
      success: true,
      message: `Lead ${id} deleted successfully`
    });

  } catch (error: any) {
    console.error('Failed to delete lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete lead'
      },
      { status: 500 }
    );
  }
}
