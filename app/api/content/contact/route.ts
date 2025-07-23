import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const contact = await prisma.contact.findFirst();
     if (!contact) {
      return NextResponse.json({ error: 'Contact content not found' }, { status: 404 });
    }
    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load contact content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const { items } = await request.json();
    
    await prisma.$transaction([
      prisma.project.deleteMany(),
      prisma.project.createMany({
        data: items.map(({ id, ...rest }: { id: number }) => rest),
      }),
    ]);
    
    revalidatePath('/');
    revalidatePath('/contact');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: 'Failed to update projects content' }, { status: 500 });
  }
}