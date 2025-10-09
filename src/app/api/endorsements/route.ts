import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { endorsements, users } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const endorsedBy = searchParams.get('endorsedBy');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = db.select().from(endorsements);

    const conditions = [];

    if (userId) {
      const userIdNum = parseInt(userId);
      if (isNaN(userIdNum)) {
        return NextResponse.json(
          { error: 'Invalid userId parameter', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(endorsements.userId, userIdNum));
    }

    if (endorsedBy) {
      const endorsedByNum = parseInt(endorsedBy);
      if (isNaN(endorsedByNum)) {
        return NextResponse.json(
          { error: 'Invalid endorsedBy parameter', code: 'INVALID_ENDORSED_BY' },
          { status: 400 }
        );
      }
      conditions.push(eq(endorsements.endorsedBy, endorsedByNum));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(endorsements.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
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
    const { userId, endorsedBy, skill } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!endorsedBy) {
      return NextResponse.json(
        { error: 'endorsedBy is required', code: 'MISSING_ENDORSED_BY' },
        { status: 400 }
      );
    }

    if (!skill || typeof skill !== 'string' || skill.trim() === '') {
      return NextResponse.json(
        { error: 'skill is required and cannot be empty', code: 'MISSING_SKILL' },
        { status: 400 }
      );
    }

    const userIdNum = parseInt(userId);
    const endorsedByNum = parseInt(endorsedBy);

    if (isNaN(userIdNum)) {
      return NextResponse.json(
        { error: 'userId must be a valid integer', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    if (isNaN(endorsedByNum)) {
      return NextResponse.json(
        { error: 'endorsedBy must be a valid integer', code: 'INVALID_ENDORSED_BY' },
        { status: 400 }
      );
    }

    if (userIdNum === endorsedByNum) {
      return NextResponse.json(
        { error: 'Cannot endorse yourself', code: 'SELF_ENDORSEMENT_NOT_ALLOWED' },
        { status: 400 }
      );
    }

    const userCheck = await db
      .select()
      .from(users)
      .where(eq(users.id, userIdNum))
      .limit(1);

    if (userCheck.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 400 }
      );
    }

    const endorserCheck = await db
      .select()
      .from(users)
      .where(eq(users.id, endorsedByNum))
      .limit(1);

    if (endorserCheck.length === 0) {
      return NextResponse.json(
        { error: 'Endorser not found', code: 'ENDORSER_NOT_FOUND' },
        { status: 400 }
      );
    }

    const newEndorsement = await db
      .insert(endorsements)
      .values({
        userId: userIdNum,
        endorsedBy: endorsedByNum,
        skill: skill.trim(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newEndorsement[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}