/* Nex.js 전역설정 담당 파일 // 바닐라 리액트 - App.jsx ( 최상단 로직(초기화 로직) ) + Layout.jst ( 공통UI(헤더 / 푸터) ) - 전체 뼈대 */
// Metadata와 최상위 HTML 구조만 담당합니다
import { Metadata } from 'next';
import "./globals.css";
import RootClientLayout from './RootClientLayout';

// 서버에서 메타데이터를 내려주면, SEO와 파비콘이 즉시 적용
export const metadata: Metadata = {
  title: 'M',
  description: 'YM',
  icons: {
    icon: '/images/common/logo/logo3.jpg',
  },
};

  // Brand Color ( #488ad8 )
  // Round ( 2x1 / 3x1 )

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {/* 모든 클라이언트 사이드 로직(Zustand, Query, Auth) */}
        <RootClientLayout>
          {children}
        </RootClientLayout>
      </body>
    </html>
  );
}