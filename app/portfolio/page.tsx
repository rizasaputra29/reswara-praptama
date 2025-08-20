// app/portfolio/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectsSection from '@/components/ProjectsSection';
import AnimatedSection from '@/components/AnimatedSection';
import { getPortfolioPageContent } from '@/lib/data';
import WaveSeparator from '@/components/WaveSeperator';
// Hapus impor Category

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

  const projectsForComponent = content.items.map(item => ({
      ...item,
      image: item.image || '',
      description: item.description || '',
      client: item.client === null ? undefined : item.client,
      completedDate: item.completedDate === null ? undefined : item.completedDate,
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
                Proyek Nyata, Bukti Nyata
              </h1>
              <p className="text-xl font-light text-white max-w-3xl mx-auto">
                Lihat bagaimana kami memberikan solusi terbaik untuk berbagai sektor melalui berbagai proyek yang telah kami kerjakan
              </p>
            </AnimatedSection>
          </div>
          <WaveSeparator />
        </section>

        <ProjectsSection
          title=""
          subtitle=""
          categories={content.categories}
          projects={projectsForComponent}
          displayBackgroundCard={false}
        />
      </div>
      <Footer />
    </main>
  );
}