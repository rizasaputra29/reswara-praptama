// app/api/content/backup/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const backupData = await prisma.$transaction(async (tx) => {
      const hero = await tx.hero.findMany();
      const services = await tx.service.findMany({
        include: { subServices: true },
      });
      // FIX: Ubah `include: { category: true }` menjadi `include: { service: true }`
      const projects = await tx.project.findMany({
        include: { service: true },
      });
      const statistics = await tx.statistic.findMany();
      const partners = await tx.partner.findMany();
      const about = await tx.about.findMany();
      const contact = await tx.contact.findMany();
      // FIX: Hapus `const categories = await tx.category.findMany();`
      const timelineEvents = await tx.timelineEvent.findMany();
      const pageContent = await tx.pageContent.findMany();

      return {
        hero,
        services,
        projects,
        statistics,
        partners,
        about,
        contact,
        // FIX: Hapus `categories` dari objek yang dikembalikan
        timelineEvents,
        pageContent,
      };
    });

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename=resawara-backup-${new Date().toISOString()}.json`,
    });

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Failed to create backup:', error);
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
  }
}