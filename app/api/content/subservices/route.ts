import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Revalidate paths to ensure fresh data on the frontend
function revalidate() {
  revalidatePath('/');
  revalidatePath('/services');
}

// POST: Create a new sub-service
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, description, image, serviceId } = data;

    if (!title || !serviceId) {
      return NextResponse.json({ error: 'Title and Service ID are required' }, { status: 400 });
    }

    const newSubService = await prisma.subService.create({
      data: {
        title,
        description,
        image,
        serviceId: Number(serviceId),
      },
    });

    revalidate();
    return NextResponse.json(newSubService, { status: 201 });
  } catch (error) {
    console.error("Create sub-service error:", error);
    return NextResponse.json({ error: 'Failed to create sub-service' }, { status: 500 });
  }
}

// PUT: Update an existing sub-service
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'Sub-service ID is required' }, { status: 400 });
    }

    const updatedSubService = await prisma.subService.update({
      where: { id: Number(id) },
      data: updateData,
    });

    revalidate();
    return NextResponse.json(updatedSubService);
  } catch (error) {
    console.error("Update sub-service error:", error);
    return NextResponse.json({ error: 'Failed to update sub-service' }, { status: 500 });
  }
}

// DELETE: Remove a sub-service
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
        return NextResponse.json({ error: 'Sub-service ID is required' }, { status: 400 });
    }
    await prisma.subService.delete({
        where: { id: Number(id) },
    });
    
    revalidate();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete sub-service error:", error);
    return NextResponse.json({ error: 'Failed to delete sub-service' }, { status: 500 });
  }
}