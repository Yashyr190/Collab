import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, projectRatings, users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    // Validate project ID
    if (!projectId || isNaN(parseInt(projectId))) {
      return NextResponse.json(
        {
          error: 'Valid project ID is required',
          code: 'INVALID_PROJECT_ID',
        },
        { status: 400 }
      );
    }

    const projectIdInt = parseInt(projectId);

    // Parse request body
    const body = await request.json();
    const { rating, userId } = body;

    // Validate required fields
    if (rating === undefined || userId === undefined) {
      return NextResponse.json(
        {
          error: 'Rating and userId are required',
          code: 'MISSING_REQUIRED_FIELDS',
        },
        { status: 400 }
      );
    }

    // Validate rating is an integer between 1 and 5
    const ratingInt = parseInt(rating);
    if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
      return NextResponse.json(
        {
          error: 'Rating must be an integer between 1 and 5',
          code: 'INVALID_RATING',
        },
        { status: 400 }
      );
    }

    // Validate userId is a valid integer
    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return NextResponse.json(
        {
          error: 'Valid user ID is required',
          code: 'INVALID_USER_ID',
        },
        { status: 400 }
      );
    }

    // Check if project exists
    const existingProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectIdInt))
      .limit(1);

    if (existingProject.length === 0) {
      return NextResponse.json(
        {
          error: 'Project not found',
          code: 'PROJECT_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userIdInt))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        {
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Check if user has already rated this project
    const existingRating = await db
      .select()
      .from(projectRatings)
      .where(
        sql`${projectRatings.projectId} = ${projectIdInt} AND ${projectRatings.userId} = ${userIdInt}`
      )
      .limit(1);

    let upsertedRating;

    if (existingRating.length > 0) {
      // UPDATE existing rating
      upsertedRating = await db
        .update(projectRatings)
        .set({
          rating: ratingInt,
        })
        .where(eq(projectRatings.id, existingRating[0].id))
        .returning();
    } else {
      // INSERT new rating
      upsertedRating = await db
        .insert(projectRatings)
        .values({
          projectId: projectIdInt,
          userId: userIdInt,
          rating: ratingInt,
          createdAt: new Date().toISOString(),
        })
        .returning();
    }

    // Recalculate project's average rating and total ratings
    const allRatings = await db
      .select()
      .from(projectRatings)
      .where(eq(projectRatings.projectId, projectIdInt));

    const totalRatings = allRatings.length;
    const sumRatings = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Update projects table with new average_rating and total_ratings
    const updatedProject = await db
      .update(projects)
      .set({
        average_rating: averageRating,
        total_ratings: totalRatings,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(projects.id, projectIdInt))
      .returning();

    // Return updated project with rating information
    return NextResponse.json(
      {
        ...updatedProject[0],
        averageRating: averageRating,
        totalRatings: totalRatings,
        userRating: ratingInt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/projects/[id]/rate error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
      },
      { status: 500 }
    );
  }
}