import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@sodax/sdk',
    '@sodax/wallet-sdk',
    '@sodax/dapp-kit',
    '@sodax/types',
  ],
  turbopack: {},
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;
