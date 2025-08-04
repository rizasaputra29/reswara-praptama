import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Run all database queries simultaneously (in parallel)
    const [
      visits,
      hero,
      about,
      services,
      projects,
      contact,
      categories
    ] = await Promise.all([
      prisma.visitStats.findFirst(),
      prisma.hero.findFirst(),
      prisma.about.findFirst(),
      prisma.service.findMany({
        orderBy: { id: 'asc' },
        // Include the related sub-services for each service
        include: {
          subServices: {
            orderBy: { id: 'asc' }
          }
        }
      }),
      prisma.project.findMany({ include: { category: true }, orderBy: { id: 'asc' } }),
      prisma.contact.findFirst(),
      prisma.category.findMany({ orderBy: { id: 'asc' } })
    ]);

    // Ensure visits data exists
    let visitsData = visits;
    if (!visitsData) {
      // Create initial visit stats if they don't exist
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
      categories
    });

  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}