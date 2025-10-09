import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const id = request.url.split('/').pop();
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required", 
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const record = await db.select().from(projects).where(eq(projects.id, parseInt(id))).limit(1);
    
    if (record.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
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

export async function DELETE(request: NextRequest) {
  try {
    const id = request.url.split('/').pop();
    
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