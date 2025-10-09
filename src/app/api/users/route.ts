import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, like, or } from 'drizzle-orm';
const bcrypt = require('bcrypt');

// GET handler - Read users with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (id) {
      const record = await db.select().from(users).where(eq(users.id, parseInt(id))).limit(1);
      if (record.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      const { password: _, ...userWithoutPassword } = record[0];
      return NextResponse.json(userWithoutPassword);
    } else if (email) {
      const record = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (record.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      const { password: _, ...userWithoutPassword } = record[0];
      return NextResponse.json(userWithoutPassword);
    } else {
      let query = db.select().from(users);
      
      if (search) {
        query = query.where(
          or(
            like(users.name, `%${search}%`),
            like(users.email, `%${search}%`)
          )
        );
      }
      
      const records = await query.limit(limit).offset(offset);
      const usersWithoutPasswords = records.map(({ password: _, ...user }) => user);
      return NextResponse.json(usersWithoutPasswords);
    }
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

// POST handler - Create user
export async function POST(request: NextRequest) {
  try {
    const { name, email, password, avatar, bio, skills } = await request.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ 
        error: "Name, email, and password are required", 
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }

    // Check if email exists
    const existingUser = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json({ 
        error: "Email already exists", 
        code: "DUPLICATE_EMAIL" 
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newRecord = await db.insert(users).values({
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
    
    const { password: _, ...userWithoutPassword } = newRecord[0];
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

// PUT handler - Update user
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required", 
        code: "INVALID_ID" 
      }, { status: 400 });
    }
    
    const updates = await request.json();
    delete updates.password; // Never allow password updates via this endpoint
    
    const updatedRecord = await db.update(users)
      .set({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, parseInt(id)))
      .returning();
    
    if (updatedRecord.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const { password: _, ...userWithoutPassword } = updatedRecord[0];
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required", 
        code: "INVALID_ID" 
      }, { status: 400 });
    }
    
    const deletedRecord = await db.delete(users)
      .where(eq(users.id, parseInt(id)))
      .returning();
    
    if (deletedRecord.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'User deleted successfully', id: parseInt(id) });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}