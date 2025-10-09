import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { messages, users } from '@/db/schema';
import { eq, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userIdParam = searchParams.get('userId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = db.select().from(messages);

    if (userIdParam) {
      const userId = parseInt(userIdParam);
      if (isNaN(userId)) {
        return NextResponse.json(
          { 
            error: 'Invalid userId parameter',
            code: 'INVALID_USER_ID' 
          },
          { status: 400 }
        );
      }

      query = query.where(
        or(
          eq(messages.senderId, userId),
          eq(messages.receiverId, userId)
        )
      );
    }

    const results = await query
      .orderBy(desc(messages.timestamp))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, receiverId, conversationId, text } = body;

    if (!senderId) {
      return NextResponse.json(
        { 
          error: 'senderId is required',
          code: 'MISSING_SENDER_ID' 
        },
        { status: 400 }
      );
    }

    if (!receiverId) {
      return NextResponse.json(
        { 
          error: 'receiverId is required',
          code: 'MISSING_RECEIVER_ID' 
        },
        { status: 400 }
      );
    }

    if (!conversationId) {
      return NextResponse.json(
        { 
          error: 'conversationId is required',
          code: 'MISSING_CONVERSATION_ID' 
        },
        { status: 400 }
      );
    }

    if (!text) {
      return NextResponse.json(
        { 
          error: 'text is required',
          code: 'MISSING_TEXT' 
        },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return NextResponse.json(
        { 
          error: 'text cannot be empty',
          code: 'EMPTY_TEXT' 
        },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(senderId))) {
      return NextResponse.json(
        { 
          error: 'senderId must be a valid integer',
          code: 'INVALID_SENDER_ID' 
        },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(receiverId))) {
      return NextResponse.json(
        { 
          error: 'receiverId must be a valid integer',
          code: 'INVALID_RECEIVER_ID' 
        },
        { status: 400 }
      );
    }

    const sender = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(senderId)))
      .limit(1);

    if (sender.length === 0) {
      return NextResponse.json(
        { 
          error: 'Sender user not found',
          code: 'SENDER_NOT_FOUND' 
        },
        { status: 400 }
      );
    }

    const receiver = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(receiverId)))
      .limit(1);

    if (receiver.length === 0) {
      return NextResponse.json(
        { 
          error: 'Receiver user not found',
          code: 'RECEIVER_NOT_FOUND' 
        },
        { status: 400 }
      );
    }

    const newMessage = await db.insert(messages)
      .values({
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        conversationId: conversationId.trim(),
        text: trimmedText,
        isRead: false,
        timestamp: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newMessage[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}