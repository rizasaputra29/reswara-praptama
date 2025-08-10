// lib/data.ts
import prisma from './prisma';

export async function getHomePageContent() {
  try {
    const hero = await prisma.hero.findFirst();
    const services = await prisma.service.findMany({
      orderBy: { id: 'asc' },
      include: {
        subServices: {
          orderBy: { id: 'asc' }
        }
      }
    });
    const projects = await prisma.project.findMany({ include: { service: true }, orderBy: { id: 'asc' } });
    const categories = await prisma.service.findMany({ orderBy: { id: 'asc' } });
    const statistics = await prisma.statistic.findMany({ orderBy: { id: 'asc' } });
    const partners = await prisma.partner.findMany({ orderBy: { id: 'asc' } });

    const validProjects = projects ? projects.filter(p => p.service) : [];
    const projectsData = {
      title: "Proyek Nyata, Bukti Nyata",
      subtitle: "Lihat bagaimana kami memberikan solusi terbaik untuk berbagai sektor melalui berbagai proyek yang telah kami kerjakan.",
      categories: ["Semua", ...(categories ? categories.map(c => c.title) : [])],
      items: validProjects.map(p => ({ ...p, category: p.service.title })),
    };

    const servicesData = {
      title: "Solusi Terintegrasi Dunia Teknik",
      subtitle: "Menyediakan jasa perizinan hingga konstruksi untuk kebutuhan proyek Anda dengan standar kualitas terbaik dan profesional.",
      items: services || [],
    };

    const statisticsData = { items: statistics || [] };
    
    const partnersData = {
      title: "Trusted by Leading Organizations",
      subtitle: "We're proud to work with industry leaders and trusted partners worldwide.",
      logos: partners ? partners.map(p => p.logoUrl) : [],
    };
    
    return { 
      hero: hero, 
      services: servicesData, 
      projects: projectsData, 
      statistics: statisticsData, 
      partners: partnersData 
    };

  } catch (error) {
    console.error("!!! DATABASE ERROR in getHomePageContent:", error);
    return null;
  }
}

export async function getPortfolioPageContent() {
    try {
      const projects = await prisma.project.findMany({ include: { service: true }, orderBy: { id: 'asc' } });
      const services = await prisma.service.findMany({ orderBy: { id: 'asc' }});
      const validProjects = projects ? projects.filter(p => p.service) : [];
      return {
          title: "Proyek Nyata, Bukti Nyata",
          subtitle: "Lihat bagaimana kami memberikan solusi terbaik untuk berbagai sektor melalui berbagai proyek yang telah kami kerjakan.",
          categories: ["Semua", ...(services ? services.map(c => c.title) : [])],
          items: validProjects.map(p => ({ ...p, category: p.service.title })),
      };
    } catch (error) {
      console.error("Database Error in getPortfolioPageContent:", error);
      return null;
    }
}

export async function getServicesPageContent() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { id: 'asc' },
      include: {
        subServices: {
          orderBy: { id: 'asc' },
        },
      },
    });

    const pageContent = await prisma.pageContent.findUnique({
      where: { pageName: 'services' },
    });

    if (!services || !pageContent) return null;

    return {
      title: pageContent.title,
      subtitle: pageContent.subtitle,
      items: services,
    };
  } catch (error) {
    console.error("Database Error in getServicesPageContent:", error);
    return null;
  }
}

export async function getContactContent() {
  try {
    const contact = await prisma.contact.findFirst();
    return contact;
  } catch (error) {
    console.error("Database Error in getContactContent:", error);
    return null;
  }
}

export async function getAboutContent() {
  try {
    const about = await prisma.about.findFirst();
    const timelineEvents = await prisma.timelineEvent.findMany({
      orderBy: { year: 'asc' }
    });
    return { about, timelineEvents };
  } catch (error) {
    console.error("Database Error in getAboutContent:", error);
    return null;
  }
}