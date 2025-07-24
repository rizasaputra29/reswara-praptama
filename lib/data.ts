// lib/data.ts
import prisma from './prisma';

export async function getHomePageContent() {
  try {
    const hero = await prisma.hero.findFirst();
    const services = await prisma.service.findMany({ orderBy: { id: 'asc' } });
    const projects = await prisma.project.findMany({ include: { category: true }, orderBy: { id: 'asc' } });
    const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } });
    const statistics = await prisma.statistic.findMany({ orderBy: { id: 'asc' } });
    const partners = await prisma.partner.findMany({ orderBy: { id: 'asc' } });

    const validProjects = projects ? projects.filter(p => p.category) : [];
    const projectsData = {
      title: "Proyek Nyata, Bukti Nyata",
      subtitle: "Lihat bagaimana kami memberikan solusi terbaik untuk berbagai sektor melalui berbagai proyek yang telah kami kerjakan.",
      categories: ["Semua", ...(categories ? categories.map(c => c.name) : [])],
      items: validProjects.map(p => ({ ...p, category: p.category.name })),
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
      const projects = await prisma.project.findMany({ include: { category: true }, orderBy: { id: 'asc' } });
      const categories = await prisma.category.findMany({ orderBy: { id: 'asc' }});
      const validProjects = projects ? projects.filter(p => p.category) : [];
      return {
          title: "Proyek Nyata, Bukti Nyata",
          subtitle: "Lihat bagaimana kami memberikan solusi terbaik untuk berbagai sektor melalui berbagai proyek yang telah kami kerjakan.",
          categories: ["Semua", ...(categories ? categories.map(c => c.name) : [])],
          items: validProjects.map(p => ({ ...p, category: p.category.name })),
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
    });
    if (!services) return null;
    return {
      title: "Solusi Terintegrasi Dunia Teknik",
      subtitle: "Menyediakan jasa perizinan hingga konstruksi untuk kebutuhan proyek Anda dengan standar kualitas terbaik dan profesional.",
      items: services,
    };
  } catch (error) {
    console.error("Database Error in getServicesPageContent:", error);
    return null;
  }
}

// Fungsi baru untuk mengambil data kontak
export async function getContactContent() {
  try {
    const contact = await prisma.contact.findFirst();
    return contact;
  } catch (error) {
    console.error("Database Error in getContactContent:", error);
    return null;
  }
}
