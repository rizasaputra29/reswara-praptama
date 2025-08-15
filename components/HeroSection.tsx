// components/HeroSection.tsx
"use client";

import React from 'react';
import WaveSeparator from './WaveSeperator';
import AnimatedSection from './AnimatedSection';
import { Button } from './ui/button';
import Link from 'next/link';

interface HeroProps {
  title: string;
  subtitle: string;
  buttonText: string;
}

const HeroSection: React.FC<HeroProps> = ({ title, subtitle, buttonText }) => {
  return (
    <section className="relative text-white py-24 md:py-48"
    style={{
      backgroundImage: 'linear-gradient(110deg, #0734B6 0%, #85B9E9 24%, #2C71B2 48%, #3979B2 66%, #0B3055 89%)'
    }}
      >
      <div className="container mx-auto px-4 text-center relative z-10">
        <AnimatedSection className='text-center'>
        <div className="inline-block bg-white bg-blur bg-opacity-20 text-sm md:text-base px-5 py-2 rounded-full mb-6 shadow-md">
          CV. Reswara Praptama • Profesionalisme No.1
        </div>

        <h1 className="max-w-4xl mx-auto text-center text-4xl md:text-6xl font-extrabold leading-tight mb-4">
          {title}
        </h1>

        <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto opacity-90">
          {subtitle}
        </p>

        <Link href="/contact" passHref>
          <button className="bg-white bg-blur bg-opacity-20 hover:bg-blur text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50">
            {buttonText}
          </button>
        </Link>
        </AnimatedSection>
      </div>

      {/* FIX: Ganti `WaveSeparator` dengan warna isian yang sama dengan latar belakang konten berikutnya */}
      <div className="text-white"> {/* Tambahkan `text-white` untuk menyelaraskan dengan warna latar belakang Hero */}
        <WaveSeparator />
      </div>
    </section>
  );
};

export default HeroSection;