import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
