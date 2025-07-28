import React from 'react';
import { motion } from 'framer-motion';
import { Building, FileText, Eye, BookOpen, MapPin, Users, ArrowRight } from 'lucide-react';
import AnimatedCard from './AnimatedCard'; // Asumsikan AnimatedCard ada

// Definisikan ulang iconMap jika ServiceCardsGrid tidak menerima iconMap sebagai prop
const iconMap = {
  Building,
  FileText,
  Eye,
  BookOpen,
  MapPin,
  Users
};

interface Service {
  title: string;
  description: string;
  icon: keyof typeof iconMap;
}

interface ServiceCardsGridProps {
  services: Service[];
}

const ServiceGrid: React.FC<ServiceCardsGridProps> = ({ services }) => {
  return (
    <>
      {/* Services Grid - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {services.slice(0, 3).map((service, index) => {
          const IconComponent = iconMap[service.icon];
          return (
            <AnimatedCard key={`service-top-${index}`}>
              <div className="bg-white rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                  <IconComponent className="h-8 w-8 text-gray-600 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-900 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </AnimatedCard>
          );
        })}
      </div>

      {/* Services Grid - Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {services.slice(3, 6).map((service, index) => { // Updated slice to (3, 6) to include the 6th service
          const IconComponent = iconMap[service.icon];
          return (
            <AnimatedCard key={`service-bottom-${index}`}>
              <div className="bg-white rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                  <IconComponent className="h-8 w-8 text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-900 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </AnimatedCard>
          );
        })}
      </div>
    </>
  );
};

export default ServiceGrid;