import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow larger FormData bodies for image uploads
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
