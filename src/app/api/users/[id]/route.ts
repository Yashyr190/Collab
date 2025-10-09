import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const id = request.url.split('/').pop();
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required", 
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const record = await db.select().from(users).where(eq(users.id, parseInt(id))).limit(1);
    
    if (record.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = record[0];
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.url.split('/').pop();
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required", 
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const updates = await request.json();
    delete updates.password; // Never allow password updates

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

export async function DELETE(request: NextRequest) {
  try {
    const id = request.url.split('/').pop();
    
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