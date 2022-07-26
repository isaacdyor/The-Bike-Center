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
      'bicyclensw.org.au',
      'images.pexels.com',
      'i.pinimg.com',
    ],
  },
}

module.exports = nextConfig