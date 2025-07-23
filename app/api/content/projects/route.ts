// app/api/content/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ... (GET dan PUT yang sudah ada) ...

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Pastikan categoryId adalah angka
    const categoryId = parseInt(data.categoryId, 10);
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid Category ID' }, { status: 400 });
    }

    const newProject = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        client: data.client,
        completedDate: data.completedDate,
        categoryId: categoryId,
      },
    });

    revalidatePath('/');
    revalidatePath('/portfolio');

    return NextResponse.json(newProject);
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}