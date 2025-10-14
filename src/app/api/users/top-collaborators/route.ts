import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const topCollaborators = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      xp: users.xp,
      badges: users.badges,
      avatar: users.avatar,
      bio: users.bio,
      skills: users.skills,
    })
      .from(users)
      .orderBy(desc(users.xp))
      .limit(10);

    return NextResponse.json(topCollaborators, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error,
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}