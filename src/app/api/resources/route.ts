import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { resources, users } from '@/db/schema';
import { eq, like, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    const authorId = searchParams.get('authorId');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'createdAt';

    // Single resource fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const resource = await db
        .select()
        .from(resources)
        .where(eq(resources.id, parseInt(id)))
        .limit(1);

      if (resource.length === 0) {
        return NextResponse.json(
          { error: 'Resource not found', code: 'RESOURCE_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(resource[0], { status: 200 });
    }

    // List resources with filters
    let query = db.select().from(resources);

    const conditions = [];

    // Filter by type
    if (type) {
      conditions.push(eq(resources.type, type));
    }

    // Filter by authorId
    if (authorId) {
      if (isNaN(parseInt(authorId))) {
        return NextResponse.json(
          { error: 'Valid author ID is required', code: 'INVALID_AUTHOR_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(resources.authorId, parseInt(authorId)));
    }

    // Search by title
    if (search) {
      conditions.push(like(resources.title, `%${search}%`));
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    if (sortBy === 'upvotes') {
      query = query.orderBy(desc(resources.upvotes));
    } else {
      query = query.orderBy(desc(resources.createdAt));
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, content, authorId, type, tags } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!authorId) {
      return NextResponse.json(
        { error: 'Author ID is required', code: 'MISSING_AUTHOR_ID' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required', code: 'MISSING_TYPE' },
        { status: 400 }
      );
    }

    // Validate type enum
    const validTypes = ['article', 'template', 'video'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          error: 'Type must be one of: article, template, video',
          code: 'INVALID_TYPE',
        },
        { status: 400 }
      );
    }

    // Validate authorId is a valid integer
    if (isNaN(parseInt(authorId))) {
      return NextResponse.json(
        { error: 'Valid author ID is required', code: 'INVALID_AUTHOR_ID' },
        { status: 400 }
      );
    }

    // Verify author exists in users table
    const author = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(authorId)))
      .limit(1);

    if (author.length === 0) {
      return NextResponse.json(
        { error: 'Author not found', code: 'AUTHOR_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Prepare resource data with auto-generated fields
    const resourceData = {
      title: title.trim(),
      description: description ? description.trim() : null,
      content: content ? content.trim() : null,
      authorId: parseInt(authorId),
      type,
      tags: tags || [],
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };

    // Insert resource
    const newResource = await db
      .insert(resources)
      .values(resourceData)
      .returning();

    return NextResponse.json(newResource[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}