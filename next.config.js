/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. PENTING: Mencegah bundling Prisma yang bikin RAM meledak
  // (Harus di luar 'experimental' untuk Next.js 15)
  serverExternalPackages: ['@prisma/client', 'prisma', 'bcryptjs'],

  // 2. HEMAT RAM: Matikan pengecekan Eslint & TS saat build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // 3. Optimasi Gambar
  images: { 
    unoptimized: true 
  },
  
  // 4. LOW RESOURCE MODE (Wajib untuk VPS agar tidak crash/SIGBUS)
  experimental: {
    workerThreads: false,     // Matikan multi-threading
    cpus: 1,                  // Pakai 1 core saja agar stabil
    webpackMemoryOptimizations: true, 
  },
  
  // 5. Pastikan Prisma tidak ikut dibundle Webpack
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client', 'bcryptjs')
    }
    return config
  }
};

module.exports = nextConfig;