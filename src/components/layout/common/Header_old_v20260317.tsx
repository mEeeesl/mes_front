'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
//import { useLogoutMutation, useProfileQuery } from '@/hooks/login/useAuthMutation';
import { useAuth } from '@/hooks/login/useAuth';

import { HomeIcon, HamburgerMenuIcon, AvatarIcon } from '@radix-ui/react-icons';


export default function Header() {
    /*
        usePathname을 통해 현재 위치가 로그인 페이지인지 확인하여 UI를 더 세밀하게 조정
    */
    const pathname = usePathname(); // 현재 경로 확인용 - 로그인 페이지인지 아닌지 파악하여 UI 세밀조절 가능
    const router = useRouter();



    /**
     * [중요] 통합 훅에서 필요한 데이터와 함수를 추출합니다.
     * user: 프로필 정보 (Map 구조)
     * logout: 로그아웃 실행 함수 (mutate)
     */
    const { user, logout: logoutMutate } = useAuth();

/* [AS-iS]    
    // [중요] 1. TanStack Query 캐시에서 유저 정보 가져오기 
    // (이미 AuthProvider에서 호출했으므로 새로고침 없이 캐시된 데이터를 즉시 반환)
    const { data: user } = useProfileQuery();

    // 2. 로그아웃 Mutation
    const { mutate: logoutMutate } = useLogoutMutation();
*/


    {/* 
        공통 레이아웃 헤더 비적용 대상 경로 리스트 설정 

        만약, 부서홈페이지 등 같은게 생긴다면
        부서홈페이지의 루트가 될 디렉토리를 (dept) 이런식으로 만들고 
        해당 디렉토리 내 layout.tsx를 새로 만들어 공통 레이아웃 적용하면됨
    */}
    const hideHeaderPaths = [/*'/login',*/ '/etc/etc/etc'];
    if (hideHeaderPaths.includes(pathname)) return null;






    // + 공통 레이아웃 비적용 경로 리스트  
    //const shouldHideHeader = hideHeaderPaths.includes(pathname);
    return (
        //{!shouldHideHeader &&
        
            <header className="sticky top-0 z-50 w-full flex justify-between p-4 border-b border-[#ccc] bg-white">
                <nav>
                    {/* Next.js는 Link 컴포넌트의 to가 아니라 href를 사용 */}
                    <Link href="/">홈</Link> | <Link href="/mypage">마이페이지</Link>
                </nav>

                <div>
                {user ? (
                    <>
                    <strong>{user.userNm}</strong>님 환영합니다!
                    <button 
                        onClick={() => logoutMutate()} // 로그아웃
                        style={{ marginLeft: '10px', cursor: 'pointer' }}
                    >
                        로그아웃
                    </button>
                    </>
                ) : (
                    // 현재 경로가 로그인이 아닐 때만 로그인 버튼 표시 (선택 사항)
                    pathname !== '/login' && (
                    <button onClick={() => router.push('/login')} style={{ cursor: 'pointer' }}>
                        로그인
                    </button>
                    )
                )}
                </div>
            </header>
        //}
    );
}

// React.CSSProperties - Style 방식 .. 음 근데 TailWind로 가자...
//const commonHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc', position: 'fixed', top: '0', z-index: '99', width: '100vw', background: 'white' };
//const commonHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc', position: 'fixed', top: '0px', width: '100vw', background: 'white' };
