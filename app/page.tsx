// app/page.tsx
// Hapus "use client"
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import ProjectsSection from '@/components/ProjectsSection';
import StatisticsSection from '@/components/StatisticsSection';
import PartnersSection from '@/components/PartnersSection';
import { getHomePageContent } from '@/lib/data';

// 1. TAMBAHKAN BARIS INI untuk memaksa halaman selalu dinamis
export const revalidate = 0;

export default async function Home() {
  const content = await getHomePageContent();

  if (!content || !content.hero) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-xl">Failed to load page content.</div>
      </div>
    );
  }

  return (
    <main>
      <Navbar />
      
      {/* 2. KIRIM DATA ke HeroSection sebagai props */}
      <HeroSection 
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        buttonText={content.hero.buttonText}
      />

      <ServicesSection
        title={content.services.title}
        subtitle={content.services.subtitle}
        services={content.services.items.map((service: any) => ({
          ...service,
          icon: service.icon as "Building" | "FileText" | "Eye" | "BookOpen" | "MapPin" | "Users",
        }))}
        isHomePage={true}
      />
      <ProjectsSection
        title={content.projects.title}
        subtitle={content.projects.subtitle}
        categories={content.projects.categories.map((cat: string | number) => String(cat))}
        projects={content.projects.items.map((project: any) => ({
          ...project,
          client: project.client === null ? undefined : project.client,
        }))}
        isHomePage={true}
      />
      <StatisticsSection
        statistics={content.statistics.items.map((stat: any) => ({
          ...stat,
          icon: stat.icon as "Building" | "Users" | "Award",
        }))}
      />
      <PartnersSection
        title={content.partners.title}
        subtitle={content.partners.subtitle}
        logos={content.partners.logos}
      />
      <Footer />
    </main>
  );
}