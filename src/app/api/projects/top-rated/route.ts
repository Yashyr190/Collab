import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { desc, gt } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const topRatedProjects = await db
      .select({
        id: projects.id,
        ownerId: projects.ownerId,
        title: projects.title,
        description: projects.description,
        status: projects.status,
        members: projects.members,
        progress: projects.progress,
        averageRating: projects.average_rating,
        totalRatings: projects.total_ratings,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .where(gt(projects.total_ratings, 0))
      .orderBy(desc(projects.average_rating), desc(projects.total_ratings))
      .limit(6);

    return NextResponse.json(topRatedProjects, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}