import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { XP_REWARDS } from '@/lib/badges';

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
    const taskId = parseInt(request.url.split('/').pop() || '');
    const projectId = parseInt(request.url.split('/')[request.url.split('/').length - 3]);
    const updates = await request.json();

    if (!taskId || isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const projectRecords = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
    
    if (projectRecords.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = projectRecords[0];
    const tasks = Array.isArray(project.tasks) ? project.tasks : [];
    const taskIndex = tasks.findIndex((t: any) => t.id === taskId);

    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const oldTask = tasks[taskIndex];
    const wasCompleted = oldTask.status === 'completed';
    const isNowCompleted = updates.status === 'completed';

    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };

    const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    await db.update(projects)
      .set({
        tasks: tasks,
        progress: progress,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(projects.id, projectId));

    // Award XP if task was just completed
    if (!wasCompleted && isNowCompleted && updates.userId) {
      try {
        await fetch(`${request.nextUrl.origin}/api/users/${updates.userId}/xp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            xpAmount: XP_REWARDS.TASK_COMPLETE,
            action: 'task_complete'
          })
        });
      } catch (error) {
        console.error('Failed to award XP:', error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      task: tasks[taskIndex],
      progress,
      xpAwarded: (!wasCompleted && isNowCompleted) ? XP_REWARDS.TASK_COMPLETE : 0
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
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