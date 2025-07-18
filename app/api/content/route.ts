import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contentPath = path.join(process.cwd(), 'data', 'content.json');

export async function GET() {
  try {
    const content = fs.readFileSync(contentPath, 'utf8');
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { section, content } = await request.json();
    
    // Read current content
    const currentContent = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    // Update the specific section
    currentContent[section] = content;
    
    // Write back to file
    fs.writeFileSync(contentPath, JSON.stringify(currentContent, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}