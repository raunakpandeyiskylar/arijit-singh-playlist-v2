import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['yt-dlp-exec'],
  },
};

export default nextConfig;
