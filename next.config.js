/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Optimize for Vercel deployment
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium']
  },
  // Ensure proper image optimization
  images: {
    unoptimized: false,
  },
  // Handle @sparticuz/chromium in serverless environment
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('puppeteer-core', '@sparticuz/chromium');
    }
    return config;
  },
}

module.exports = nextConfig
