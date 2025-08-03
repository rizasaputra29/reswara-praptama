"use client";

import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  client?: string;
  completedDate?: string;
  categoryColor?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  imageUrl,
  category,
  client = "TechConstruct Client",
  completedDate = "2024",
  categoryColor = 'bg-blue-500'
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
        {/* Category Badge */}
        <div className={`absolute top-4 left-4 ${categoryColor} text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg`}>
          {category}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {description}
        </p>
        
        {/* Client and Date Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Kota: {client}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;