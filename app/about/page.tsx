// app/about/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutClientComponent from './AboutClientComponent';
import { getAboutContent } from '@/lib/data';

export const revalidate = 0;

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <main>
      <Navbar />
      {/* Pass both about content and timeline events to the client component */}
      <AboutClientComponent
        content={content?.about || null}
        timelineEvents={content?.timelineEvents || []}
      />
      <Footer />
    </main>
  );
}