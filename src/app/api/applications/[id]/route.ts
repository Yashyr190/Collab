import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { applications } from '@/db/schema';
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
    delete updates.userId; // Never allow userId updates
    delete updates.projectId; // Never allow projectId updates

    if (updates.status) {
      const validStatuses = ['pending', 'accepted', 'rejected'];
      if (!validStatuses.includes(updates.status)) {
        return NextResponse.json({ 
          error: "Status must be one of: pending, accepted, rejected", 
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
    }

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