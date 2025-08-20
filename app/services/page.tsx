import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServicesSection from '@/components/ServicesSection';
import AnimatedSection from '@/components/AnimatedSection';
import { getServicesPageContent } from '@/lib/data';
import WaveSeparator from '@/components/WaveSeperator';

// Define the correct types for the page content
interface SubService {
  id: number;
  title: string;
  description: string;
  image?: string | null;
}
interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  subServices: SubService[];
}
interface ServicesPageContent {
  title: string;
  subtitle: string;
  items: ServiceItem[];
};

// 1. TAMBAHKAN BARIS INI untuk memastikan halaman selalu mengambil data terbaru
export const revalidate = 0;

export default async function ServicesPage() {
  const content = await getServicesPageContent() as ServicesPageContent | null;

  if (!content || !content.items) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-xl">Could not load services content.</div>
      </div>
    );
  }

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
              {/* 2. GANTI TEKS HARDCODE dengan data dari database */}
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                {content.title}
              </h1>
              <p className="text-xl text-white font-light max-w-3xl mx-auto">
                {content.subtitle}
              </p>
            </AnimatedSection>
          </div>
          <WaveSeparator />
        </section>

        {/* Pass the full data directly to the component */}
        <ServicesSection
          title=""
          subtitle=""
          services={content.items.map((item) => ({
            ...item,
            icon: item.icon as "Building" | "FileText" | "Eye" | "BookOpen" | "MapPin" | "Users"
          }))}
        />
      </div>
      <Footer />
    </main>
  );
}
