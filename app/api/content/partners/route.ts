import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(partners);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load partners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { logoUrl } = await request.json();
    
    if (!logoUrl || typeof logoUrl !== 'string' || logoUrl.trim() === '') {
      return NextResponse.json({ error: 'Logo URL is required' }, { status: 400 });
    }
    
    const newPartner = await prisma.partner.create({
      data: { logoUrl: logoUrl.trim() }
    });
    
    revalidatePath('/');
    return NextResponse.json(newPartner, { status: 201 });
  } catch (error) {
    console.error("Failed to create partner:", error);
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, logoUrl } = await request.json();

    if (!id || !logoUrl || typeof logoUrl !== 'string' || logoUrl.trim() === '') {
        return NextResponse.json({ error: 'Partner ID and logo URL are required' }, { status: 400 });
    }

    const updatedPartner = await prisma.partner.update({
        where: { id: Number(id) },
        data: { logoUrl: logoUrl.trim() },
    });

    revalidatePath('/');
    
    return NextResponse.json(updatedPartner);
  } catch (error) {
    console.error("Failed to update partner:", error);
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
        return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 });
    }
    
    await prisma.partner.delete({
        where: { id: Number(id) },
    });
    
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete partner:", error);
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}