import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Check if notification exists
    const existingNotification = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, parseInt(id)))
      .limit(1);

    if (existingNotification.length === 0) {
      return NextResponse.json(
        {
          error: 'Notification not found',
          code: 'NOTIFICATION_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Update notification isRead to true
    const updatedNotification = await db
      .update(notifications)
      .set({
        isRead: true,
      })
      .where(eq(notifications.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedNotification[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
      },
      { status: 500 }
    );
  }
}