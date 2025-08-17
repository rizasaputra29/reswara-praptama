// components/PartnersSection.tsx
"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedSection from './AnimatedSection';
import { Button } from './ui/button';
import { useState } from 'react';

interface PartnersSectionProps {
  title: string;
  subtitle: string;
  logos: string[];
}

const PartnersSection = ({ title, subtitle, logos }: PartnersSectionProps) => {
  // Set jumlah logo yang ditampilkan di awal menjadi 10 untuk desktop dan 6 untuk mobile
  const initialVisibleCount = 10;
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const showAll = visibleCount >= logos.length;

  const handleShowAll = () => {
    setVisibleCount(logos.length);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="bg-white rounded-3xl border-x border-y p-8 md:p-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            </div>

            {/* Menyesuaikan grid agar responsif: 2 kolom di mobile, 3 di sm, 4 di md, dan 5 di lg */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {logos.slice(0, visibleCount).map((logo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="relative w-16 h-16 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image
                      src={logo}
                      alt={`Partner ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {!showAll && (
              <div className="text-center mt-12">
                <Button 
                  onClick={handleShowAll}
                  className="px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  Lihat Semua Partner
                </Button>
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PartnersSection;