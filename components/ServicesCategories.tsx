// components/ServicesCategories.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import AnimatedSection from './AnimatedSection';
import { Button } from '@/components/ui/button';

// --- Type Definitions ---
interface SubService {
  id: number;
  title: string;
  description: string;
  image?: string | null;
}
interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  subServices: SubService[];
}
interface ServiceCategoriesProps {
  services: Service[];
  isHomePage?: boolean;
}

// --- Sub-Component: DynamicHoverServiceCard for displaying sub-services with hover effect ---
function DynamicHoverServiceCard({ image, title, description }: { image: string | undefined | null; title: string; description: string; }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!image) {
    return null;
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 cursor-pointer group hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay dengan gradient untuk teks yang lebih mudah dibaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500 opacity-0 group-hover:opacity-100"></div>
      </div>
      
      {/* Konten yang muncul saat hover */}
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: isHovered ? 0 : '100%', opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 p-6 text-white w-full"
      >
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </motion.div>
      
      {/* Konten default (tanpa hover) */}
      <div className="absolute bottom-0 p-6 text-white w-full transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
    </div>
  );
}

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ services, isHomePage }) => {
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No services are available at the moment.</p>
      </div>
    );
  }

  const [activeCategoryId, setActiveCategoryId] = useState<number>(services[0].id);

  const activeCategory = services.find(
    (service) => service.id === activeCategoryId
  ) || services[0];

  const subServicesToDisplay = activeCategory?.subServices || [];
  const showLearnMoreButton = (subServicesToDisplay.length > 6) && isHomePage;

  return (
    <div className="bg-white rounded-3xl border-x border-y p-8 md:p-12 mt-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
        Detail Layanan
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center mb-12">
        Pilih kategori untuk melihat layanan spesifik yang kami tawarkan di setiap bidang.
      </p>

      {/* Category Buttons - Generated Dynamically */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <div className="bg-gray-50 rounded-2xl p-2 flex flex-wrap gap-2">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveCategoryId(service.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategoryId === service.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>
      </div>

      <AnimatedSection key={activeCategory?.id}>
        {subServicesToDisplay.length > 0 ? (
          // Grid yang responsif dan fleksibel
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subServicesToDisplay.map((sub) => (
              <DynamicHoverServiceCard
                key={sub.id}
                image={sub.image}
                title={sub.title}
                description={sub.description}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Detail layanan untuk kategori ini akan segera tersedia.</p>
          </div>
        )}

        {showLearnMoreButton && (
          <div className="text-center mt-12">
            <Link href="/services" passHref>
              <Button className="px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-transform duration-300 hover:scale-105">
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>
        )}
      </AnimatedSection>
    </div>
  );
};

export default ServiceCategories;