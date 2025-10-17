import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  eslint: {
    // temporarily ignore ESLint during builds to prevent failures from generated files
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
