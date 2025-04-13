
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  experimental: {
    serverTimeout: 60000
  }
}

module.exports = nextConfig
