import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
const bcrypt = require('bcrypt');

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ 
        error: "Email and password are required", 
        code: "MISSING_CREDENTIALS" 
      }, { status: 400 });
    }

    // Find user by email
    const user = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);
    
    if (user.length === 0) {
      return NextResponse.json({ 
        error: "Invalid email or password", 
        code: "INVALID_CREDENTIALS" 
      }, { status: 401 });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ 
        error: "Invalid email or password", 
        code: "INVALID_CREDENTIALS" 
      }, { status: 401 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user[0];
    
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}