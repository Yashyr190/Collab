import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { applications } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

// GET handler - Get applications with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let conditions = [];
    
    if (userId) {
      conditions.push(eq(applications.userId, parseInt(userId)));
    }
    if (projectId) {
      conditions.push(eq(applications.projectId, parseInt(projectId)));
    }
    if (status) {
      conditions.push(eq(applications.status, status));
    }
    
    let query = db.select().from(applications);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const records = await query
      .orderBy(desc(applications.createdAt))
      .limit(limit)
      .offset(offset);
    
    return NextResponse.json(records);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

// POST handler - Create application
export async function POST(request: NextRequest) {
  try {
    const { userId, projectId, message } = await request.json();
    
    if (!userId || !projectId) {
      return NextResponse.json({ 
        error: "userId and projectId are required", 
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }

    // Check for duplicate application
    const existing = await db.select()
      .from(applications)
      .where(
        and(
          eq(applications.userId, parseInt(userId)),
          eq(applications.projectId, parseInt(projectId))
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ 
        error: "User has already applied to this project", 
        code: "DUPLICATE_APPLICATION" 
      }, { status: 400 });
    }
    
    const newRecord = await db.insert(applications).values({
      userId: parseInt(userId),
      projectId: parseInt(projectId),
      message: message || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();
    
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}