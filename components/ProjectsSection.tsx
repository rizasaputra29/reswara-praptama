"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import ProjectCard from './ProjectCard';

interface Project {
  title: string;
  category: string;
  description: string;
  image: string;
  client?: string;
  completedDate?: string;
}

interface ProjectsSectionProps {
  title: string;
  subtitle: string;
  categories: string[];
  projects: Project[];
}

const ProjectsSection = ({ title, subtitle, categories, projects }: ProjectsSectionProps) => {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filteredProjects = activeCategory === 'Semua' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'Perencanaan & Desain': 'bg-blue-500',
      'Pengawasan': 'bg-green-500',
      'Perizinan': 'bg-yellow-500',
      'Studi': 'bg-purple-500',
      'Pengadaan Tanah': 'bg-red-500',
      'Pekerja Lain': 'bg-gray-500'
    };
    return colorMap[category] || 'bg-blue-500';
  };

  return (
    <section className="py-16 bg-white border-x border-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="bg-white border-x border-y rounded-3xl p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <div className="bg-gray-50 rounded-2xl p-2 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-white text-black shadow-md'
                        : 'text-gray-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  imageUrl={project.image}
                  category={project.category}
                  client={project.client}
                  completedDate={project.completedDate}
                  categoryColor={getCategoryColor(project.category)}
                />
              ))}
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProjectsSection;