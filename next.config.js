/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'jlpt-professor.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
}

module.exports = withPWA(nextConfig)
