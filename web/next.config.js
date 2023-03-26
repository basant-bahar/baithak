/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: { appDir: true },
  images: {
    domains: process.env.NEXT_PUBLIC_HOST.split(','),
  },
}

module.exports = nextConfig
