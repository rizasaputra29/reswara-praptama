// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // --- Clear existing data ---
  await prisma.project.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.statistic.deleteMany({});
  await prisma.partner.deleteMany({});
  await prisma.hero.deleteMany({});
  await prisma.about.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.visitStats.deleteMany({});
  console.log('Cleared previous data.');

  // --- Load data from JSON files ---
  const contentPath = path.join(process.cwd(), 'data', 'content.json');
  const visitsPath = path.join(process.cwd(), 'data', 'visits.json');

  const contentFile = fs.readFileSync(contentPath, 'utf-8');
  const visitsFile = fs.readFileSync(visitsPath, 'utf-8');

  const contentData = JSON.parse(contentFile);
  const visitsData = JSON.parse(visitsFile);

  // --- Seed VisitStats ---
  await prisma.visitStats.create({
    data: {
      totalVisits: visitsData.totalVisits,
      uniqueVisitors: visitsData.uniqueVisitors,
    },
  });
  console.log('✅ VisitStats seeded.');

  // --- Seed Hero ---
  await prisma.hero.create({ data: contentData.hero });
  console.log('✅ Hero seeded.');

  // --- Seed Services ---
  await prisma.service.createMany({ data: contentData.services.items });
  console.log('✅ Services seeded.');

  // --- Seed Categories and Projects ---
  const categories = contentData.projects.categories.filter((cat: string) => cat !== 'Semua');
  const categoryRecords = await Promise.all(
    categories.map((name: string) => prisma.category.create({ data: { name } }))
  );
  console.log('✅ Categories seeded.');

  const categoryMap = categoryRecords.reduce((acc, category) => {
    acc[category.name] = category.id;
    return acc;
  }, {} as Record<string, number>);

  const projectsToCreate = contentData.projects.items.map((project: any) => ({
    title: project.title,
    description: project.description,
    image: project.image,
    client: project.client,
    completedDate: project.completedDate,
    categoryId: categoryMap[project.category],
  }));

  await prisma.project.createMany({
    data: projectsToCreate,
  });
  console.log('✅ Projects seeded.');

  // --- Seed Statistics ---
  await prisma.statistic.createMany({ data: contentData.statistics.items });
  console.log('✅ Statistics seeded.');

  // --- Seed Partners ---
  const partnerLogos = contentData.partners.logos.map((logoUrl: string) => ({ logoUrl }));
  await prisma.partner.createMany({ data: partnerLogos });
  console.log('✅ Partners seeded.');
  
  // --- Seed About ---
  await prisma.about.create({ data: contentData.about });
  console.log('✅ About seeded.');
  
  // --- Seed Contact ---
  await prisma.contact.create({ data: contentData.contact });
  console.log('✅ Contact seeded.');


  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });