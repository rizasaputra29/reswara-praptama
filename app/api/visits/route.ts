import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Mengambil data statistik kunjungan
export async function GET() {
  try {
    const stats = await prisma.visitStats.findFirst();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load visit stats' }, { status: 500 });
  }
}

// Menambah jumlah kunjungan
export async function POST(request: NextRequest) {
  try {
    const updatedStats = await prisma.visitStats.upsert({
      where: { id: 1 },
      update: {
        totalVisits: {
          increment: 1,
        },
        uniqueVisitors: {
            increment: Math.random() < 0.33 ? 1 : 0,
        }
      },
      create: {
        id: 1,
        totalVisits: 1,
        uniqueVisitors: 1
      },
    });

    return NextResponse.json({ success: true, stats: updatedStats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update visits' }, { status: 500 });
  }
}