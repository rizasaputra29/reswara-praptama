// ServicesSection.tsx (Komponen utama yang menyusun)
"use client";

import { motion } from 'framer-motion';
import { 
  Building, 
  FileText, 
  Eye, 
  BookOpen, 
  MapPin, 
  Users,
  ArrowRight
} from 'lucide-react';
import AnimatedSection from './AnimatedSection'; // Tetap gunakan jika membungkus seluruh section
import ServiceCardsGrid from './ServicesGrid'; // Import komponen baru
import ServiceCategoriesFeature from './ServicesCategories'; // Import komponen baru

// iconMap dan interface Service masih diperlukan jika services prop dilewatkan
const iconMap = {
  Building: Building, // Import Building jika digunakan di services, otherwise remove
  FileText: FileText, // ...
  Eye: Eye,
  BookOpen: BookOpen,
  MapPin: MapPin,
  Users: Users,
};

interface Service {
  title: string;
  description: string;
  icon: keyof typeof iconMap;
}

interface ServicesSectionProps {
  title: string;
  subtitle: string;
  services: Service[]; // Prop ini akan diteruskan ke ServiceCardsGrid
}

const ServicesSection = ({ title, subtitle, services }: ServicesSectionProps) => {
  return (
    <section className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            </div>

            {/* Render komponen ServiceCardsGrid */}
            <ServiceCardsGrid services={services} />

            {/* Render komponen ServiceCategoriesFeature */}
            <ServiceCategoriesFeature />
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ServicesSection;