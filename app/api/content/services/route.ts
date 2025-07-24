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
    return NextResponse.json(services);
  } catch (error) {
    console.error("Failed to load services content:", error);
    return NextResponse.json({ error: 'Failed to load services content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { items } = await request.json();

    if (!Array.isArray(items)) {
        return NextResponse.json({ error: 'Invalid data format: "items" must be an array.' }, { status: 400 });
    }

    // FIX: Lakukan pembaruan untuk setiap item dalam satu transaksi
    const updateTransactions = items.map((service: { id: number; title: string; description: string; }) => 
        prisma.service.update({
            where: { id: service.id },
            data: {
                title: service.title,
                description: service.description,
            },
        })
    );
    
    await prisma.$transaction(updateTransactions);
    
    revalidatePath('/');
    revalidatePath('/services');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: 'Failed to update services content' }, { status: 500 });
  }
}
