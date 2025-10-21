import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'avatars.githubusercontent.com', // for Reown AppKit icons
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
    ],
  },
  // Fix for React 18 server components
  serverExternalPackages: ["@node-rs/xxhash", "@node-rs/crypto"],
};

export default nextConfig;
