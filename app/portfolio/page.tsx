"use client";

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectsSection from '@/components/ProjectsSection';
import AnimatedSection from '@/components/AnimatedSection';

interface ProjectsData {
  title: string;
  subtitle: string;
  categories: string[];
  items: Array<{
    title: string;
    category: string;
    description: string;
    image: string;
    client?: string;
    completedDate?: string;
  }>;
}

export default function Portfolio() {
  const [content, setContent] = useState<ProjectsData | null>(null);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setContent(data.projects));
  }, []);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main>
      <Navbar />
      <div>
        {/* Hero Section */}
        <section className="relative rounded-b-2xl text-white py-24 md:py-48"
      style={{
        backgroundImage: 'linear-gradient(to right, #183449 0%, #47525B 25%, #0C2A46 48%, #213950 66%, #0C1824 89%)'
      }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Our Portfolio
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Explore our completed projects and see our expertise in action
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Projects Section */}
        <ProjectsSection
          title={content.title}
          subtitle={content.subtitle}
          categories={content.categories}
          projects={content.items}
        />
      </div>
      <Footer />
    </main>
  );
}