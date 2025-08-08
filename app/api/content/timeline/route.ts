// app/api/content/timeline/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET all timeline events, ordered by year
export async function GET() {
  try {
    const timelineEvents = await prisma.timelineEvent.findMany({
      orderBy: {
        year: 'asc'
      }
    });
    return NextResponse.json(timelineEvents);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load timeline events' }, { status: 500 });
  }
}

// POST a new timeline event
export async function POST(request: NextRequest) {
  try {
    const { year, title, description } = await request.json();
    if (!year || !title || !description) {
      return NextResponse.json({ error: 'Year, title, and description are required' }, { status: 400 });
    }
    const newEvent = await prisma.timelineEvent.create({
      data: { year, title, description }
    });
    revalidatePath('/about');
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Failed to create timeline event:", error);
    return NextResponse.json({ error: 'Failed to create timeline event' }, { status: 500 });
  }
}

// PUT (update) an existing timeline event
export async function PUT(request: NextRequest) {
  try {
    const { id, year, title, description } = await request.json();
    if (!id || !year || !title || !description) {
        return NextResponse.json({ error: 'ID, year, title, and description are required' }, { status: 400 });
    }
    const updatedEvent = await prisma.timelineEvent.update({
        where: { id: Number(id) },
        data: { year, title, description },
    });
    revalidatePath('/about');
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Failed to update timeline event:", error);
    return NextResponse.json({ error: 'Failed to update timeline event' }, { status: 500 });
  }
}

// DELETE a timeline event
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
        return NextResponse.json({ error: 'Timeline event ID is required' }, { status: 400 });
    }
    await prisma.timelineEvent.delete({ where: { id: Number(id) } });
    revalidatePath('/about');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete timeline event:", error);
    return NextResponse.json({ error: 'Failed to delete timeline event' }, { status: 500 });
  }
}