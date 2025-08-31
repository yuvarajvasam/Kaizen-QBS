/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Optimize for Vercel deployment
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', 'chrome-aws-lambda']
  },
  // Ensure proper image optimization
  images: {
    unoptimized: false,
  },
  // Handle chrome-aws-lambda in serverless environment
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('puppeteer-core', 'chrome-aws-lambda');
    }
    return config;
  },
}

module.exports = nextConfig
