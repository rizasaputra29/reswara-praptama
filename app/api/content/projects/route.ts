import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET function
export async function GET() {
  try {
    const projects = await prisma.project.findMany({ include: { service: true }});
    const services = await prisma.service.findMany();
    const response = {
        title: "Proyek Nyata, Bukti Nyata",
        subtitle: "Lihat bagaimana kami memberikan solusi terbaik untuk berbagai sektor melalui berbagai proyek yang telah kami kerjakan.",
        categories: ["Semua", ...services.map(c => c.title)],
        items: projects.map(p => ({ ...p, category: p.service.title })),
    }
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load projects content' }, { status: 500 });
  }
}

// POST function
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const serviceId = parseInt(data.serviceId, 10);
    if (isNaN(serviceId)) {
      return NextResponse.json({ error: 'Invalid Service ID' }, { status: 400 });
    }
    const newProject = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        client: data.client,
        completedDate: data.completedDate,
        serviceId: serviceId,
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

// FIX: PUT function is now corrected to handle service relation
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, serviceId, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Jika ada serviceId dalam data, buat objek `service` untuk menghubungkan
    if (serviceId) {
      updateData.service = {
        connect: {
          id: Number(serviceId),
        },
      };
    }

    // Hapus serviceId dari updateData jika ada agar tidak bentrok dengan `service`
    if (updateData.serviceId) {
        delete updateData.serviceId;
    }

    const updatedProject = await prisma.project.update({
      where: { id: Number(id) },
      data: updateData,
    });

    revalidatePath('/');
    revalidatePath('/portfolio');

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}


// DELETE function remains the same
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