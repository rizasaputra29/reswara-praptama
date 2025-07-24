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
    const data = await request.json();

    if (!data.id) {
        return NextResponse.json({ error: 'Contact content ID is required' }, { status: 400 });
    }
    
    const updatedContact = await prisma.contact.update({
        where: { id: data.id }, // FIX: Menggunakan ID dari request
        data: {
            title: data.title,
            subtitle: data.subtitle,
            address: data.address,
            phone: data.phone,
            email: data.email,
            hours: data.hours,
        }
    });
    
    revalidatePath('/contact');

    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: 'Failed to update contact content' }, { status: 500 });
  }
}
