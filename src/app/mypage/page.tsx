'use client'; // 클라이언트 컴포넌트로 지정

/*
Next.js App Router는 기본이 서버 컴포넌트. 
'use client'; 클라이언트 컴포넌트로 선언 - useEffect나 useState, Zustand 사용을 위함
*/

import { useEffect, useRef } from 'react'; // 2026.04.13
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/login/useAuth'; // 유저 정보를 TanStack Query에서 관리하는 경우 // TanStack Query 기반 인증 훅
import { useMyProfile } from '@/hooks/mypage/useMyProfile';
import { useAuthStore } from '@/stores/authStore'; // Zustand 스토어
import { useModalStore } from '@/stores/useModalStore'; // Custom modal 스토어
import { 
  PersonIcon, 
  EnvelopeClosedIcon, 
  RocketIcon, 
  ChevronRightIcon,
  LockClosedIcon, // 비밀번호용 아이콘
  MobileIcon,     // 전화번호용 아이콘
  IdCardIcon,      // 아이디용 아이콘
  ExitIcon
} from '@radix-ui/react-icons';

export default function MyPage() {
    // [1] 기본 인증 상태 (전체 앱 공유 훅)
    const { isProfileLoading, user } = useAuth();
    const isInitialized = useAuthStore((state) => state.isInitialized);

    // [2] 마이페이지 상세 정보 (전용 훅)
    const { detail, isDetailLoading } = useMyProfile();
    
    const router = useRouter();
    const isRedirecting = useRef(false);
    const showAlert = useModalStore((state) => state.showAlert);

    // [방어 코드] 클라이언트 측 강제 리다이렉트
    useEffect(() => {
        if (isInitialized && !isProfileLoading && !user && !isRedirecting.current) {
            isRedirecting.current = true;
            showAlert('로그인이 필요한 서비스입니다.', () => {
                router.replace('/login');
            });
        }
    }, [isInitialized, isProfileLoading, user, router, showAlert]);

    if (!isInitialized || isProfileLoading || isDetailLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#488ad8] mx-auto mb-4"></div>
                    <p className="text-gray-500 font-bold">사용자 정보를 확인 중입니다...</p>
                </div>
            </div>
        );
    }

    if (!user || !detail) {
        return null; 
    }

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
                    {/* 상세 정보에서 가져온 데이터 */}
                    <h2 className="text-3xl font-black text-gray-800 tracking-tighter">{detail.userNm}</h2>
                    <p className="text-[#488ad8] font-bold mt-1">
                        {detail.deptNm || '부서 미지정'} / {detail.posNm || '직급 미지정'}
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-8 grid grid-cols-1 gap-6">
                {/* 정보 카드 */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                    <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-[#488ad8] rounded-full" />
                        기본 정보
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 아이디 */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                            <PersonIcon className="text-gray-400" />
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">ID</p>
                                <p className="text-sm font-bold text-gray-700">{detail.userId}</p>
                            </div>
                        </div>
                        {/* 이메일 */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                            <EnvelopeClosedIcon className="text-gray-400" />
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Email</p>
                                <p className="text-sm font-bold text-gray-700">{detail.email}</p>
                            </div>
                        </div>
                        {/* 전화번호 */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                            <MobileIcon className="text-gray-400" />
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Phone</p>
                                <p className="text-sm font-bold text-gray-700">{detail.phoneNum || '번호 없음'}</p>
                            </div>
                        </div>
                        {/* 사번 */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                            <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Employee No.</p>
                                <p className="text-sm font-bold text-gray-700">{detail.empNo || '사번 없음'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 설정 및 기타 메뉴 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 개인정보 수정 버튼 */}
                    <button 
                        onClick={() => router.push('/mypage/edit-profile')}
                        className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 hover:border-[#488ad8] hover:shadow-md transition-all group">
                        <span className="font-bold text-gray-600 group-hover:text-[#488ad8]">개인정보 수정</span>
                        <ChevronRightIcon className="text-gray-300 group-hover:text-[#488ad8]" />
                    </button>

                    {/* 비밀번호 변경 버튼 */}
                    <button 
                        onClick={() => router.push('/mypage/change-password')}
                        className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 hover:border-[#488ad8] hover:shadow-md transition-all group">
                        <span className="font-bold text-gray-600 group-hover:text-[#488ad8]">비밀번호 변경</span>
                        <ChevronRightIcon className="text-gray-300 group-hover:text-[#488ad8]" />
                    </button>
                </div>
            </div>
        </div>
    );
}