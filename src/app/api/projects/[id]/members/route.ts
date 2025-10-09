import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Extract project ID from URL path
    const projectId = request.url.split('/').slice(-2, -1)[0];
    
    if (!projectId || isNaN(parseInt(projectId))) {
      return NextResponse.json({ 
        error: "Valid project ID is required",
        code: "INVALID_PROJECT_ID" 
      }, { status: 400 });
    }

    // Parse request body
    const body = await request.json();
    const { userId } = body;

    // Validate userId is provided
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    // Validate userId is a valid number
    if (isNaN(parseInt(userId.toString()))) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    const userIdNum = parseInt(userId.toString());

    // Check if project exists
    const project = await db.select()
      .from(projects)
      .where(eq(projects.id, parseInt(projectId)))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ 
        error: 'Project not found',
        code: "PROJECT_NOT_FOUND" 
      }, { status: 404 });
    }

    // Validate user exists
    const user = await db.select()
      .from(users)
      .where(eq(users.id, userIdNum))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: "USER_NOT_FOUND" 
      }, { status: 404 });
    }

    // Get current members array
    const currentMembers = (project[0].members as number[]) || [];

    // Check if user is already a member
    if (currentMembers.includes(userIdNum)) {
      return NextResponse.json({ 
        error: 'User is already a member of this project',
        code: "ALREADY_MEMBER" 
      }, { status: 400 });
    }

    // Add userId to members array
    const updatedMembers = [...currentMembers, userIdNum];

    // Update project with new member
    const updatedProject = await db.update(projects)
      .set({
        members: updatedMembers,
        updatedAt: new Date().toISOString()
      })
      .where(eq(projects.id, parseInt(projectId)))
      .returning();

    return NextResponse.json(updatedProject[0], { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Extract project ID from URL path
    const projectId = request.url.split('/').slice(-2, -1)[0];
    
    if (!projectId || isNaN(parseInt(projectId))) {
      return NextResponse.json({ 
        error: "Valid project ID is required",
        code: "INVALID_PROJECT_ID" 
      }, { status: 400 });
    }

    // Get userId from query params
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get('userId');

    // Validate userId is provided
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    // Validate userId is a valid number
    if (isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    const userIdNum = parseInt(userId);

    // Check if project exists
    const project = await db.select()
      .from(projects)
      .where(eq(projects.id, parseInt(projectId)))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ 
        error: 'Project not found',
        code: "PROJECT_NOT_FOUND" 
      }, { status: 404 });
    }

    // Get current members array
    const currentMembers = (project[0].members as number[]) || [];

    // Check if user is a member
    if (!currentMembers.includes(userIdNum)) {
      return NextResponse.json({ 
        error: 'User is not a member of this project',
        code: "NOT_MEMBER" 
      }, { status: 404 });
    }

    // Remove userId from members array
    const updatedMembers = currentMembers.filter(memberId => memberId !== userIdNum);

    // Update project with removed member
    const updatedProject = await db.update(projects)
      .set({
        members: updatedMembers,
        updatedAt: new Date().toISOString()
      })
      .where(eq(projects.id, parseInt(projectId)))
      .returning();

    return NextResponse.json(updatedProject[0], { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}