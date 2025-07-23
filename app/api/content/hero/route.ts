import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache'; // <-- 1. IMPORT INI

export async function GET() {
  // ... (GET function tidak berubah)
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
    const hero = await prisma.hero.update({
      where: { id: 1 },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        buttonText: data.buttonText,
      },
    });

    // 2. TAMBAHKAN BARIS INI
    revalidatePath('/'); // Memberitahu Next.js untuk memuat ulang data di halaman utama

    return NextResponse.json(hero);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update hero content' }, { status: 500 });
  }
}