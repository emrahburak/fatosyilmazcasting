import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.timerightproduction.org',
        pathname: '/fatosyilmazcasting/**',
      },
    ],
  },
};

export default nextConfig;
