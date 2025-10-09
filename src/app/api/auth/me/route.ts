import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id) {
      return NextResponse.json(
        {
          error: 'ID parameter is required',
          code: 'MISSING_ID'
        },
        { status: 400 }
      );
    }

    // Validate ID is a valid integer
    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'ID must be a valid integer',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    // Query database for user by ID
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1);

    // Check if user exists
    if (result.length === 0) {
      return NextResponse.json(
        {
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Extract user and remove password field
    const user = result[0];
    const { password, ...userWithoutPassword } = user;

    // Return user object without password
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}