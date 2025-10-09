import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

// GET handler - Get notifications for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required", 
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }
    
    let query = db.select().from(notifications);
    
    if (unreadOnly) {
      query = query.where(
        and(
          eq(notifications.userId, parseInt(userId)),
          eq(notifications.read, false)
        )
      );
    } else {
      query = query.where(eq(notifications.userId, parseInt(userId)));
    }
    
    const records = await query
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);
    
    return NextResponse.json(records);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

// POST handler - Create notification
export async function POST(request: NextRequest) {
  try {
    const { userId, type, message } = await request.json();
    
    if (!userId || !type || !message) {
      return NextResponse.json({ 
        error: "userId, type, and message are required", 
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }

    if (!type.trim() || !message.trim()) {
      return NextResponse.json({ 
        error: "Type and message cannot be empty", 
        code: "EMPTY_FIELDS" 
      }, { status: 400 });
    }
    
    const newRecord = await db.insert(notifications).values({
      userId: parseInt(userId),
      type: type.trim(),
      message: message.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    }).returning();
    
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}