// app/api/content/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ... (GET and POST functions remain the same) ...
export async function GET() {
  try {
    const projects = await prisma.project.findMany({ include: { category: true }});
    const categories = await prisma.category.findMany();
    const response = {
        title: "Proyek Nyata, Bukti Nyata",
        subtitle: "Lihat bagaimana kami memberikan solusi terbaik untuk berbagai sektor melalui berbagai proyek yang telah kami kerjakan.",
        categories: ["Semua", ...categories.map(c => c.name)],
        items: projects.map(p => ({ ...p, category: p.category.name })),
    }
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load projects content' }, { status: 500 });
  }
}


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

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
        return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    await prisma.project.delete({
        where: { id: Number(id) },
    });

    revalidatePath('/');
    revalidatePath('/portfolio');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
