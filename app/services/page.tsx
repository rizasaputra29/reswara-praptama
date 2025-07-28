import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServicesSection from '@/components/ServicesSection';
import AnimatedSection from '@/components/AnimatedSection';
import { getServicesPageContent } from '@/lib/data';

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
            backgroundImage: 'linear-gradient(to right, #183449 0%, #47525B 25%, #0C2A46 48%, #213950 66%, #0C1824 89%)'
          }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Our Services
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive solutions for all your construction and architectural needs
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Pass the full data directly to the component */}
        <ServicesSection
          title={content.title}
          subtitle={content.subtitle}
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