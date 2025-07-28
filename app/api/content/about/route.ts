import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const about = await prisma.about.findFirst();
    if (!about) {
      return NextResponse.json({ error: 'About content not found' }, { status: 404 });
    }
    return NextResponse.json(about);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load about content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.id) {
        return NextResponse.json({ error: 'About content ID is required' }, { status: 400 });
    }

    const updatedAbout = await prisma.about.update({
      where: { id: data.id }, // FIX: Menggunakan ID dari request
      data: {
        title: data.title,
        content: data.content,
        mission: data.mission,
        vision: data.vision,
        values: data.values,
      },
    });

    revalidatePath('/about');
    revalidatePath('/');

    return NextResponse.json(updatedAbout);
  } catch (error) {
    console.error("Failed to update about content:", error);
    return NextResponse.json({ error: 'Failed to update about content' }, { status: 500 });
  }
}
