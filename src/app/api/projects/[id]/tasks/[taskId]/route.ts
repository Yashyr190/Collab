import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  assignedTo?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export async function PUT(request: NextRequest) {
  try {
    // Extract project ID and task ID from URL path
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const projectId = pathSegments[pathSegments.length - 3];
    const taskId = pathSegments[pathSegments.length - 1];

    // Validate IDs
    if (!projectId || isNaN(parseInt(projectId))) {
      return NextResponse.json(
        { error: 'Valid project ID is required', code: 'INVALID_PROJECT_ID' },
        { status: 400 }
      );
    }

    if (!taskId || isNaN(parseInt(taskId))) {
      return NextResponse.json(
        { error: 'Valid task ID is required', code: 'INVALID_TASK_ID' },
        { status: 400 }
      );
    }

    const parsedProjectId = parseInt(projectId);
    const parsedTaskId = parseInt(taskId);

    // Parse request body
    const body = await request.json();
    const { title, description, status, assignedTo, dueDate } = body;

    // Validate status if provided
    if (status && !['pending', 'in_progress', 'completed'].includes(status)) {
      return NextResponse.json(
        {
          error: 'Status must be one of: pending, in_progress, completed',
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Query project by ID
    const projectResults = await db
      .select()
      .from(projects)
      .where(eq(projects.id, parsedProjectId))
      .limit(1);

    if (projectResults.length === 0) {
      return NextResponse.json(
        { error: 'Project not found', code: 'PROJECT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const project = projectResults[0];

    // Get tasks array
    const tasks: Task[] = (project.tasks as Task[]) || [];

    // Find task by taskId
    const taskIndex = tasks.findIndex((task) => task.id === parsedTaskId);

    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found', code: 'TASK_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Update task object with provided fields
    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(assignedTo !== undefined && { assignedTo }),
      ...(dueDate !== undefined && { dueDate }),
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;

    // Calculate progress based on completed tasks
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Update project with modified tasks array and calculated progress
    const updatedProject = await db
      .update(projects)
      .set({
        tasks: tasks as any,
        progress,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(projects.id, parsedProjectId))
      .returning();

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Extract project ID and task ID from URL path
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const projectId = pathSegments[pathSegments.length - 3];
    const taskId = pathSegments[pathSegments.length - 1];

    // Validate IDs
    if (!projectId || isNaN(parseInt(projectId))) {
      return NextResponse.json(
        { error: 'Valid project ID is required', code: 'INVALID_PROJECT_ID' },
        { status: 400 }
      );
    }

    if (!taskId || isNaN(parseInt(taskId))) {
      return NextResponse.json(
        { error: 'Valid task ID is required', code: 'INVALID_TASK_ID' },
        { status: 400 }
      );
    }

    const parsedProjectId = parseInt(projectId);
    const parsedTaskId = parseInt(taskId);

    // Query project by ID
    const projectResults = await db
      .select()
      .from(projects)
      .where(eq(projects.id, parsedProjectId))
      .limit(1);

    if (projectResults.length === 0) {
      return NextResponse.json(
        { error: 'Project not found', code: 'PROJECT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const project = projectResults[0];

    // Get tasks array
    const tasks: Task[] = (project.tasks as Task[]) || [];
    const originalLength = tasks.length;

    // Filter out the task with matching taskId
    const filteredTasks = tasks.filter((task) => task.id !== parsedTaskId);

    // Check if array length changed
    if (filteredTasks.length === originalLength) {
      return NextResponse.json(
        { error: 'Task not found', code: 'TASK_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Calculate progress based on remaining completed tasks
    const completedTasks = filteredTasks.filter(t => t.status === 'completed').length;
    const totalTasks = filteredTasks.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Update project with filtered tasks array and calculated progress
    await db
      .update(projects)
      .set({
        tasks: filteredTasks as any,
        progress,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(projects.id, parsedProjectId))
      .returning();

    return NextResponse.json(
      {
        message: 'Task deleted successfully',
        taskId: parsedTaskId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}