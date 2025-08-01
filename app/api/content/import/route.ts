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
      await tx.category.deleteMany({});
      await tx.statistic.deleteMany({});
      await tx.partner.deleteMany({});
      await tx.hero.deleteMany({});
      await tx.about.deleteMany({});
      await tx.contact.deleteMany({});

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
        const uniqueCategories = Array.from(new Set(data.projects.map((p: any) => p.category?.name)));
        const existingCategories = await tx.category.findMany();
        
        const categoriesToCreate = uniqueCategories
          .filter((uc): uc is string => typeof uc === 'string' && !existingCategories.some((ec) => ec.name === uc))
          .map((name) => ({ name }));

        if (categoriesToCreate.length > 0) {
          await tx.category.createMany({ data: categoriesToCreate });
        }

        const updatedCategories = await tx.category.findMany();
        const categoryMap = updatedCategories.reduce((acc, cat) => {
          acc[cat.name] = cat.id;
          return acc;
        }, {} as Record<string, number>);

        await tx.project.createMany({
          data: data.projects.map((project: any) => {
            const { category, ...projectDataWithoutCategory } = project;
            const categoryName = category?.name;
            if (typeof categoryName !== 'string' || !categoryMap[categoryName]) {
              console.error(`Skipping project due to invalid category: ${project.title}`);
              return null;
            }
            
            return {
              ...projectDataWithoutCategory,
              categoryId: categoryMap[categoryName],
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