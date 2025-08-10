// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // --- Clear existing data (update for new schema) ---
  await prisma.project.deleteMany({});
  await prisma.subService.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.statistic.deleteMany({});
  await prisma.partner.deleteMany({});
  await prisma.hero.deleteMany({});
  await prisma.about.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.timelineEvent.deleteMany({});
  await prisma.pageContent.deleteMany({});
  await prisma.visitStats.deleteMany({});
  console.log('Cleared previous data.');

  // --- Load data from JSON files ---
  const contentPath = path.join(process.cwd(), 'data', 'content.json');
  const contentFile = fs.readFileSync(contentPath, 'utf-8');
  const contentData = JSON.parse(contentFile);
  

  // --- Seed Hero ---
  await prisma.hero.create({ data: contentData.hero });
  console.log('✅ Hero seeded.');
  
  // --- Seed Services and SubServices ---
  for (const service of contentData.services.items) {
    const { subServices, ...serviceData } = service;
    
    const createdService = await prisma.service.create({
      data: {
        title: serviceData.title,
        description: serviceData.description,
        icon: serviceData.icon,
      },
    });
    
    if (subServices && subServices.length > 0) {
      await prisma.subService.createMany({
        data: subServices.map((sub: any) => ({
          ...sub,
          serviceId: createdService.id,
        })),
      });
    }
  }
  const seededServices = await prisma.service.findMany();
  const serviceMap = seededServices.reduce((acc: Record<string, number>, service) => {
    acc[service.title] = service.id;
    return acc;
  }, {});
  console.log('✅ Services and SubServices seeded.');

  // --- Seed Projects ---
  const projectsToCreate = contentData.projects.items.map((project: any) => {
    const { category, ...restOfProject } = project;
    return {
      ...restOfProject,
      serviceId: serviceMap[category], // Gunakan serviceId dari peta
    };
  });

  await prisma.project.createMany({
    data: projectsToCreate,
  });
  console.log('✅ Projects seeded.');

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