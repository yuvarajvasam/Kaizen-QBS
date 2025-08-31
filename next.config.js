/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Optimize for Vercel deployment
  experimental: {
    serverComponentsExternalPackages: ['puppeteer']
  },
  // Ensure proper image optimization
  images: {
    unoptimized: false,
  },
  // Handle Puppeteer in serverless environment
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('puppeteer');
    }
    return config;
  },
}

module.exports = nextConfig
