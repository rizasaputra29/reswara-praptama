"use client";

import { useEffect, useState } from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';

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
      const timelineSection = document.getElementById('timeline-section');
      if (timelineSection) {
        const sectionRect = timelineSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate the scroll position relative to the document
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // Determine the start and end scroll points for the timeline animation
        // Animation starts when the bottom of the viewport reaches the top of the timeline section
        const animationStartScroll = timelineSection.offsetTop - viewportHeight;
        // Animation ends when the bottom of the timeline section is at the top of the viewport
        const animationEndScroll = timelineSection.offsetTop + sectionRect.height - viewportHeight;

        let progress = 0;

        if (scrollTop <= animationStartScroll) {
          progress = 0; // Not yet scrolled to the timeline section
        } else if (scrollTop >= animationEndScroll) {
          progress = 1; // Scrolled past the timeline section, or bottom of section is at top of viewport
        } else {
          // Calculate progress within the animation range
          progress = (scrollTop - animationStartScroll) / (animationEndScroll - animationStartScroll);
        }

        // Clamp the progress between 0 and 1
        progress = Math.min(Math.max(progress, 0), 1);
        setScrollProgress(progress);
      }
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
        className="relative text-white py-24 md:py-48" // Removed rounded-b-2xl as SVG will define the shape
        style={{
          backgroundImage:
            'linear-gradient(110deg, #0734B6 0%, #85B9E9 24%, #2C71B2 48%, #3979B2 66%, #0B3055 89%)',
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Mitra Rekayasa Teknik Terpercaya Anda
          </h1>
          <p className="text-lg md:text-xl opacity-80">
            Solusi Konsultan Teknik, Perencanaan, dan Penyelidikan Profesional bersama CV. Reswara
            Praptama
          </p>
        </div>

        {/* SVG Wave at the bottom, similar to HeroSection */}
        <div className="absolute bottom-0 left-0 w-full z-0">
          <svg
            className="block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,50 C360,-10 1080,110 1440,50 L1440,120 L0,120 Z"
            ></path>
          </svg>
        </div>
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
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Perjalanan Kami</h2>
            <p className="text-gray-600 mt-4">
              Sejak berdiri, CV. Reswara Praptama terus berkembang sebagai mitra strategis di bidang
              perencanaan teknik dan penyelidikan tanah.
            </p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-300">
              <div
                className="absolute left-0 top-0 w-full bg-blue-500"
                style={{
                  height: `${scrollProgress * 100}%`,
                }}
              ></div>
            </div>

            {/* Timeline Events */}
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  {/* Event Content */}
                  <div
                    className={`bg-white border border-gray-200 rounded-lg shadow-md p-6 w-full max-w-md ${
                      index % 2 === 0 ? 'ml-12' : 'mr-12'
                    }`}
                  >
                    <h3 className="text-xl font-bold text-gray-900">{event.year}</h3>
                    <h4 className="text-lg font-semibold text-gray-800 mt-2">{event.title}</h4>
                    <p className="text-gray-600 mt-2">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
