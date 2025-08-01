// components/ProjectsSection.tsx
"use client";

import React, { useState } from 'react'; // Pastikan React diimpor
import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedSection from './AnimatedSection';
import ProjectCard from './ProjectCard';
import { Button } from '@/components/ui/button';

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
  isHomePage?: boolean;
  displayBackgroundCard?: boolean;
}

const ProjectsSection = ({ title, subtitle, categories, projects, isHomePage, displayBackgroundCard = true }: ProjectsSectionProps) => {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filteredProjects = activeCategory === 'Semua'
    ? projects
    : projects.filter(project => project.category === activeCategory);

  const projectsToDisplay = isHomePage ? filteredProjects.slice(0, 6) : filteredProjects;
  const showLoadMoreButton = (filteredProjects.length > 6) && isHomePage;

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      // 'Perencanaan & Desain': 'bg-blue-500',
      // 'Pengawasan': 'bg-green-500',
      // 'Perizinan': 'bg-yellow-500',
      // 'Studi': 'bg-purple-500',
      // 'Pengadaan Tanah': 'bg-red-500',
      // 'Pekerja Lain': 'bg-gray-500'
    };
    return colorMap[category] || 'bg-black/50 backdrop-blur-sm';
  };

  const content = (
    <>
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

      {/* Projects Grid dan View All Projects Button */}
      <div className="relative"> {/* Kontainer relative untuk grid dan gradien */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projectsToDisplay.map((project, index) => (
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

        {/* View All Projects Button, di atas gradien */}
        {showLoadMoreButton && (
          <div className="absolute inset-x-0 bottom-0 pt-16 pb-6 flex justify-center items-end z-10">
            <Link href="/portfolio" passHref>
              <Button className="px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-transform duration-300 hover:scale-105">
                Lihat Semua Proyek
              </Button>
            </Link>
          </div>
        )}
        
        {/* Overlay gradien untuk efek fade, dari bawah ke atas, lebih tinggi */}
        {filteredProjects.length > 6 && isHomePage && (
          <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
        )}
      </div>
    </>
  );

  return (
    <section className="pb-24 pt-16 bg-white border-x border-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          {displayBackgroundCard ? (
            <div className="bg-white border-x border-y rounded-3xl p-8 md:p-12">
              {content}
            </div>
          ) : (
            content
          )}
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProjectsSection;