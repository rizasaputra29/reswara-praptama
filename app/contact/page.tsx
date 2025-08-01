// app/contact/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getContactContent } from '@/lib/data';
import ContactClientComponent from './ContactClientComponent';

// Memaksa halaman ini untuk selalu mengambil data terbaru di server
export const revalidate = 0;

export default async function Contact() {
  const content = await getContactContent();

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-900 text-xl">Could not load contact content.</div>
      </div>
    );
  }

  return (
    <main>
      <Navbar />
      <ContactClientComponent contactContent={content} />
      <Footer />
    </main>
  );
}