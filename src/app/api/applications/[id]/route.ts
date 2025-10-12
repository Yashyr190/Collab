import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { applications, projects, users, notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { XP_REWARDS } from '@/lib/badges';

export async function GET(request: NextRequest) {
  try {
    const id = request.url.split('/').pop();
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required", 
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const record = await db.select().from(applications).where(eq(applications.id, parseInt(id))).limit(1);
    
    if (record.length === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(record[0]);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.url.split('/').pop();
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required", 
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const updates = await request.json();
    delete updates.userId;
    delete updates.projectId;

    if (updates.status) {
      const validStatuses = ['pending', 'accepted', 'rejected'];
      if (!validStatuses.includes(updates.status)) {
        return NextResponse.json({ 
          error: "Status must be one of: pending, accepted, rejected", 
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
    }

    const existingApp = await db.select()
      .from(applications)
      .where(eq(applications.id, parseInt(id)))
      .limit(1);

    if (existingApp.length === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const application = existingApp[0];
    const statusChanged = updates.status && updates.status !== application.status;
    const isAccepted = updates.status === 'accepted';

    const updatedRecord = await db.update(applications)
      .set({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(applications.id, parseInt(id)))
      .returning();
    
    if (updatedRecord.length === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (statusChanged && isAccepted) {
      const project = await db.select()
        .from(projects)
        .where(eq(projects.id, application.projectId))
        .limit(1);

      if (project.length > 0) {
        const currentMembers = (project[0].members as number[]) || [];
        
        if (!currentMembers.includes(application.userId)) {
          const updatedMembers = [...currentMembers, application.userId];
          
          const user = await db.select()
            .from(users)
            .where(eq(users.id, application.userId))
            .limit(1);

          const userName = user.length > 0 ? user[0].name : 'User';

          let currentActivities: any[] = [];
          
          if (project[0].activities) {
            if (typeof project[0].activities === 'string') {
              try {
                currentActivities = JSON.parse(project[0].activities);
              } catch (e) {
                currentActivities = [];
              }
            } else if (Array.isArray(project[0].activities)) {
              currentActivities = project[0].activities;
            }
          }

          const maxActivityId = currentActivities.length > 0
            ? Math.max(...currentActivities.map((a: any) => a.id || 0))
            : 0;

          const newActivity = {
            id: maxActivityId + 1,
            userId: application.userId,
            action: 'joined',
            description: `${userName} joined the project`,
            timestamp: new Date().toISOString()
          };

          const updatedActivities = [newActivity, ...currentActivities];

          await db.update(projects)
            .set({
              members: updatedMembers,
              activities: JSON.stringify(updatedActivities),
              updatedAt: new Date().toISOString()
            })
            .where(eq(projects.id, application.projectId));

          await db.insert(notifications).values({
            userId: application.userId,
            type: 'application',
            message: `Your application to "${project[0].title}" has been accepted`,
            read: false,
            createdAt: new Date().toISOString()
          });

          // Award XP for joining a project
          try {
            await fetch(`${request.nextUrl.origin}/api/users/${application.userId}/xp`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                xpAmount: XP_REWARDS.JOIN_PROJECT,
                action: 'join_project'
              })
            });
          } catch (error) {
            console.error('Failed to award XP:', error);
          }
        }
      }
    }

    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.url.split('/').pop();
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required", 
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const deletedRecord = await db.delete(applications)
      .where(eq(applications.id, parseInt(id)))
      .returning();
    
    if (deletedRecord.length === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Application deleted successfully', id: parseInt(id) });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}