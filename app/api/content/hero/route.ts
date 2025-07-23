import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const hero = await prisma.hero.findFirst();
    return NextResponse.json(hero);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load hero content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.id) {
        return NextResponse.json({ error: 'Hero ID is required for update' }, { status: 400 });
    }

    const hero = await prisma.hero.update({
      where: { id: data.id }, // FIX: Use the ID from the request body
      data: {
        title: data.title,
        subtitle: data.subtitle,
        buttonText: data.buttonText,
        image: data.image,
      },
    });

    revalidatePath('/'); 

    return NextResponse.json(hero);
  } catch (error) {
    console.error("Failed to update hero content:", error);
    return NextResponse.json({ error: 'Failed to update hero content' }, { status: 500 });
  }
}
