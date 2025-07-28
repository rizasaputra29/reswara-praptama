// app/about/AboutClientComponent.tsx
"use client";

import { useEffect, useState } from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import WaveSeparator from '@/components/WaveSeperator'; // Fixed import to correct path: WaveSeparator, not WaveSeperator


interface AboutData {
  title: string;
  content: string;
  mission: string;
  vision: string;
  values: string[];
}

interface AboutClientComponentProps {
  content: AboutData | null;
}

const timelineEvents = [
  {
    year: '2019',
    title: 'Awal Berdiri',
    description:
      'CV. Reswara Praptama didirikan di Jawa Tengah sebagai perusahaan yang bergerak di bidang jasa konsultan teknik sipil, khususnya perencanaan infrastruktur dan penyelidikan tanah untuk proyek-proyek pembangunan di sektor publik dan swasta.',
  },
  {
    year: '2023',
    title: 'Ekspansi & Penguatan Kompetensi',
    description:
      'CV. Reswara Praptama memperluas jangkauan layanan ke seluruh Indonesia, termasuk jasa studi kelayakan dan pengadaan tanah.',
  },
  {
    year: '2025',
    title: 'Digitalisasi dan Integrasi Layanan',
    description:
      'CV. Reswara Praptama mulai mengadopsi pendekatan berbasis data dan teknologi dalam proses perencanaan serta penyelidikan tanah, meningkatkan efisiensi dan akurasi demi mendukung pembangunan berkelanjutan.',
  },
];

export default function AboutClientComponent({ content }: AboutClientComponentProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Dapatkan tinggi dokumen yang dapat digulir
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      // Dapatkan posisi gulir saat ini
      const scrolled = window.scrollY;

      let progress = 0;
      if (documentHeight > 0) {
        progress = scrolled / documentHeight;
      }
      
      // Pastikan nilai progres antara 0 dan 1
      progress = Math.min(Math.max(progress, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-900 text-xl">Loading page content...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative text-white py-24 md:py-48"
        style={{
          backgroundImage:
            'linear-gradient(110deg, #0734B6 0%, #85B9E9 24%, #2C71B2 48%, #3979B2 66%, #0B3055 89%)',
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection className='text-center'>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Mitra Rekayasa Teknik Terpercaya Anda
          </h1>
          <p className="text-lg md:text-xl opacity-80">
            Solusi Konsultan Teknik, Perencanaan, dan Penyelidikan Profesional bersama CV. Reswara
            Praptama
          </p>
          </AnimatedSection>
        </div>

        {/* SVG Wave at the bottom, similar to HeroSection */}
        <WaveSeparator />
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Tentang Kami</h2>
            <p className="text-gray-600 mt-4">{content.content}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Visi</h3>
                <p className="text-gray-600">{content.vision}</p>
              </div>
            </AnimatedSection>

            {/* Mission Card */}
            <AnimatedSection delay={0.4}>
              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Misi</h3>
                <p className="text-gray-600">{content.mission}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline-section" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Perjalanan Kami</h2>
            <p className="text-gray-600 mt-4">
              Sejak berdiri, CV. Reswara Praptama terus berkembang sebagai mitra strategis di bidang
              perencanaan teknik dan penyelidikan tanah.
            </p>
          </div>

          <div className="relative">
            {/* Vertical Line for Desktop */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-300 hidden md:block">
              <div
                className="absolute left-0 top-0 w-full bg-blue-500"
                style={{
                  height: `${scrollProgress * 100}%`,
                }}
              ></div>
            </div>
            {/* Vertical Line for Mobile */}
            <div className="absolute left-4 w-1 h-full bg-gray-300 md:hidden">
                <div
                    className="absolute left-0 top-0 w-full bg-blue-500"
                    style={{
                        height: `${scrollProgress * 100}%`,
                    }}
                ></div>
            </div>

            {/* Timeline Events */}
            <div className="space-y-12 md:space-y-0">
              {timelineEvents.map((event, index) => (
                <div key={index} className="relative md:grid md:grid-cols-2 md:gap-x-16 items-center">
                  {/* Konten untuk sisi kiri di desktop (indeks genap) */}
                  {index % 2 === 0 ? (
                    <>
                      {/* Kolom kiri untuk konten */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        className="md:col-start-1 md:col-end-2 md:text-right"
                      >
                        <div
                          className={`bg-white border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-full md:max-w-md md:ml-auto ml-12`}
                        >
                          <h3 className="text-xl font-bold text-gray-900">{event.year}</h3>
                          <h4 className="text-lg font-semibold text-gray-800 mt-2">{event.title}</h4>
                          <p className="text-gray-600 mt-2">{event.description}</p>
                        </div>
                      </motion.div>
                      {/* Placeholder untuk kolom kanan agar struktur grid tetap terjaga di desktop */}
                      <div className="hidden md:block md:col-start-2 md:col-end-3 h-full"></div>
                    </>
                  ) : (
                    <>
                      {/* Placeholder untuk kolom kiri agar struktur grid tetap terjaga di desktop */}
                      <div className="hidden md:block md:col-start-1 md:col-end-2 h-full"></div>
                      {/* Konten untuk sisi kanan di desktop (indeks ganjil) */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        className="md:col-start-2 md:col-end-3 md:text-left"
                      >
                        <div
                          className={`bg-white border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-full md:max-w-md md:mr-auto ml-12`}
                        >
                          <h3 className="text-xl font-bold text-gray-900">{event.year}</h3>
                          <h4 className="text-lg font-semibold text-gray-800 mt-2">{event.title}</h4>
                          <p className="text-gray-600 mt-2">{event.description}</p>
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}