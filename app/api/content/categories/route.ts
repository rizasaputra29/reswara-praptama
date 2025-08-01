import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name } = await request.json();

    if (!id || typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json({ error: 'Category ID and a valid name are required' }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
        where: { id: Number(id) },
        data: { name },
    });

    revalidatePath('/');
    revalidatePath('/portfolio');
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Failed to update category:", error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }
    const newCategory = await prisma.category.create({ data: { name } });
    revalidatePath('/');
    revalidatePath('/portfolio');
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
        return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    await prisma.category.delete({ where: { id: Number(id) } });
    revalidatePath('/');
    revalidatePath('/portfolio');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete category:", error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}