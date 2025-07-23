import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
        orderBy: {
            id: 'asc'
        }
    });
    const response = {
        title: "Solusi Terintegrasi Dunia Teknik",
        subtitle: "Menyediakan jasa perizinan hingga konstruksi untuk kebutuhan proyek Anda dengan standar kualitas terbaik dan profesional.",
        items: services
    }
    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to load services content:", error);
    // PASTIKAN ADA RETURN DI SINI
    return NextResponse.json({ error: 'Failed to load services content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { items } = await request.json();

    // Pastikan items adalah array sebelum melanjutkan
    if (!Array.isArray(items)) {
        return NextResponse.json({ error: 'Invalid data format: "items" must be an array.' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.service.deleteMany(),
      prisma.service.createMany({
        data: items.map(({ id, title, description, icon, ...rest }: { id: number; title: string; description: string; icon: string }) => ({
          title,
          description,
          icon,
          ...rest
        })),
      }),
    ]);
    
    revalidatePath('/');
    revalidatePath('/services');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    // PASTIKAN ADA RETURN DI SINI
    return NextResponse.json({ error: 'Failed to update services content' }, { status: 500 });
  }
}