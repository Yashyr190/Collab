import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { resources } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET handler - Get all resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query = db.select().from(resources);
    
    if (category) {
      query = query.where(eq(resources.category, category));
    }
    
    const records = await query
      .orderBy(desc(resources.upvotes), desc(resources.createdAt))
      .limit(limit)
      .offset(offset);
    
    return NextResponse.json(records);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

// POST handler - Create resource
export async function POST(request: NextRequest) {
  try {
    const { title, description, category, url, createdBy } = await request.json();
    
    if (!title || !category || !url || !createdBy) {
      return NextResponse.json({ 
        error: "title, category, url, and createdBy are required", 
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }

    const validCategories = ['article', 'template', 'video'];
    
    if (!validCategories.includes(category)) {
      return NextResponse.json({ 
        error: "Category must be one of: article, template, video", 
        code: "INVALID_CATEGORY" 
      }, { status: 400 });
    }

    if (!url.trim()) {
      return NextResponse.json({ 
        error: "URL cannot be empty", 
        code: "EMPTY_URL" 
      }, { status: 400 });
    }
    
    const newRecord = await db.insert(resources).values({
      title: title.trim(),
      description: description || null,
      category,
      url: url.trim(),
      upvotes: 0,
      createdBy: parseInt(createdBy),
      createdAt: new Date().toISOString(),
    }).returning();
    
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}