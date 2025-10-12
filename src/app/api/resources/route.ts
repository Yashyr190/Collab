import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { resources } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { XP_REWARDS } from '@/lib/badges';

export async function GET() {
  try {
    const allResources = await db.select().from(resources).orderBy(desc(resources.createdAt));
    return NextResponse.json(allResources);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, url, type, userId } = body;

    if (!title || !url || !userId) {
      return NextResponse.json({ 
        error: 'Title, URL, and userId are required' 
      }, { status: 400 });
    }

    const newResource = await db.insert(resources).values({
      title,
      description: description || '',
      category: category || 'general',
      type: type || 'article',
      url,
      upvotes: 0,
      createdBy: userId,
      createdAt: new Date().toISOString(),
    }).returning();

    // Award XP for sharing a resource
    try {
      await fetch(`${request.nextUrl.origin}/api/users/${userId}/xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xpAmount: XP_REWARDS.RESOURCE_SHARE,
          action: 'resource_share'
        })
      });
    } catch (error) {
      console.error('Failed to award XP:', error);
    }

    return NextResponse.json({ 
      ...newResource[0],
      xpAwarded: XP_REWARDS.RESOURCE_SHARE
    });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}