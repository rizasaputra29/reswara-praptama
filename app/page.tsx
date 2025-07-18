"use client";

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import ProjectsSection from '@/components/ProjectsSection';
import StatisticsSection from '@/components/StatisticsSection';
import PartnersSection from '@/components/PartnersSection';

interface ContentData {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    image: string;
  };
  services: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  projects: {
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
  };
  statistics: {
    items: Array<{
      number: string;
      label: string;
      icon: string;
    }>;
  };
  partners: {
    title: string;
    subtitle: string;
    logos: string[];
  };
}

export default function Home() {
  const [content, setContent] = useState<ContentData | null>(null);

  useEffect(() => {
    // Track visit
    fetch('/api/visits', { method: 'POST' });

    // Load content
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setContent(data));
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
      <HeroSection/>
      <ServicesSection
        title={content.services.title}
        subtitle={content.services.subtitle}
        services={content.services.items.map(service => ({
          ...service,
          icon: service.icon as "Building" | "FileText" | "Eye" | "BookOpen" | "MapPin" | "Users",
        }))}
      />
      <ProjectsSection
        title={content.projects.title}
        subtitle={content.projects.subtitle}
        categories={content.projects.categories}
        projects={content.projects.items}
      />
      <StatisticsSection
        statistics={content.statistics.items.map(stat => ({
          ...stat,
          icon: stat.icon as "Building" | "Users" | "Award",
        }))}
      />
      <PartnersSection
        title={content.partners.title}
        subtitle={content.partners.subtitle}
        logos={content.partners.logos}
      />
      <Footer />
    </main>
  );
}