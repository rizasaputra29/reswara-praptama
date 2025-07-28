"use client";

import { motion } from 'framer-motion';
import { Building, Users, Award } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const iconMap = {
  Building,
  Users,
  Award
};

interface Statistic {
  number: string;
  label: string;
  icon: keyof typeof iconMap;
}

interface StatisticsSectionProps {
  statistics: Statistic[];
}

const StatisticsSection = ({ statistics }: StatisticsSectionProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="rounded-3xl border-x border-y p-8 md:p-12"
            style={{
              backgroundImage: 'linear-gradient(110deg, #0734B6 0%, #85B9E9 24%, #2C71B2 48%, #3979B2 66%, #0B3055 89%)'
            }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Total Proyek dan Klien
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {statistics.map((stat, index) => {
                const IconComponent = iconMap[stat.icon];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6">
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                      className="text-5xl md:text-6xl font-bold text-white mb-2"
                    >
                      {stat.number}
                    </motion.div>
                    <p className="text-xl text-gray-300">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default StatisticsSection;