/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export to allow server-side rendering and API routes
  // output: 'export', 
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  
  // Add experimental features to help with module resolution
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  },
  
  // Ensure proper webpack configuration for Prisma
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client')
    }
    return config
  }
};

module.exports = nextConfig;