import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { resources } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const resourceId = request.url.split('/').slice(-2, -1)[0];
    
    if (!resourceId || isNaN(parseInt(resourceId))) {
      return NextResponse.json({ 
        error: "Valid resource ID is required", 
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Get current resource
    const resource = await db.select()
      .from(resources)
      .where(eq(resources.id, parseInt(resourceId)))
      .limit(1);

    if (resource.length === 0) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    // Increment upvotes
    const updatedResource = await db.update(resources)
      .set({ upvotes: (resource[0].upvotes || 0) + 1 })
      .where(eq(resources.id, parseInt(resourceId)))
      .returning();

    return NextResponse.json(updatedResource[0]);
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}