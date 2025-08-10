// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      visits,
      hero,
      about,
      services,
      projects,
      contact,
      servicesPageContent
    ] = await Promise.all([
      prisma.visitStats.findFirst(),
      prisma.hero.findFirst(),
      prisma.about.findFirst(),
      prisma.service.findMany({
        orderBy: { id: 'asc' },
        include: {
          subServices: {
            orderBy: { id: 'asc' }
          }
        }
      }),
      prisma.project.findMany({ include: { service: true }, orderBy: { id: 'asc' } }),
      prisma.contact.findFirst(),
      prisma.pageContent.findUnique({ where: { pageName: 'services' } })
    ]);

    let visitsData = visits;
    if (!visitsData) {
      visitsData = await prisma.visitStats.create({
        data: {
          id: 1,
          totalVisits: 0,
          uniqueVisitors: 0
        }
      });
    }

    return NextResponse.json({
      visits: visitsData,
      hero,
      about,
      services,
      projects,
      contact,
      // FIX: Hapus `categories` atau perbarui untuk menggunakan `ServiceItem[]`
      servicesPage: servicesPageContent
    });

  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}