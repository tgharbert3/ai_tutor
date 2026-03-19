import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "http://localhost:80/auth/v1/:path*"
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:80/api/v1/:path*"
      }
    ]
  }
};

export default nextConfig;
