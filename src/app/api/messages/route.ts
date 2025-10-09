import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq, or, desc } from 'drizzle-orm';

// GET handler - Get messages for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required", 
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }
    
    const records = await db.select()
      .from(messages)
      .where(
        or(
          eq(messages.senderId, parseInt(userId)),
          eq(messages.receiverId, parseInt(userId))
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);
    
    return NextResponse.json(records);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

// POST handler - Send message
export async function POST(request: NextRequest) {
  try {
    const { senderId, receiverId, content } = await request.json();
    
    if (!senderId || !receiverId || !content) {
      return NextResponse.json({ 
        error: "senderId, receiverId, and content are required", 
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }

    if (!content.trim()) {
      return NextResponse.json({ 
        error: "Content cannot be empty", 
        code: "EMPTY_CONTENT" 
      }, { status: 400 });
    }
    
    const newRecord = await db.insert(messages).values({
      senderId: parseInt(senderId),
      receiverId: parseInt(receiverId),
      content: content.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    }).returning();
    
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}