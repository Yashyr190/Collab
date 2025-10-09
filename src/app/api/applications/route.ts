import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { applications, projects, users } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

const VALID_STATUSES = ['pending', 'accepted', 'rejected'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const userIdParam = searchParams.get('userId');
    const projectIdParam = searchParams.get('projectId');
    const statusParam = searchParams.get('status');

    const conditions = [];

    if (userIdParam) {
      const userId = parseInt(userIdParam);
      if (isNaN(userId)) {
        return NextResponse.json({
          error: 'Invalid userId parameter',
          code: 'INVALID_USER_ID'
        }, { status: 400 });
      }
      conditions.push(eq(applications.userId, userId));
    }

    if (projectIdParam) {
      const projectId = parseInt(projectIdParam);
      if (isNaN(projectId)) {
        return NextResponse.json({
          error: 'Invalid projectId parameter',
          code: 'INVALID_PROJECT_ID'
        }, { status: 400 });
      }
      conditions.push(eq(applications.projectId, projectId));
    }

    if (statusParam) {
      if (!VALID_STATUSES.includes(statusParam)) {
        return NextResponse.json({
          error: 'Invalid status parameter',
          code: 'INVALID_STATUS'
        }, { status: 400 });
      }
      conditions.push(eq(applications.status, statusParam));
    }

    let query = db.select().from(applications);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(applications.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, userId, message, status } = body;

    if (!projectId) {
      return NextResponse.json({
        error: 'projectId is required',
        code: 'MISSING_PROJECT_ID'
      }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({
        error: 'userId is required',
        code: 'MISSING_USER_ID'
      }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({
        error: 'message is required',
        code: 'MISSING_MESSAGE'
      }, { status: 400 });
    }

    const parsedProjectId = parseInt(projectId);
    if (isNaN(parsedProjectId)) {
      return NextResponse.json({
        error: 'projectId must be a valid integer',
        code: 'INVALID_PROJECT_ID'
      }, { status: 400 });
    }

    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return NextResponse.json({
        error: 'userId must be a valid integer',
        code: 'INVALID_USER_ID'
      }, { status: 400 });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return NextResponse.json({
        error: 'message cannot be empty',
        code: 'EMPTY_MESSAGE'
      }, { status: 400 });
    }

    const project = await db.select()
      .from(projects)
      .where(eq(projects.id, parsedProjectId))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      }, { status: 400 });
    }

    const user = await db.select()
      .from(users)
      .where(eq(users.id, parsedUserId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      }, { status: 400 });
    }

    let applicationStatus = 'pending';
    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({
          error: 'Invalid status. Must be one of: pending, accepted, rejected',
          code: 'INVALID_STATUS'
        }, { status: 400 });
      }
      applicationStatus = status;
    }

    const now = new Date().toISOString();

    const newApplication = await db.insert(applications)
      .values({
        projectId: parsedProjectId,
        userId: parsedUserId,
        message: trimmedMessage,
        status: applicationStatus,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newApplication[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}