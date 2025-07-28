"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import AnimatedSection from './AnimatedSection';

// Define the types for our data
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
}

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ services }) => {
  // First, check if the services data is available. If not, don't render the component.
  if (!services || services.length === 0) {
    return (
        <div className="text-center py-12 text-gray-500">
            <p>No services are available at the moment.</p>
        </div>
    );
  }

  // Now we can safely set the initial state because we know `services[0]` exists.
  const [activeCategoryId, setActiveCategoryId] = useState<number>(services[0].id);

  const activeCategory = services.find(
    (service) => service.id === activeCategoryId
  ) || services[0];

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

      {/* Sub-Services Grid - Displayed Dynamically */}
      <AnimatedSection key={activeCategory?.id}>
        {activeCategory?.subServices && activeCategory.subServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCategory.subServices.map((sub) => (
              <div key={sub.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full">
                {sub.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={sub.image}
                      alt={sub.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{sub.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{sub.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Detail layanan untuk kategori ini akan segera tersedia.</p>
          </div>
        )}
      </AnimatedSection>
    </div>
  );
};

export default ServiceCategories;