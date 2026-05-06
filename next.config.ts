import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
