// app/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import ProjectsSection from '@/components/ProjectsSection';
import StatisticsSection from '@/components/StatisticsSection';
import PartnersSection from '@/components/PartnersSection';
import { getHomePageContent } from '@/lib/data';

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

  const projectCount = content.projects.items.length;
  const partnerCount = content.partners.logos.length;
  // FIX: Ambil subservicesCount yang baru dari `content`
  const subservicesCount = content.subservicesCount;

  return (
    <main>
      <Navbar />
      
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
        categories={content.projects.categories}
        projects={content.projects.items.map((project: any) => ({
          ...project,
          client: project.client === null ? undefined : project.client,
        }))}
        isHomePage={true}
        displayBackgroundCard={true}
      />
      
      <StatisticsSection
        projectsCount={projectCount}
        partnersCount={partnerCount}
        subservicesCount={subservicesCount}
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