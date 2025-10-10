import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
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

    // Query project by ID
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

    // Return tasks array (default to empty array if null)
    const tasks = (project[0].tasks as Task[]) || [];

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error('GET tasks error:', error);
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
    const { title, description, status, assignedTo, dueDate } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and cannot be empty', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ['pending', 'in_progress', 'completed'];
    const taskStatus = status || 'pending';
    if (!validStatuses.includes(taskStatus)) {
      return NextResponse.json(
        {
          error: 'Status must be one of: pending, in_progress, completed',
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Validate assignedTo if provided
    if (assignedTo !== undefined && assignedTo !== null) {
      if (typeof assignedTo !== 'number' || isNaN(assignedTo)) {
        return NextResponse.json(
          { error: 'assignedTo must be a valid user ID', code: 'INVALID_ASSIGNED_TO' },
          { status: 400 }
        );
      }
    }

    // Query project by ID
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

    // Get current tasks array
    const currentTasks = (project[0].tasks as Task[]) || [];

    // Generate new task ID
    const maxId = currentTasks.length > 0 
      ? Math.max(...currentTasks.map((t: Task) => t.id))
      : 0;
    const newTaskId = maxId + 1;

    // Create new task object
    const timestamp = new Date().toISOString();
    const newTask: Task = {
      id: newTaskId,
      title: title.trim(),
      description: description?.trim(),
      status: taskStatus,
      assignedTo: assignedTo || undefined,
      dueDate: dueDate || undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Append new task to tasks array
    const updatedTasks = [...currentTasks, newTask];

    // Update project with new tasks array and updatedAt timestamp
    const updated = await db
      .update(projects)
      .set({
        tasks: updatedTasks as any,
        updatedAt: timestamp,
      })
      .where(eq(projects.id, parseInt(projectId)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create task', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('POST task error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}