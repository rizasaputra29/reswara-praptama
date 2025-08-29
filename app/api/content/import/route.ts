// app/api/content/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    await prisma.$transaction(async (tx) => {
      // Clear existing data (in correct order to respect foreign keys)
      await tx.subService.deleteMany({});
      await tx.project.deleteMany({});
      await tx.service.deleteMany({});
      await tx.statistic.deleteMany({});
      await tx.partner.deleteMany({});
      await tx.hero.deleteMany({});
      await tx.about.deleteMany({});
      await tx.contact.deleteMany({});
      await tx.timelineEvent.deleteMany({});
      await tx.pageContent.deleteMany({});


      // Import new data
      if (data.hero) {
        await tx.hero.createMany({ data: data.hero });
      }
      
      if (data.services) {
        for (const service of data.services) {
          const { subServices, ...serviceData } = service;
          const createdService = await tx.service.create({ data: serviceData });
          if (subServices && subServices.length > 0) {
            await tx.subService.createMany({
              data: subServices.map((sub: any) => ({
                ...sub,
                serviceId: createdService.id,
              })),
            });
          }
        }
      }
      if (data.projects) {
        const seededServices = await tx.service.findMany();
        const serviceMap = seededServices.reduce((acc, service) => {
          acc[service.title] = service.id;
          return acc;
        }, {} as Record<string, number>);

        // FIX: Perbaiki logika impor untuk membaca properti 'service' dari data backup
        await tx.project.createMany({
          data: data.projects.map((project: any) => {
            // Ambil nama layanan dari objek 'service' yang ada di data backup
            const serviceName = project.service?.title || null;
            
            if (!serviceName || !serviceMap[serviceName]) {
              console.error(`Skipping project due to invalid service category: ${project.title}`);
              return null;
            }
            
            // Hapus properti 'service' yang tidak diperlukan sebelum membuat data baru
            const { service, ...projectDataWithoutService } = project;
            
            return {
              ...projectDataWithoutService,
              serviceId: serviceMap[serviceName],
            };
          }).filter(Boolean),
        });
      }
      if (data.statistics) {
        await tx.statistic.createMany({ data: data.statistics });
      }
      if (data.partners) {
        await tx.partner.createMany({ data: data.partners });
      }
      if (data.about) {
        await tx.about.createMany({ data: data.about });
      }
      if (data.contact) {
        await tx.contact.createMany({ data: data.contact });
      }
      if (data.timelineEvents) {
        await tx.timelineEvent.createMany({ data: data.timelineEvents });
      }
      if (data.pageContent) {
        await tx.pageContent.createMany({ data: data.pageContent });
      }
    });

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/services');
    revalidatePath('/portfolio');
    revalidatePath('/contact');

    return NextResponse.json({ message: 'Content imported successfully.' });
  } catch (error) {
    console.error('Import content failed:', error);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}