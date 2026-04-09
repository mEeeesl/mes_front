// src/components/auth/AuthInitializer.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { getProfileApi, isInitialized, isLoading } = useAuthStore();

  useEffect(() => {
    // 앱이 처음 로드될 때 서버에 세션 정보가 있는지 확인 (HttpOnly Cookie 활용)
    getProfileApi();
  }, [getProfileApi]);

  // 초기화 중일 때 깜빡임(Flash of Unauthenticated Content)을 방지하기 위한 처리
  if (!isInitialized || isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        {/* 대기업 서비스라면 정교한 스켈레톤이나 로딩 스피너가 들어갈 자리입니다 */}
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}