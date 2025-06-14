/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000' 
      : 'http://44.205.249.75:5000'
  }
}

module.exports = nextConfig 