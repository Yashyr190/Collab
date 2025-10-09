import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { resources } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID is valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const resourceId = parseInt(id);

    // Check if resource exists
    const existingResource = await db
      .select()
      .from(resources)
      .where(eq(resources.id, resourceId))
      .limit(1);

    if (existingResource.length === 0) {
      return NextResponse.json(
        {
          error: 'Resource not found',
          code: 'RESOURCE_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    const resource = existingResource[0];

    // Increment upvotes by 1
    const updatedResource = await db
      .update(resources)
      .set({
        upvotes: (resource.upvotes || 0) + 1,
      })
      .where(eq(resources.id, resourceId))
      .returning();

    return NextResponse.json(updatedResource[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
      },
      { status: 500 }
    );
  }
}