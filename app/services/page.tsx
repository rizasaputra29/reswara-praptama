import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServicesSection from '@/components/ServicesSection';
import AnimatedSection from '@/components/AnimatedSection';
import { getServicesPageContent } from '@/lib/data'; // Import the server-side data fetching function
import WaveSeparator from '@/components/WaveSeperator';

type ServiceItem = {
  icon: string;
  // add other properties as needed
  [key: string]: any;
};

type ServicesPageContent = {
  title: string;
  subtitle: string;
  items: ServiceItem[];
};

export default async function ServicesPage() {
  // Fetch data on the server before rendering
  const content = await getServicesPageContent() as ServicesPageContent | null;

  // A safety check in case the database call fails
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
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Our Services
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive solutions for all your construction and architectural needs
              </p>
            </AnimatedSection>
          </div>
          <WaveSeparator />
        </section>

        {/* Pass the data directly to the component */}
        <ServicesSection
          title={content.title}
          subtitle={content.subtitle}
          services={content.items.map((item: ServiceItem) => ({
            title: item.title,
            description: item.description,
            icon: item.icon as "Building" | "FileText" | "Eye" | "BookOpen" | "MapPin" | "Users"
          }))}
        />
      </div>
      <Footer />
    </main>
  );
}