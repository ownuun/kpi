import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude .md files from being parsed by webpack
      config.module.rules.push({
        test: /\.md$/,
        type: 'asset/source',
      });
    }
    return config;
  },
  // Explicitly mark these packages as external for server-side
  serverExternalPackages: ['@libsql/client', '@prisma/adapter-libsql'],
};

export default nextConfig;
