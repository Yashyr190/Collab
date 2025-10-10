import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET handler - Read projects with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const ownerId = searchParams.get('ownerId');
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (id) {
      const record = await db.select().from(projects).where(eq(projects.id, parseInt(id))).limit(1);
      if (record.length === 0) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json(record[0]);
    } else {
      let conditions = [];
      
      if (ownerId) {
        conditions.push(eq(projects.ownerId, parseInt(ownerId)));
      }
      if (status) {
        conditions.push(eq(projects.status, status));
      }
      
      let query = db.select().from(projects);
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const records = await query.limit(limit).offset(offset);
      return NextResponse.json(records);
    }
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

// POST handler - Create project
export async function POST(request: NextRequest) {
  try {
    const { ownerId, title, description, members, tasks, status, progress } = await request.json();
    
    if (!ownerId || !title || !status) {
      return NextResponse.json({ 
        error: "ownerId, title, and status are required", 
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }

    const validStatuses = ['planning', 'active', 'completed', 'archived'];
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: "Status must be one of: planning, active, completed, archived", 
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return NextResponse.json({ 
        error: "Progress must be between 0 and 100", 
        code: "INVALID_PROGRESS" 
      }, { status: 400 });
    }
    
    const newRecord = await db.insert(projects).values({
      ownerId: parseInt(ownerId),
      title: title.trim(),
      description: description || null,
      members: members || [],
      tasks: tasks || [],
      status,
      progress: progress || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();
    
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

// PUT handler - Update project
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required", 
        code: "INVALID_ID" 
      }, { status: 400 });
    }
    
    const updates = await request.json();
    delete updates.ownerId; // Never allow ownerId updates

    if (updates.progress !== undefined && (updates.progress < 0 || updates.progress > 100)) {
      return NextResponse.json({ 
        error: "Progress must be between 0 and 100", 
        code: "INVALID_PROGRESS" 
      }, { status: 400 });
    }
    
    const updatedRecord = await db.update(projects)
      .set({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(projects.id, parseInt(id)))
      .returning();
    
    if (updatedRecord.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required", 
        code: "INVALID_ID" 
      }, { status: 400 });
    }
    
    const deletedRecord = await db.delete(projects)
      .where(eq(projects.id, parseInt(id)))
      .returning();
    
    if (deletedRecord.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Project deleted successfully', id: parseInt(id) });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}