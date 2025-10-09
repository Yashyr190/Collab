import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { applications } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const application = await db
      .select()
      .from(applications)
      .where(eq(applications.id, parseInt(id)))
      .limit(1);

    if (application.length === 0) {
      return NextResponse.json(
        { error: 'Application not found', code: 'APPLICATION_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(application[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { message, status } = body;

    const validStatuses = ['pending', 'accepted', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    const existingApplication = await db
      .select()
      .from(applications)
      .where(eq(applications.id, parseInt(id)))
      .limit(1);

    if (existingApplication.length === 0) {
      return NextResponse.json(
        { error: 'Application not found', code: 'APPLICATION_NOT_FOUND' },
        { status: 404 }
      );
    }

    const updates: { message?: string; status?: string; updatedAt: string } = {
      updatedAt: new Date().toISOString(),
    };

    if (message !== undefined) {
      updates.message = message.trim();
    }

    if (status !== undefined) {
      updates.status = status;
    }

    if (!message && !status) {
      return NextResponse.json(
        { error: 'No valid update fields provided', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    const updated = await db
      .update(applications)
      .set(updates)
      .where(eq(applications.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const existingApplication = await db
      .select()
      .from(applications)
      .where(eq(applications.id, parseInt(id)))
      .limit(1);

    if (existingApplication.length === 0) {
      return NextResponse.json(
        { error: 'Application not found', code: 'APPLICATION_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(applications)
      .where(eq(applications.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Application deleted successfully',
        id: deleted[0].id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}