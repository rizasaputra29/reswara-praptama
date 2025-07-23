/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hapus atau komentari baris ini
  // output: 'export', 
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;