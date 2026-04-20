// src/providers/AuthProvider.tsx
'use client';

// (layout.tsx return을 보면) 해당 프로바이더를 QueryProvider 내부에 둠으로써 useQuery 사용할 수 있도록 함

import { useAuthStore } from '@/stores/authStore';
//import { useProfileQuery } from '@/hooks/login/useAuthMutation';
import { useAuth } from '@/hooks/login/useAuth'; // 통합 훅
import { usePathname } from 'next/navigation'; // 경로 확인을 위해 추가

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    // 1. Zustand에서 초기화 완료 여부 플래그만 가져옴
    const isInitialized = useAuthStore((state) => state.isInitialized);
    
    const pathname = usePathname();

    // 인증 체크를 건너뛸 경로들 (Public Paths)
    const publicPaths = ['/login', '/signup', '/signup/callback', '/auth/signup/chk'];
    const isPublicPath = publicPaths.some(path => pathname.includes(path));

    /**
     * 2. 통합 훅 호출
     * useAuth 내부의 profileQuery가 실행되면서 
     * 자동으로 /profile API를 호출하고 Zustand의 setInitialized(true)를 수행합니다.
     * 
     * 통합 훅 호출 시 enabled 옵션 전달
     * 공개 경로(isPublicPath)일 때는 query를 아예 실행하지(enabled: false) 않습니다.
     */
    //const { isProfileLoading } = useAuth();
    const { isProfileLoading } = useAuth({ enabled: !isPublicPath });

    /**
     * 3. 최초 접속 시 로딩 처리
     * 아직 인증 체크가 끝나지 않았고(isInitialized: false), 
     * 서버 통신 중일 때만(isProfileLoading: true) 로딩 화면을 보여줍니다.
     * 
     * 현재 경로가 공개 페이지(로그인, 회원가입 등)라면 
     * 인증 정보 확인 중이라는 로딩 화면을 보여주지 않고 바로 children을 렌더링
     */
    if (!isPublicPath && !isInitialized && isProfileLoading) {
        return (
            <div style={loadingContainerStyle}>
                <div style={loadingBoxStyle}>
                    <span style={spinnerStyle}></span>
                    <p>Loading</p>
                </div>
            </div>
        );
    }

/* [AS-IS]    
    // 쿼리 실행 (캐시에 데이터가 있으면 그걸 쓰고, 없으면 서버 호출)
    const { isLoading } = useProfileQuery();



    // 최초 1회 실행 중일 때만 로딩 화면
    if (!isInitialized && isLoading) {
        return <div className="flex h-screen items-center justify-center">인증 확인 중...</div>;
    }
*/
    return <>{children}</>;
}



// 스타일 가이드 (CSS-in-JS 예시)
const loadingContainerStyle: React.CSSProperties = {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa'
};

const loadingBoxStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#666',
    fontSize: '14px'
};

const spinnerStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '30px',
    height: '30px',
    border: '3px solid rgba(0,0,0,.1)',
    borderTopColor: '#488ad8',
    borderRadius: '50%',
    animation: 'spin 1s ease-in-out infinite',
    marginBottom: '10px'
};


/*

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useProfileQuery } from '@/hooks/login/useAuthMutation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { isInitialized, setAuth, clearAuth } = useAuthStore();
    
    // Provider 내부이므로 useQuery 사용 가능
    const { data, isSuccess, isError, isLoading } = useProfileQuery();

    useEffect(() => {
        if (isSuccess && data?.user) {
            setAuth(data.user);
        } else if (isError) {
            clearAuth();
        }
    }, [isSuccess, isError, data, setAuth, clearAuth]);

    // 초기화(첫 서버 확인) 전에는 화면 전체 로딩
    if (!isInitialized && isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <span>인증 정보 확인 중...</span>
            </div>
        );
    }

    return <>{children}</>;
}

*/