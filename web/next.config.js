/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_UPLOAD_PROTOCOL,
        hostname: process.env.NEXT_PUBLIC_UPLOAD_HOST,
        port: process.env.NEXT_PUBLIC_UPLOAD_PORT,
        pathname: process.env.NEXT_PUBLIC_UPLOAD_PATH + '/**',
      },
    ]
  }
}

module.exports = nextConfig
