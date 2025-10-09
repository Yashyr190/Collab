import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET handler - Read posts with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (id) {
      const record = await db.select().from(posts).where(eq(posts.id, parseInt(id))).limit(1);
      if (record.length === 0) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json(record[0]);
    } else {
      let conditions = [];
      
      if (userId) {
        conditions.push(eq(posts.userId, parseInt(userId)));
      }
      if (type) {
        conditions.push(eq(posts.type, type));
      }
      if (status) {
        conditions.push(eq(posts.status, status));
      }
      
      let query = db.select().from(posts);
      
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

// POST handler - Create post
export async function POST(request: NextRequest) {
  try {
    const { userId, title, description, type, tags, status } = await request.json();
    
    if (!userId || !title || !type || !status) {
      return NextResponse.json({ 
        error: "userId, title, type, and status are required", 
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }

    const validTypes = ['collab', 'project', 'discussion'];
    const validStatuses = ['open', 'in_progress', 'closed'];
    
    if (!validTypes.includes(type)) {
      return NextResponse.json({ 
        error: "Type must be one of: collab, project, discussion", 
        code: "INVALID_TYPE" 
      }, { status: 400 });
    }
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: "Status must be one of: open, in_progress, closed", 
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }
    
    const newRecord = await db.insert(posts).values({
      userId: parseInt(userId),
      title: title.trim(),
      description: description || null,
      type,
      tags: tags || [],
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();
    
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

// PUT handler - Update post
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
    delete updates.userId; // Never allow userId updates
    
    const updatedRecord = await db.update(posts)
      .set({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(posts.id, parseInt(id)))
      .returning();
    
    if (updatedRecord.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
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
    
    const deletedRecord = await db.delete(posts)
      .where(eq(posts.id, parseInt(id)))
      .returning();
    
    if (deletedRecord.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Post deleted successfully', id: parseInt(id) });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}