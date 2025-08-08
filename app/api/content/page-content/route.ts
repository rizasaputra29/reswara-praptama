// app/api/content/page-content/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function PUT(request: NextRequest) {
  try {
    const { pageName, title, subtitle } = await request.json();

    if (!pageName || !title || !subtitle) {
      return NextResponse.json({ error: 'Page name, title, and subtitle are required' }, { status: 400 });
    }

    const updatedContent = await prisma.pageContent.update({
      where: { pageName: pageName },
      data: { title, subtitle },
    });

    // Revalidate the path of the page you updated
    revalidatePath(`/${pageName}`);

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error("Failed to update page content:", error);
    return NextResponse.json({ error: 'Failed to update page content' }, { status: 500 });
  }
}