import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Force new build ID to bust cache
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Image optimization
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
