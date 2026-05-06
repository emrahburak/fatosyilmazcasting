import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
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
