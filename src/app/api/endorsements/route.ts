import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { endorsements } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { XP_REWARDS } from '@/lib/badges';

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
    const { userId, endorsedBy, skill } = await request.json();
    
    if (!userId || !endorsedBy || !skill) {
      return NextResponse.json({ 
        error: "userId, endorsedBy, and skill are required", 
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }

    // Check for self-endorsement
    if (parseInt(userId) === parseInt(endorsedBy)) {
      return NextResponse.json({ 
        error: "Cannot endorse yourself", 
        code: "SELF_ENDORSEMENT" 
      }, { status: 400 });
    }

    if (!skill.trim()) {
      return NextResponse.json({ 
        error: "Skill cannot be empty", 
        code: "EMPTY_SKILL" 
      }, { status: 400 });
    }

    // Check for duplicate endorsement
    const existing = await db.select()
      .from(endorsements)
      .where(
        and(
          eq(endorsements.userId, parseInt(userId)),
          eq(endorsements.endorsedBy, parseInt(endorsedBy)),
          eq(endorsements.skill, skill.trim())
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ 
        error: "This endorsement already exists", 
        code: "DUPLICATE_ENDORSEMENT" 
      }, { status: 400 });
    }
    
    const newRecord = await db.insert(endorsements).values({
      userId: parseInt(userId),
      endorsedBy: parseInt(endorsedBy),
      skill: skill.trim(),
      createdAt: new Date().toISOString(),
    }).returning();
    
    // Award XP for receiving an endorsement
    try {
      await fetch(`${request.nextUrl.origin}/api/users/${userId}/xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xpAmount: XP_REWARDS.ENDORSEMENT_RECEIVED,
          action: 'endorsement_received'
        })
      });
    } catch (error) {
      console.error('Failed to award XP:', error);
    }
    
    return NextResponse.json({
      ...newRecord[0],
      xpAwarded: XP_REWARDS.ENDORSEMENT_RECEIVED
    }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}