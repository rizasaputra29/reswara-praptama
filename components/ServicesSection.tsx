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
import AnimatedSection from './AnimatedSection';
import ServiceCardsGrid from './ServicesGrid';
// Correctly named component import
import ServiceCategories from './ServicesCategories'; 

const iconMap = {
  Building,
  FileText,
  Eye,
  BookOpen,
  MapPin,
  Users,
};

// Define the types to include sub-services
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
  icon: keyof typeof iconMap;
  subServices: SubService[];
}

interface ServicesSectionProps {
  title: string;
  subtitle: string;
  services: Service[];
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

            {/* Render the main service cards grid */}
            <ServiceCardsGrid services={services} />

            {/* FIX: Pass the 'services' data down to the ServiceCategories component */}
            <ServiceCategories services={services} />
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ServicesSection;