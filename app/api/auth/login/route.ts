import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Tambahkan peran ke token JWT
    const token = jwt.sign(
        { username: admin.username, id: admin.id, role: admin.role }, // Peran ditambahkan di sini
        JWT_SECRET as string, 
        { expiresIn: '24h' }
    );

    return NextResponse.json({ token });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
