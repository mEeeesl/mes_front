import type { NextConfig } from "next";

// Proxy 설정
const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost/api/:path*", 
      },
    ];
  },
};

export default nextConfig;
