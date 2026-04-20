'use client';

import QueryProvider from '@/providers/QueryProvider';
import AuthProvider from '@/providers/AuthProvider'; // 경로 확인 필수
import Header from '@/components/layout/common/Header';
import GlobalModal from '@/components/common/modal/GlobalModal';

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {/* AuthProvider 안에서 인증이 완료되어야 Header와 메인이 보입니다. */}
        <Header />
        <main>
          {children}
          <GlobalModal />
        </main>
      </AuthProvider>
    </QueryProvider>
  );
}