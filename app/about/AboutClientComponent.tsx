"use client";

import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';

// Tipe data untuk konten halaman "About"
interface AboutData {
  title: string;
  content: string;
  mission: string;
  vision: string;
  values: string[];
}

// Tipe untuk props komponen ini
interface AboutClientComponentProps {
  content: AboutData | null;
}

export default function AboutClientComponent({ content }: AboutClientComponentProps) {
  // Tampilkan pesan loading jika data belum tersedia
  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-xl">Loading page content...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative rounded-b-2xl text-white py-24 md:py-48"
        style={{
          backgroundImage: 'linear-gradient(to right, #183449 0%, #47525B 25%, #0C2A46 48%, #213950 66%, #0C1824 89%)'
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {content.title}
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-white border-x border-y rounded-3xl shadow-lg p-8 md:p-12">
              <div className="max-w-4xl mx-auto">
                <p className="text-xl text-gray-600 leading-relaxed mb-12">
                  {content.content}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                <AnimatedSection delay={0.2}>
                  <div className="bg-blue-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {content.mission}
                    </p>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.4}>
                  <div className="bg-slate-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {content.vision}
                    </p>
                  </div>
                </AnimatedSection>
              </div>

              <AnimatedSection delay={0.6} className="mt-16">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8">Our Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {content.values.map((value, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300"
                      >
                        <div className="text-lg font-semibold text-gray-900">
                          {value}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
