// components/ServiceCategoriesFeature.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedSection from './AnimatedSection'; // Asumsikan AnimatedSection ada

// Definisikan interface untuk data kategori layanan
interface ServiceCategoryData {
  id: string; // ID unik untuk kategori (digunakan untuk state)
  name: string; // Nama yang ditampilkan di tombol kategori
  featuredTitle: string; // Judul untuk Featured Service Section
  featuredDescription: string; // Deskripsi untuk Featured Service Section
  imageUrl: string; // URL gambar untuk Featured Service Section
  imageOverlayText: { // Teks overlay pada gambar
    line1: string;
    line2: string;
  };
}

// Data untuk kategori layanan
const serviceCategoriesData: ServiceCategoryData[] = [
  {
    id: 'perencanaan-design',
    name: 'Perencanaan & Design',
    featuredTitle: 'Solusi Desain Profesional dan Siap Bangun',
    featuredDescription: 'Temukan layanan lengkap mulai dari desain arsitektur, perencanaan teknis, hingga gambar kerja yang sesuai standar regulasi. Kami bantu visualisasi ide Anda menjadi rencana yang matang dan dapat direalisasikan.',
    imageUrl: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    imageOverlayText: { line1: 'Perencanaan dan', line2: 'Design' },
  },
  {
    id: 'pengujian',
    name: 'Pengujian',
    featuredTitle: 'Analisis dan Pengujian Material Konstruksi Presisi',
    featuredDescription: 'Kami menyediakan layanan pengujian material konstruksi komprehensif untuk memastikan kualitas dan keamanan struktur Anda. Menggunakan metode terkini dan standar industri.',
    imageUrl: 'https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    imageOverlayText: { line1: 'Pengujian', line2: 'Material' },
  },
  {
    id: 'perizinan',
    name: 'Perizinan',
    featuredTitle: 'Bantuan Perizinan Proyek Konstruksi yang Mudah',
    featuredDescription: 'Fasilitasi seluruh proses perizinan bangunan dan lingkungan Anda. Dari pengajuan awal hingga persetujuan akhir, kami pastikan proyek Anda berjalan lancar sesuai regulasi.',
    imageUrl: 'https://images.pexels.com/photos/3771077/pexels-photo-3771077.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    imageOverlayText: { line1: 'Perizinan', line2: 'Konstruksi' },
  },
  {
    id: 'studi',
    name: 'Studi',
    featuredTitle: 'Studi Kelayakan dan Teknis Komprehensif',
    featuredDescription: 'Layanan studi kelayakan proyek, analisis dampak lingkungan (AMDAL), dan studi teknis lainnya untuk memastikan keberlanjutan dan kesuksesan proyek Anda dari awal.',
    imageUrl: 'https://images.pexels.com/photos/3771124/pexels-photo-3771124.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    imageOverlayText: { line1: 'Studi', line2: 'Kelayakan' },
  },
  {
    id: 'penyelidikan-tanah',
    name: 'Penyelidikan Tanah',
    featuredTitle: 'Investigasi Geoteknik Mendalam untuk Pondasi Kuat',
    featuredDescription: 'Melakukan penyelidikan tanah detail dan analisis geoteknik untuk menentukan karakteristik tanah, memastikan desain pondasi yang aman dan efisien bagi bangunan Anda.',
    imageUrl: 'https://images.pexels.com/photos/3771118/pexels-photo-3771118.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    imageOverlayText: { line1: 'Penyelidikan', line2: 'Tanah' },
  },
];

const ServiceCategories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(serviceCategoriesData[0].id);

  const currentCategoryData = serviceCategoriesData.find(
    (category) => category.id === activeCategory
  ) || serviceCategoriesData[0];

  return (
    <div className="bg-white rounded-3xl border-x border-y p-8 md:p-12">
      {/* Service Categories Navigation */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <div className="bg-gray-50 rounded-2xl p-2 flex flex-wrap gap-2">
          {serviceCategoriesData.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Service Section - Content is now dynamic */}
      <AnimatedSection delay={0.6} key={currentCategoryData.id}>
        <div className="bg-white rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="relative p-8 h-full rounded-2xl border-x border-y overflow-hidden">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {currentCategoryData.featuredTitle}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                {currentCategoryData.featuredDescription}
              </p>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={currentCategoryData.imageUrl}
                  alt={currentCategoryData.name}
                  fill
                  className="object-cover"
                />
                {/* Overlay Text */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h4 className="text-2xl font-bold mb-2">
                      {currentCategoryData.imageOverlayText.line1}
                    </h4>
                    <h4 className="text-2xl font-bold">
                      {currentCategoryData.imageOverlayText.line2}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default ServiceCategories;