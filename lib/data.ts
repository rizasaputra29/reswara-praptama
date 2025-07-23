// lib/data.ts
import prisma from './prisma';

export async function getHomePageContent() {
  try {
    console.log("Fetching Hero data...");
    const hero = await prisma.hero.findFirst();
    if (!hero) console.warn("Warning: Hero data is missing.");

    console.log("Fetching Services data...");
    const services = await prisma.service.findMany({ orderBy: { id: 'asc' } });

    console.log("Fetching Projects and Categories data...");
    const projects = await prisma.project.findMany({ include: { category: true }, orderBy: { id: 'asc' } });
    const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } });
    
    console.log("Fetching Statistics data...");
    const statistics = await prisma.statistic.findMany({ orderBy: { id: 'asc' } });
    
    console.log("Fetching Partners data...");
    const partners = await prisma.partner.findMany({ orderBy: { id: 'asc' } });

    console.log("All data fetched successfully. Processing...");

    // Safe data processing
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
    
    console.log("Data processed. Returning content.");
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
// ... (Keep the other functions in this file as they are)
// Make sure getPortfolioPageContent is also safe
async function getPortfolioPageContent() {
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


// Dummy implementation for getServicesPageContent to fix the error
async function getServicesPageContent() {
  // TODO: Replace with actual implementation
  return null;
}

// Export all functions
export { 
    getServicesPageContent,
    getPortfolioPageContent
};