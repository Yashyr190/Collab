import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface Activity {
  id: number;
  userId: number;
  action: string;
  description: string;
  timestamp: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    // Validate project ID
    if (!projectId || isNaN(parseInt(projectId))) {
      return NextResponse.json(
        { error: 'Valid project ID is required', code: 'INVALID_PROJECT_ID' },
        { status: 400 }
      );
    }

    // Get project from database
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(projectId)))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json(
        { error: 'Project not found', code: 'PROJECT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Get activities array from project (default to empty array if null)
    let activities: Activity[] = [];
    
    if (project[0].activities) {
      if (typeof project[0].activities === 'string') {
        try {
          activities = JSON.parse(project[0].activities);
        } catch (e) {
          activities = [];
        }
      } else {
        activities = project[0].activities as Activity[];
      }
    }

    // Sort activities by timestamp descending (newest first)
    const sortedActivities = [...activities].sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return NextResponse.json(sortedActivities, { status: 200 });
  } catch (error) {
    console.error('GET /api/projects/[id]/activity error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    // Validate project ID
    if (!projectId || isNaN(parseInt(projectId))) {
      return NextResponse.json(
        { error: 'Valid project ID is required', code: 'INVALID_PROJECT_ID' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { userId, action, description, timestamp } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (typeof userId !== 'number') {
      return NextResponse.json(
        { error: 'userId must be a number', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    if (!action || typeof action !== 'string' || action.trim() === '') {
      return NextResponse.json(
        { error: 'action is required and must be a non-empty string', code: 'MISSING_ACTION' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return NextResponse.json(
        { error: 'description is required and must be a non-empty string', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    // Get project from database
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(projectId)))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json(
        { error: 'Project not found', code: 'PROJECT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Get current activities array (default to empty array if null)
    let currentActivities: Activity[] = [];
    
    if (project[0].activities) {
      if (typeof project[0].activities === 'string') {
        try {
          currentActivities = JSON.parse(project[0].activities);
        } catch (e) {
          currentActivities = [];
        }
      } else {
        currentActivities = project[0].activities as Activity[];
      }
    }

    // Generate new activity ID
    const maxId = currentActivities.length > 0
      ? Math.max(...currentActivities.map(a => a.id))
      : 0;
    const newActivityId = maxId + 1;

    // Create new activity object
    const newActivity: Activity = {
      id: newActivityId,
      userId: userId,
      action: action.trim(),
      description: description.trim(),
      timestamp: timestamp || new Date().toISOString()
    };

    // Prepend new activity to array (newest first)
    const updatedActivities = [newActivity, ...currentActivities];

    // Update project with new activities array as JSON string
    const updated = await db
      .update(projects)
      .set({
        activities: JSON.stringify(updatedActivities),
        updatedAt: new Date().toISOString()
      })
      .where(eq(projects.id, parseInt(projectId)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update project', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error('POST /api/projects/[id]/activity error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}