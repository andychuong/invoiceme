import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
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
