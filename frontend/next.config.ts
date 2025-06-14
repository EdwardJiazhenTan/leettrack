import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.API_BASE_URL || "http://44.205.249.75:5000"
        }/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
