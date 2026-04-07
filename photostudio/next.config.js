/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "www.mymotherhoodmadeeasy.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8090",
      },
      {
        protocol: "https",
        hostname: "th.bing.com",
      },
    ],
    // Optimize images further
    formats: ['image/webp', 'image/avif'],
  },
  // Enable compression
  compress: true,
  // Optimize build output
  swcMinify: true,
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react"],
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
