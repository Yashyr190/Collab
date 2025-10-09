import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  try {
    const notificationId = request.url.split('/').slice(-2, -1)[0];
    
    if (!notificationId || isNaN(parseInt(notificationId))) {
      return NextResponse.json({ 
        error: "Valid notification ID is required", 
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const updatedRecord = await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, parseInt(notificationId)))
      .returning();
    
    if (updatedRecord.length === 0) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}