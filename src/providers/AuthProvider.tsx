'use client';

import { useAuthStore } from '@/stores/authStore';
import { useAuth } from '@/hooks/login/useAuth'; // 통합 훅
import { usePathname } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    // 1. Zustand에서 초기화 완료 여부 플래그만 가져옴
    //const isInitialized = useAuthStore((state) => state.isInitialized);
    const { isInitialized } = useAuthStore();
    const pathname = usePathname();

    // 1. Public Paths 공개 경로 설정 (이곳에선 인증 체크 로딩을 보이지 않음)
    const publicPaths = ['/login', '/signup', '/signup/callback', '/auth/signup/chk'];
    const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
    // const isPublicPath = publicPaths.some(path => pathname.includes(path));

    const isMainPage = pathname === '/';


	
/**
     * 2. 통합 훅 호출 - 프로필 조회
     * useAuth 내부의 profileQuery가 실행되면서 
     * 자동으로 /profile API를 호출하고 Zustand의 setInitialized(true)를 수행합니다.
     * 
     * 통합 훅 호출 시 enabled 옵션 전달
     * 공개 경로(isPublicPath)일 때는 query를 아예 실행하지(enabled: false) 않습니다.
     * 
     * 새로고침 시 전역 상태 복구를 위해 보통 전체 적용하거나 
     * 내부 로직에서 enabled를 세밀하게 관리합니다.
     */
    const { isProfileLoading } = useAuth();    
    //const { isProfileLoading } = useAuth({ enabled: !isPublicPath });
    

    // 3. 인증 정보를 서버에서 가져오는 중일 때의 처리
    // 비공개 경로이면서 아직 인증 확인(isInitialized)이 안 끝났다면 본문을 보여주지 않습니다.
    if (!isPublicPath && !isInitialized && isProfileLoading) {
        return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            <p className="ml-3 text-gray-600">Loading</p>
        </div>
        );
    }
/*    
    // 공개 경로가 아닌데, 아직 초기화가 안 되었고, 데이터를 가져오는 중이라면 로딩 화면 노출
    if (!isPublicPath && !isMainPage) {
        if (!isInitialized || isProfileLoading) {
            return (
                <div style={loadingContainerStyle}>
                    <p>Loading</p> 
                </div>
            );
        }
    }
*/
    return <>{children}</>;
}

// 기존 스타일 유지 (생략 없이 사용하세요)
const loadingContainerStyle: React.CSSProperties = {
    display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa'
};
const loadingBoxStyle: React.CSSProperties = { textAlign: 'center', color: '#666', fontSize: '14px' };
const spinnerStyle: React.CSSProperties = {
    display: 'inline-block', width: '30px', height: '30px', border: '3px solid rgba(0,0,0,.1)',
    borderTopColor: '#488ad8', borderRadius: '50%', animation: 'spin 1s ease-in-out infinite', marginBottom: '10px'
};