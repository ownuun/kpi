/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@kpi/ui-components', '@kpi/database', '@kpi/shared-types'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

module.exports = nextConfig
