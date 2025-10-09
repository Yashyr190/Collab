import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
const bcrypt = require('bcrypt');

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, avatar, bio, skills } = await request.json();
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ 
        error: "Name, email, and password are required", 
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);
    
    if (existingUser.length > 0) {
      return NextResponse.json({ 
        error: "Email already exists", 
        code: "DUPLICATE_EMAIL" 
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await db.insert(users).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      avatar: avatar || null,
      bio: bio || null,
      skills: skills || [],
      xp: 0,
      badges: [],
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser[0];
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}