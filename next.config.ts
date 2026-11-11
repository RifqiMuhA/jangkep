import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hanya WebP: AVIF memang sedikit lebih kecil, tetapi membuatnya sangat berat untuk CPU
    // sehingga kunjungan pertama ke halaman bergambar banyak bisa sangat lambat.
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
