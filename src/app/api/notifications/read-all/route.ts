import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "Valid userId is required", 
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    const updatedRecords = await db.update(notifications)
      .set({ read: true })
      .where(
        and(
          eq(notifications.userId, parseInt(userId)),
          eq(notifications.read, false)
        )
      )
      .returning();

    return NextResponse.json({ 
      message: "All notifications marked as read", 
      updated: updatedRecords.length 
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}