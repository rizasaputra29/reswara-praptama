// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const contentPath = path.join(process.cwd(), 'data', 'content.json');
  const visitsPath = path.join(process.cwd(), 'data', 'visits.json'); // Path ke visits.json

  const contentFile = fs.readFileSync(contentPath, 'utf-8');
  const visitsFile = fs.readFileSync(visitsPath, 'utf-8'); // Baca file visits

  const contentData = JSON.parse(contentFile);
  const visitsData = JSON.parse(visitsFile); // Parse data visits

  // --- Seed VisitStats (BARU) ---
  await prisma.visitStats.deleteMany({}); // Hapus data lama
  await prisma.visitStats.create({
      data: {
          totalVisits: visitsData.totalVisits,
          uniqueVisitors: visitsData.uniqueVisitors
      }
  });
  console.log('✅ VisitStats seeded.');

  // ... (sisa skrip seed Anda untuk categories, hero, about, dll.)
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });