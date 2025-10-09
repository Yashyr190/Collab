import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, users } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const ownerId = searchParams.get('ownerId');
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Single project by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, parseInt(id)))
        .limit(1);

      if (project.length === 0) {
        return NextResponse.json(
          { error: 'Project not found', code: 'PROJECT_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(project[0], { status: 200 });
    }

    // List projects with filters
    let query = db.select().from(projects);
    const conditions = [];

    if (ownerId) {
      if (isNaN(parseInt(ownerId))) {
        return NextResponse.json(
          { error: 'Valid ownerId is required', code: 'INVALID_OWNER_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(projects.ownerId, parseInt(ownerId)));
    }

    if (status) {
      const validStatuses = ['planning', 'active', 'completed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { 
            error: 'Invalid status. Must be one of: planning, active, completed', 
            code: 'INVALID_STATUS' 
          },
          { status: 400 }
        );
      }
      conditions.push(eq(projects.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(projects.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, ownerId, members, tasks, status, progress } = body;

    // Validate required fields
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required', code: 'MISSING_OWNER_ID' },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(ownerId))) {
      return NextResponse.json(
        { error: 'Valid owner ID is required', code: 'INVALID_OWNER_ID' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['planning', 'active', 'completed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { 
            error: 'Invalid status. Must be one of: planning, active, completed', 
            code: 'INVALID_STATUS' 
          },
          { status: 400 }
        );
      }
    }

    // Validate progress if provided
    if (progress !== undefined) {
      const progressNum = parseInt(progress);
      if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
        return NextResponse.json(
          { 
            error: 'Progress must be a number between 0 and 100', 
            code: 'INVALID_PROGRESS' 
          },
          { status: 400 }
        );
      }
    }

    // Verify owner exists in users table
    const owner = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(ownerId)))
      .limit(1);

    if (owner.length === 0) {
      return NextResponse.json(
        { error: 'Owner not found', code: 'OWNER_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const now = new Date().toISOString();
    const insertData = {
      title: title.trim(),
      description: description?.trim() || null,
      ownerId: parseInt(ownerId),
      members: members || [],
      tasks: tasks || [],
      status: status || 'planning',
      progress: progress !== undefined ? parseInt(progress) : 0,
      createdAt: now,
      updatedAt: now,
    };

    // Insert project
    const newProject = await db
      .insert(projects)
      .values(insertData)
      .returning();

    return NextResponse.json(newProject[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}