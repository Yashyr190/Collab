import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate userId parameter
    const userIdParam = searchParams.get('userId');
    if (!userIdParam) {
      return NextResponse.json(
        { 
          error: 'userId parameter is required',
          code: 'MISSING_USER_ID'
        },
        { status: 400 }
      );
    }

    const userId = parseInt(userIdParam);
    if (isNaN(userId)) {
      return NextResponse.json(
        { 
          error: 'userId must be a valid integer',
          code: 'INVALID_USER_ID'
        },
        { status: 400 }
      );
    }

    // Parse pagination parameters
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const limit = limitParam ? Math.min(parseInt(limitParam), 100) : 20;
    const offset = offsetParam ? parseInt(offsetParam) : 0;

    // Validate limit and offset
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { 
          error: 'limit must be a positive integer',
          code: 'INVALID_LIMIT'
        },
        { status: 400 }
      );
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { 
          error: 'offset must be a non-negative integer',
          code: 'INVALID_OFFSET'
        },
        { status: 400 }
      );
    }

    // Parse unreadOnly parameter
    const unreadOnlyParam = searchParams.get('unreadOnly');
    const unreadOnly = unreadOnlyParam === 'true';

    // Build query with filters
    let whereCondition;
    if (unreadOnly) {
      whereCondition = and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      );
    } else {
      whereCondition = eq(notifications.userId, userId);
    }

    // Execute query
    const results = await db
      .select()
      .from(notifications)
      .where(whereCondition)
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET notifications error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}