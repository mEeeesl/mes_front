/** 바닐라 리액트 MyPage.jsx */

'use client'; // 클라이언트 컴포넌트로 지정
/*
Next.js App Router는 기본이 서버 컴포넌트. 
'use client'; 클라이언트 컴포넌트로 선언 - useEffect나 useState, Zustand 사용을 위함
*/

import { useEffect, useRef } from 'react'; // 2026.04.13
import { useRouter } from 'next/navigation';
/////////////////////import { useAuthStore } from '@/stores/authStore'; // Zustand로 관리하는 경우
import { useAuth } from '@/hooks/login/useAuth'; // 유저 정보를 TanStack Query에서 관리하는 경우 // TanStack Query 기반 인증 훅
import { useAuthStore } from '@/stores/authStore'; // Zustand 스토어
import { useModalStore } from '@/stores/useModalStore'; // Custom modal 스토어
import { 
  PersonIcon, 
  EnvelopeClosedIcon, 
  RocketIcon, 
  ExitIcon, 
  ChevronRightIcon 
} from '@radix-ui/react-icons';


/*
최종 확인 체크리스트
쿠키 이름 확인: middleware.ts에서 request.cookies.get('이름') 부분에 실제 Spring Boot 서버가 내려주는 쿠키 이름을 넣어야 합니다. (개발자 도구 -> Application -> Cookies에서 확인 가능)

미들웨어 작동: 로그아웃 상태에서 브라우저 주소창에 localhost:3000/mypage를 직접 쳤을 때 자동으로 /login으로 튕겨 나간다면 성공입니다!

Layout과 연동: 아까 만든 layout.tsx 덕분에 마이페이지에서도 상단 헤더가 자연스럽게 보일 겁니다.
*/

export default function MyPage() {
    /////////////////////////// const { user } = useAuthStore(); // -- Zustand로 관리하는 경우
    // TanStack Query 캐시에서 유저 정보를 즉시 가져옵니다. (네트워크 요청 X)
    //const { data: user } = useProfileQuery(); // 유저 정보를 TanStack Query에서 관리하는 경우
    const { login, isLoggingIn, isProfileLoading, user } = useAuth();
    const isInitialized = useAuthStore((state) => state.isInitialized);
    
    // 2026.04.13
    const router = useRouter();
    // 리다이렉트가 이미 실행되었는지 확인하는 플래그
    const isRedirecting = useRef(false);
    // 커스텀 얼럿
    const showAlert = useModalStore((state) => state.showAlert);

console.log("MyPage 렌더링 시도");
/** TO-BE [S] */

    // [방어 코드] 클라이언트 측 강제 리다이렉트
    // 미들웨어를 통과했더라도, 클라이언트 상태에서 유저가 없는 것이 최종 확인되면 로그인으로 보냅니다.
    useEffect(() => {
        console.log("체크:", { isInitialized, isProfileLoading, user });
        // 초기화가 완료되었고 로딩도 끝났는데 유저 정보가 없다면, + 이미 리다이렉트 중이 아닌지 확인
        if (isInitialized && !isProfileLoading && !user && !isRedirecting.current) {
            isRedirecting.current = true; // 중복 실행 방지 플래그 On

            //showAlert('로그인이 필요한 서비스입니다.');
            showAlert('로그인이 필요한 서비스입니다.', () => {
                router.replace('/login'); // 클릭 시 함수
            });            
            // router.push 대신 replace를 쓰면 뒤로가기를 눌렀을 때 다시 마이페이지(권한 없음)로 돌아와서 무한 루프에 빠지는 것을 방지
        }
    }, [isInitialized, isProfileLoading, user, router]);

    /**
     * 1. 데이터 로딩 중이거나 아직 초기화 전일 때 (스피너 표시)
     */
    if (!isInitialized || isProfileLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#488ad8] mx-auto mb-4"></div>
                    <p className="text-gray-500 font-bold">사용자 정보를 확인 중입니다...</p>
                </div>
            </div>
        );
    }

    /**
     * 2. 유저 정보가 최종적으로 없는 경우
     * useEffect에서 리다이렉트를 시키지만, 찰나의 순간에 아래 UI가 보일 수 있으므로 
     * null을 반환하거나 최소한의 처리만 합니다.
     */
    if (!user) {
        return null; 
    }

/** TO-BE [E] */
/** AS-IS    
    // 2026.04.09 
    // Zustand에서 초기화 완료 여부를 가져옵니다. (새로고침 시 false -> true 대기)
    const isInitialized = useAuthStore((state) => state.isInitialized);
    
    // [방어 코드 1] 데이터 로딩 중 처리
    // 앱이 구동되자마자 !user 조건에 걸려 튕기는 것을 방지합니다.
    if (!isInitialized || isProfileLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#488ad8] mx-auto mb-4"></div>
                    <p className="text-gray-500 font-bold">사용자 정보를 확인 중입니다...</p>
                </div>
            </div>
        );
    }


    // 미들웨어에서 1차로 막아주지만, Zustand 상태가 비어있을 경우를 대비한 안전장치 -- Zustand로 관리하는 경우
    // 미들웨어에서 1차로 막아주지만, 리액트 컴포넌트 차원에서의 안전장치 -- TanStack Query에서 관리하는 경우
    if (!user) {
        return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>사용자 정보를 불러올 수 없습니다. 다시 로그인해 주세요.</p>
        </div>
        );
    }
*/    
    return (


        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 상단 프로필 영역 */}
            <div className="bg-white border-b border-gray-100">
            <div className="max-w-4xl mx-auto px-6 py-16 text-center">
                <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-gray-100 rounded-[3rem] flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                    <PersonIcon className="w-16 h-16 text-gray-300" />
                </div>
                <button className="absolute bottom-1 right-1 bg-[#488ad8] p-2 rounded-xl shadow-lg text-white hover:scale-110 transition-transform">
                    <RocketIcon className="w-4 h-4" />
                </button>
                </div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tighter">{user.userNm} 프로</h2>
                <p className="text-[#488ad8] font-bold mt-1">개발팀 / 선임 연구원</p>
            </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-8 grid grid-cols-1 gap-6">
            {/* 정보 카드 */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#488ad8] rounded-full" />
                기본 정보
                </h3>
                <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <EnvelopeClosedIcon className="text-gray-400" />
                    <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Email</p>
                    <p className="text-sm font-bold text-gray-700">gildong.hong@global.com</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                    <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Employee No.</p>
                    <p className="text-sm font-bold text-gray-700">20260318-001</p>
                    </div>
                </div>
                </div>
            </div>

            {/* 설정 및 기타 메뉴 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 hover:border-[#488ad8] hover:shadow-md transition-all group">
                <span className="font-bold text-gray-600 group-hover:text-[#488ad8]">비밀번호 변경</span>
                <ChevronRightIcon className="text-gray-300 group-hover:text-[#488ad8]" />
                </button>
                <button className="flex items-center justify-between p-6 bg-red-50/50 rounded-3xl border border-red-100 hover:bg-red-50 transition-all group">
                <span className="font-bold text-red-500 flex items-center gap-2">
                    <ExitIcon /> 로그아웃
                </span>
                </button>
            </div>
            </div>
        </div>












    );
}