// src/providers/QueryProvider.tsx
'use client'; // 클라이언트 사이드에서 실행됨을 명시

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 창을 다시 포커스했을 때 서버 생존 확인 (자동으로 데이터를 다시 가져올지) 여부 (기본값 true)
            refetchOnWindowFocus: true, 
            // 데이터 요청 실패 시 재시도 횟수
            retry: 1, // 실패 시 1번만 재시도
        },
    },
});

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    // 1. QueryClient 인스턴스를 생성합니다. 
    // useState를 사용하여 리렌더링 시에도 동일한 client 인스턴스를 유지하게 합니다.
    // 리렌더링 시에도 client가 초기화되지 않도록 useState로 관리
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
        queries: {
            // 창을 다시 포커스했을 때 자동으로 데이터를 다시 가져올지 여부 (기본값 true)
            refetchOnWindowFocus: false, 
            // 데이터 요청 실패 시 재시도 횟수
            retry: 1, // 실패 시 1번만 재시도
        },
        },
    }));

    return (
        // 2. 앱 전체에 Query 기능을 주입합니다.
        <QueryClientProvider client={queryClient}>
            {children}
            {/* 개발 환경에서 쿼리 상태를 확인할 수 있는 도구 (배포 시 자동 제외됨) */}
            {/* 개발 환경에서 하단에 쿼리 상태 확인용 아이콘이 생깁니다 */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}