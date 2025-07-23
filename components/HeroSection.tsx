"use client"; // Komponen ini perlu 'use client' jika ada interaksi, jadi kita biarkan saja

import React from 'react';

// 1. Definisikan tipe untuk props
interface HeroProps {
  title: string;
  subtitle: string;
  buttonText: string;
}

// 2. Terima props di dalam komponen
const HeroSection: React.FC<HeroProps> = ({ title, subtitle, buttonText }) => {
  return (
    <section className="relative min-h-screen text-white py-28 md:py-48"
      style={{
        backgroundImage: 'linear-gradient(to right, #183449 0%, #47525B 25%, #0C2A46 48%, #213950 66%, #0C1824 89%)'
      }}
      >
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-block bg-white bg-blur bg-opacity-20 text-sm md:text-base px-5 py-2 rounded-full mb-6 shadow-md">
          CV. Reswara Praptama • Profesionalisme No.1
        </div>

        {/* 3. Gunakan data dari props, bukan hardcoded */}
        <h1 className="max-w-4xl mx-auto text-center text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
          {title}
        </h1>

        <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto opacity-90">
          {subtitle}
        </p>

        <button className="bg-white bg-blur bg-opacity-20 hover:bg-blur text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4  focus:ring-opacity-50">
          {buttonText}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-0">
        <svg
          className="block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,0 C360,160 1080,160 1440,0 L1440,120 L0,120 Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;