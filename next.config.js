
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  output: 'export',
  distDir: 'out',
  experimental: {
    serverTimeout: 60000
  }
}

module.exports = nextConfig
