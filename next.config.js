/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webPack5: true,
  webpack: (config) => {
    config.resolve.fallback = {fs: false};
    return config;
  },
  images: {
    domains: [
      'maps.google.com',
    ],
  },
}

module.exports = nextConfig