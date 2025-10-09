import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { endorsements } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const userId = request.url.split('/').pop();
    
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "Valid userId is required", 
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    const records = await db.select()
      .from(endorsements)
      .where(eq(endorsements.userId, parseInt(userId)))
      .orderBy(desc(endorsements.createdAt));

    return NextResponse.json(records);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}