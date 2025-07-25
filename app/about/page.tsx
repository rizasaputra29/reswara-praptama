import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutClientComponent from './AboutClientComponent';
import { getAboutContent } from '@/lib/data';

// Memaksa halaman untuk selalu mengambil data terbaru dari server
export const revalidate = 0;

// Ini sekarang menjadi Komponen Server yang bisa menggunakan async/await
export default async function AboutPage() {
  // Mengambil data di sisi server
  const content = await getAboutContent();

  return (
    <main>
      <Navbar />
      {/* Melewatkan data yang sudah diambil ke komponen klien */}
      <AboutClientComponent content={content} />
      <Footer />
    </main>
  );
}
