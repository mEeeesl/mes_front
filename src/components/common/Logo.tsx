// components/common/Logo.tsx
import React from 'react';

interface LogoProps {
  type?: 'symbol' | 'full';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ type = 'full', className = '' }) => {
  if (type === 'symbol') {
    // 1. M 심볼 (M-Pillar 아이콘)
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 왼쪽 기둥 (깊이감 있는 컬러) */}
        <rect x="15" y="25" width="18" height="50" rx="9" fill="#2b5a9e" />
        {/* 오른쪽 기둥 (메인 컬러) */}
        <rect x="67" y="25" width="18" height="50" rx="9" fill="#488ad8" />
        {/* 연결부 (곡선 흐름) */}
        <path 
          d="M33 35C33 35 40 25 50 25C60 25 67 35 67 35V45C67 45 60 35 50 35C40 35 33 45 33 45V35Z" 
          fill="#488ad8" 
        />
        {/* 하단 연결 포인트 */}
        <circle cx="50" cy="40" r="7" fill="#7CB3F3" />
      </svg>
    );
  }

  // 2. 전체 로고 (M 심볼 + 텍스트)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo type="symbol" className="h-9 w-9" />
      <div className="flex flex-col justify-center leading-none">
        <span className="text-xl font-black text-gray-900 tracking-tight">
          Y<span className="text-[#488ad8]">M</span>
        </span>
        <span className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-0.5">
          Enterprise
        </span>
      </div>
    </div>
  );
};