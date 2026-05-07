import type { NextConfig } from "next";

// Proxy 설정
const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {

    // 환경변수 값 설정 + 기본값(로컬)
    const toUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api';
    return [
      {
        source: "/api/:path*", // 프론트엔드에서 /api로 시작하는 요청을 보내면
        //destination: "http://localhost/api/:path*", // 실제로는 렌더 백엔드 주소로 연결
        destination: `${toUrl}/:path*`, // 실제로는 렌더 백엔드 주소로 연결
      },
    ];
  },
};

export default nextConfig;
