import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Mengambil data statistik kunjungan
export async function GET() {
  try {
    // Ambil baris pertama (dan satu-satunya) dari tabel VisitStats
    const stats = await prisma.visitStats.findFirst();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load visit stats' }, { status: 500 });
  }
}

// Menambah jumlah kunjungan
export async function POST(request: NextRequest) {
  try {
    // Logika untuk unique visitor bisa disempurnakan di sini jika perlu
    // Untuk saat ini, kita hanya akan menambah total kunjungan
    const updatedStats = await prisma.visitStats.update({
      where: { id: 1 }, // Asumsikan data statistik ada di baris dengan id: 1
      data: {
        totalVisits: {
          increment: 1,
        },
        // Logika untuk unique visitors bisa dibuat lebih kompleks
        // Contoh sederhana: tambah 1 setiap 3 kunjungan
        uniqueVisitors: {
            increment: Math.random() < 0.33 ? 1 : 0,
        }
      },
    });

    return NextResponse.json({ success: true, stats: updatedStats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update visits' }, { status: 500 });
  }
}