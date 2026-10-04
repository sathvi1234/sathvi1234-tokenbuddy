/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/projects', destination: '/dashboard/projects', permanent: false },
      { source: '/playground', destination: '/dashboard/playground', permanent: false },
      { source: '/prompt-optimizer', destination: '/dashboard/prompt-optimizer', permanent: false },
      { source: '/analytics', destination: '/dashboard/analytics', permanent: false },
      { source: '/api-keys', destination: '/dashboard/api-keys', permanent: false },
      { source: '/billing', destination: '/dashboard/billing', permanent: false },
      { source: '/settings', destination: '/dashboard/settings', permanent: false },
      { source: '/model-router', destination: '/dashboard/model-router', permanent: false },
    ];
  },
}

export default nextConfig
