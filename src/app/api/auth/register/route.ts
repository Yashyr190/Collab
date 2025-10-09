import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, avatar, bio, skills } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: 'Name, email, and password are required',
          code: 'MISSING_REQUIRED_FIELDS',
        },
        { status: 400 }
      );
    }

    // Validate name is not empty after trimming
    if (name.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Name cannot be empty',
          code: 'INVALID_NAME',
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        {
          error: 'Password must be at least 6 characters long',
          code: 'WEAK_PASSWORD',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: 'Invalid email format',
          code: 'INVALID_EMAIL',
        },
        { status: 400 }
      );
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          error: 'Email already registered',
          code: 'DUPLICATE_EMAIL',
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data with system-generated fields
    const userData = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      avatar: avatar?.trim() || null,
      bio: bio?.trim() || null,
      skills: skills && Array.isArray(skills) ? skills : [],
      xp: 0,
      badges: [],
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    // Insert user into database
    const newUser = await db.insert(users).values(userData).returning();

    if (newUser.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to create user',
          code: 'CREATE_FAILED',
        },
        { status: 500 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
      },
      { status: 500 }
    );
  }
}