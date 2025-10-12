import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, projects, resources, posts, endorsements } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { checkNewBadges, getBadgeById } from '@/lib/badges';

export async function POST(request: NextRequest) {
  try {
    const userId = parseInt(request.url.split('/')[request.url.split('/').length - 2]);
    const { xpAmount, action } = await request.json();

    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    if (!xpAmount || xpAmount <= 0) {
      return NextResponse.json({ error: 'Invalid XP amount' }, { status: 400 });
    }

    // Get current user data
    const userRecord = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (userRecord.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userRecord[0];
    const currentXP = user.xp || 0;
    const newXP = currentXP + xpAmount;
    const currentBadges = Array.isArray(user.badges) ? user.badges : [];

    // Get user stats for badge checking
    const [projectsCount, resourcesCount, postsCount, endorsementsCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(projects).where(eq(projects.ownerId, userId)),
      db.select({ count: sql<number>`count(*)` }).from(resources).where(eq(resources.createdBy, userId)),
      db.select({ count: sql<number>`count(*)` }).from(posts).where(eq(posts.userId, userId)),
      db.select({ count: sql<number>`count(*)` }).from(endorsements).where(eq(endorsements.userId, userId))
    ]);

    const userStats = {
      xp: newXP,
      projectsCreated: Number(projectsCount[0]?.count || 0),
      tasksCompleted: 0, // Will be tracked separately
      resourcesShared: Number(resourcesCount[0]?.count || 0),
      endorsementsReceived: Number(endorsementsCount[0]?.count || 0),
      postsCreated: Number(postsCount[0]?.count || 0)
    };

    // Check for new badges
    const newBadges = checkNewBadges(currentBadges, userStats);
    const newBadgeIds = newBadges.map(b => b.id);
    const updatedBadges = [...currentBadges, ...newBadgeIds];

    // Update user XP and badges
    await db.update(users)
      .set({
        xp: newXP,
        badges: updatedBadges,
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.id, userId));

    return NextResponse.json({
      success: true,
      xpAwarded: xpAmount,
      newXP,
      newBadges: newBadges.map(b => ({
        id: b.id,
        name: b.name,
        description: b.description,
        icon: b.icon
      })),
      action
    });
  } catch (error) {
    console.error('XP award error:', error);
    return NextResponse.json({ error: 'Failed to award XP' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = parseInt(request.url.split('/')[request.url.split('/').length - 2]);

    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const userRecord = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (userRecord.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userRecord[0];
    const badges = Array.isArray(user.badges) ? user.badges : [];
    const badgeDetails = badges.map(badgeId => getBadgeById(badgeId)).filter(b => b !== undefined);

    return NextResponse.json({
      xp: user.xp || 0,
      badges: badgeDetails
    });
  } catch (error) {
    console.error('Get XP error:', error);
    return NextResponse.json({ error: 'Failed to get XP data' }, { status: 500 });
  }
}