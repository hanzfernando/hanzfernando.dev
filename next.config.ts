import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['ws'],
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.shields.io',
      },
      {
        protocol: 'https',
        hostname: 'custom-icon-badges.demolab.com',
      }
    ],
  },
};

export default nextConfig;
