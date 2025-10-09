import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);

    const records = await db.select({
      id: users.id,
      name: users.name,
      avatar: users.avatar,
      xp: users.xp,
      badges: users.badges,
      skills: users.skills,
    }).from(users).orderBy(desc(users.xp)).limit(limit);

    return NextResponse.json(records);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}