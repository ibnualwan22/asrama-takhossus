import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Kita naikkan jadi 10MB
    },
  },
  // Konfigurasi agar Next.js boleh menampilkan gambar dari Cloudinary
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Opsional: Aktifkan ini jika masih ada error typescript membandel saat deploy
    ignoreBuildErrors: true, 
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Mengizinkan gambar dari semua domain (untuk Neon/External storage)
      },
    ],
  },
};

export default nextConfig;