import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const userId = parseInt(id);

    // Parse request body
    const body = await request.json();

    // Extract allowed update fields only
    const allowedFields = ['name', 'avatar', 'bio', 'skills', 'xp', 'badges'];
    const updates: Record<string, any> = {};

    // Validate and sanitize inputs
    for (const field of allowedFields) {
      if (field in body) {
        const value = body[field];

        // Handle field-specific validation
        if (field === 'name' && typeof value === 'string') {
          updates.name = value.trim();
        } else if (field === 'avatar' && typeof value === 'string') {
          updates.avatar = value.trim();
        } else if (field === 'bio' && typeof value === 'string') {
          updates.bio = value.trim();
        } else if (field === 'skills' && Array.isArray(value)) {
          updates.skills = value;
        } else if (field === 'xp' && typeof value === 'number') {
          updates.xp = value;
        } else if (field === 'badges' && Array.isArray(value)) {
          updates.badges = value;
        }
      }
    }

    // Check if there are any valid updates
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          error: 'No valid update fields provided',
          code: 'NO_UPDATES',
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        {
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Update user with provided fields
    const updatedUser = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to update user',
          code: 'UPDATE_FAILED',
        },
        { status: 500 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser[0];

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}