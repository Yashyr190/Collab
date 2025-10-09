import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq, or, and, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const otherUserId = request.url.split('/').pop();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ 
        error: "userId query parameter is required", 
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!otherUserId || isNaN(parseInt(otherUserId))) {
      return NextResponse.json({ 
        error: "Valid user ID in path is required", 
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const currentUserId = parseInt(userId);
    const otherUserIdNum = parseInt(otherUserId);

    const records = await db.select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, currentUserId), eq(messages.receiverId, otherUserIdNum)),
          and(eq(messages.senderId, otherUserIdNum), eq(messages.receiverId, currentUserId))
        )
      )
      .orderBy(asc(messages.createdAt));

    return NextResponse.json(records);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}