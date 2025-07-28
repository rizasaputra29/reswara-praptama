// app/portfolio/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectsSection from '@/components/ProjectsSection';
import AnimatedSection from '@/components/AnimatedSection';
import { getPortfolioPageContent } from '@/lib/data';
import WaveSeparator from '@/components/WaveSeperator';

export const revalidate = 0; // Force dynamic rendering

export default async function PortfolioPage() {
  const content = await getPortfolioPageContent();

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-xl">Could not load portfolio content.</div>
      </div>
    );
  }

  // Penting: Ubah struktur data 'projects' agar sesuai dengan komponen
  const projectsForComponent = content.items.map(item => ({
      ...item,
      image: item.image || '',
      description: item.description || '',
      client: item.client === null ? undefined : item.client,
      completedDate: item.completedDate === null ? undefined : item.completedDate,
      // 'category' sudah menjadi string dari lib/data.ts
  }));


  return (
    <main>
      <Navbar />
      <div>
        <section className="relative rounded-b-2xl text-white py-24 md:py-48"
          style={{
            backgroundImage: 'linear-gradient(110deg, #0734B6 0%, #85B9E9 24%, #2C71B2 48%, #3979B2 66%, #0B3055 89%)'
          }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Our Portfolio
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Explore our completed projects and see our expertise in action
              </p>
            </AnimatedSection>
          </div>
          <WaveSeparator />
        </section>

        <ProjectsSection
          title={content.title}
          subtitle={content.subtitle}
          categories={content.categories}
          projects={projectsForComponent}
          displayBackgroundCard={false}
        />
      </div>
      <Footer />
    </main>
  );
}