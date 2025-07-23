import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache'; // <-- 1. IMPORT INI

export async function GET() {
  // ... (GET function tidak berubah)
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
    const updatedAbout = await prisma.about.update({
      where: { id: 1 },
      data: {
        title: data.title,
        content: data.content,
        mission: data.mission,
        vision: data.vision,
        values: data.values,
      },
    });

    // 2. TAMBAHKAN BARIS INI
    revalidatePath('/about'); // Memberitahu Next.js untuk memuat ulang data di halaman /about
    revalidatePath('/'); // Halaman utama mungkin juga menampilkan data ini

    return NextResponse.json(updatedAbout);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update about content' }, { status: 500 });
  }
}