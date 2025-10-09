import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { endorsements } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Validate userId is a valid integer
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(
        {
          error: 'Valid user ID is required',
          code: 'INVALID_USER_ID',
        },
        { status: 400 }
      );
    }

    const parsedUserId = parseInt(userId);

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      parseInt(searchParams.get('limit') || '20'),
      100
    );
    const offset = parseInt(searchParams.get('offset') || '0');

    // Query endorsements for the specified user
    const userEndorsements = await db
      .select()
      .from(endorsements)
      .where(eq(endorsements.userId, parsedUserId))
      .orderBy(desc(endorsements.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(userEndorsements, { status: 200 });
  } catch (error) {
    console.error('GET endorsements by user error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
      },
      { status: 500 }
    );
  }
}