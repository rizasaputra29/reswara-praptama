// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // --- Clear existing data ---
  await prisma.subService.deleteMany({}); // Clear sub-services first
  await prisma.project.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.statistic.deleteMany({});
  await prisma.partner.deleteMany({});
  await prisma.hero.deleteMany({});
  await prisma.about.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.visitStats.deleteMany({});
  await prisma.pageContent.deleteMany({});
  console.log('Cleared previous data.');

  // --- Load data from JSON files ---
  const contentPath = path.join(process.cwd(), 'data', 'content.json');
  const visitsPath = path.join(process.cwd(), 'data', 'visits.json');

  const contentFile = fs.readFileSync(contentPath, 'utf-8');
  const visitsFile = fs.readFileSync(visitsPath, 'utf-8');

  const contentData = JSON.parse(contentFile);
  const visitsData = JSON.parse(visitsFile);

  // --- Seed VisitStats ---
  await prisma.visitStats.create({ data: visitsData });
  console.log('✅ VisitStats seeded.');

  // --- Seed Hero ---
  await prisma.hero.create({ data: contentData.hero });
  console.log('✅ Hero seeded.');
  
  // --- Seed Services and SubServices ---
  const createdServices = [];
  for (const service of contentData.services.items) {
    const { subServices, ...serviceData } = service; // Separate subServices from parent data
    
    const createdService = await prisma.service.create({
      data: serviceData,
    });
    createdServices.push(createdService);
    
    if (subServices && subServices.length > 0) {
      await prisma.subService.createMany({
        data: subServices.map((sub: any) => ({
          ...sub,
          serviceId: createdService.id, // Link to the parent service
        })),
      });
    }
  }
  console.log('✅ Services and SubServices seeded.');

  // --- Seed Categories from Services ---
  const categoryData = createdServices.map(service => ({ name: service.title }));
  await prisma.category.createMany({
    data: categoryData,
  });
  const categoryRecords = await prisma.category.findMany();
  console.log('✅ Categories seeded from services.');

  const categoryMap = categoryRecords.reduce((acc, category) => {
    acc[category.name] = category.id;
    return acc;
  }, {} as Record<string, number>);

  // FIX: Associate projects with categories derived from services
  const projectsToCreate = contentData.projects.items.map((project: any) => {
    const { category, ...restOfProject } = project;
    const categoryId = categoryMap[category];
    if (!categoryId) {
        console.warn(`Warning: Category "${category}" for project "${project.title}" not found. Skipping project.`);
        return null;
    }
    return {
      ...restOfProject,
      categoryId: categoryId,
    };
  }).filter(Boolean); // Filter out nulls for projects with no category

  if(projectsToCreate.length > 0) {
    await prisma.project.createMany({
        data: projectsToCreate as any,
    });
    console.log('✅ Projects seeded.');
  }

  // --- Seed Statistics, Partners, About, Contact ---
  await prisma.statistic.createMany({ data: contentData.statistics.items });
  console.log('✅ Statistics seeded.');

  await prisma.partner.createMany({ data: contentData.partners.logos.map((logoUrl: string) => ({ logoUrl })) });
  console.log('✅ Partners seeded.');
  
  await prisma.about.create({ data: contentData.about });
  console.log('✅ About seeded.');
  
  await prisma.contact.create({ data: contentData.contact });
  console.log('✅ Contact seeded.');

  // --- Seed PageContent ---
  await prisma.pageContent.create({
    data: {
      pageName: 'services',
      title: 'Solusi Terintegrasi Dunia Teknik',
      subtitle: 'Menyediakan jasa perizinan hingga konstruksi untuk kebutuhan proyek Anda dengan standar kualitas terbaik dan profesional.',
    },
  });
  console.log('✅ PageContent for services seeded.');


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