/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Ensure proper image optimization
  images: {
    unoptimized: false,
  },
}

module.exports = nextConfig
