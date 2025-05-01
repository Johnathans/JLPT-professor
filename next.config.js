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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  // Enable JSON imports and handle Kuroshiro modules
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });

    // Handle Kuroshiro modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      stream: false,
      zlib: false,
    };

    return config;
  },
}

module.exports = withPWA(nextConfig)
