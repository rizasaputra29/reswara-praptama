import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const JWT_SECRET = 'your-secret-key-change-this-in-production';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
      
      return NextResponse.json({ token });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}