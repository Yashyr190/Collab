import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, projectRatings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    // Validate project ID
    if (!projectId || isNaN(parseInt(projectId))) {
      return NextResponse.json(
        {
          error: 'Valid project ID is required',
          code: 'INVALID_PROJECT_ID'
        },
        { status: 400 }
      );
    }

    const parsedProjectId = parseInt(projectId);

    // Check if project exists
    const project = await db
      .select({
        id: projects.id,
        averageRating: projects.average_rating,
        totalRatings: projects.total_ratings
      })
      .from(projects)
      .where(eq(projects.id, parsedProjectId))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json(
        {
          error: 'Project not found',
          code: 'PROJECT_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const projectData = project[0];

    // Build response object
    const response: {
      averageRating: number;
      totalRatings: number;
      userRating?: number | null;
    } = {
      averageRating: projectData.averageRating || 0,
      totalRatings: projectData.totalRatings || 0
    };

    // If userId is provided, get user's rating
    if (userId) {
      const parsedUserId = parseInt(userId);
      
      if (!isNaN(parsedUserId)) {
        const userRatingRecord = await db
          .select({
            rating: projectRatings.rating
          })
          .from(projectRatings)
          .where(
            eq(projectRatings.projectId, parsedProjectId) &&
            eq(projectRatings.userId, parsedUserId)
          )
          .limit(1);

        response.userRating = userRatingRecord.length > 0 
          ? userRatingRecord[0].rating 
          : null;
      } else {
        response.userRating = null;
      }
    }

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('GET rating error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error
      },
      { status: 500 }
    );
  }
}