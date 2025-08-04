// app/api/visits/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Mengambil data statistik kunjungan
export async function GET() {
  try {
    const stats = await prisma.visitStats.findFirst();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to load visit stats:', error);
    return NextResponse.json({ error: 'Failed to load visit stats' }, { status: 500 });
  }
}

// Menambah jumlah kunjungan
export async function POST(request: NextRequest) {
  try {
    // Get visitor's IP address from a robust header check
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : request.headers.get('x-real-ip') || 'unknown';

    // Calculate the time 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Check if this IP has visited in the last 24 hours
    const existingVisit = await prisma.uniqueVisitor.findFirst({
      where: {
        ip: ip,
        lastVisit: {
          gte: twentyFourHoursAgo,
        },
      },
    });

    let isUniqueVisitor = false;

    if (!existingVisit) {
      // If no recent visit, it's a unique visitor, so we create or update their record
      await prisma.uniqueVisitor.upsert({
        where: { ip: ip },
        update: { lastVisit: new Date() },
        create: { ip: ip, lastVisit: new Date() },
      });
      isUniqueVisitor = true;
    }

    // Now, update the main visit statistics
    const updatedStats = await prisma.visitStats.upsert({
      where: { id: 1 },
      update: {
        totalVisits: {
          increment: 1,
        },
        uniqueVisitors: {
          increment: isUniqueVisitor ? 1 : 0,
        }
      },
      create: {
        id: 1,
        totalVisits: 1,
        uniqueVisitors: isUniqueVisitor ? 1 : 0,
      },
    });

    return NextResponse.json({ success: true, stats: updatedStats });
  } catch (error) {
    console.error('Failed to update visits:', error);
    return NextResponse.json({ error: 'Failed to update visits' }, { status: 500 });
  }
}