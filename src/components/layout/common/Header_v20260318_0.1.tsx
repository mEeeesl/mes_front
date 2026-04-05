'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/login/useAuth';
import { HomeIcon, CaretLeftIcon, HamburgerMenuIcon, AvatarIcon, Cross1Icon, ChevronDownIcon } from '@radix-ui/react-icons';

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

    // 사이드바 열림/닫힘 상태
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 메뉴 토글 함수
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // 메뉴 열림 시 바디 스크롤 방지
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    // 사이드바 메뉴 2 Depth
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

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
        <>
            {/* --- 1. 상단 헤더 바 (PC/모바일 공통) --- */}
            <header className="sticky top-0 z-[110] h-16 w-full flex justify-between items-center p-4 border-b border-[#ccc] bg-white text-gray-800 px-6 md:px-10">
                
                {/* [왼쪽]: 홈 / 뒤로가기 (CaretLeftIcon 적용) */}
                <div className="flex items-center gap-4">
                    {pathname === '/' ? (
                        <Link href="/">
                            <button className="p-2 hover:bg-gray-100 rounded-md transition-all active:scale-90">
                                <HomeIcon className="w-6 h-6" />
                            </button>
                        </Link>
                    ) : (
                        <button 
                            onClick={() => router.back()} 
                            className="p-2 hover:bg-gray-100 rounded-md transition-all active:scale-90 active:-translate-x-1"
                        >
                            <CaretLeftIcon className="w-7 h-7 text-gray-800" /> {/* 조금 더 큼직하게 7x7 */}
                        </button>
                    )}
                    <span className="hidden md:block font-bold text-lg text-[#488ad8]">Global ERP</span>
                </div>

                {/* [중앙]: PC 전용 풀 와이드 네비게이션 */}
                <nav className="hidden md:flex items-center gap-10 h-full">
                    
                    {/* 메뉴 1: 스케줄 관리 */}
                    <div className="relative h-full flex items-center group">
                        <button className="flex items-center gap-1 text-[15px] font-bold text-gray-700 group-hover:text-[#488ad8] transition-colors h-full">
                            스케줄 관리
                            <ChevronDownIcon className="w-4 h-4 transition-transform group-hover:rotate-180" />
                        </button>
                        {/* 풀 와이드 드롭다운 */}
                        <div className="fixed left-0 top-16 w-screen bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100 opacity-0 invisible -translate-y-5 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-[100] py-10">
                            <div className="max-w-7xl mx-auto px-10 flex gap-20">
                                <div className="w-1/4 border-r border-gray-100">
                                    <h3 className="text-xl font-bold text-[#488ad8]">Schedule</h3>
                                    <p className="text-xs text-gray-400 mt-2 italic">Management System</p>
                                </div>
                                <div className="flex gap-16">
                                    <div className="flex flex-col gap-4">
                                        <Link href="/schedule/apply" className="text-lg font-semibold text-gray-600 hover:text-[#488ad8] transition-all hover:translate-x-1">출근신청</Link>
                                        <Link href="/schedule/list" className="text-lg font-semibold text-gray-600 hover:text-[#488ad8] transition-all hover:translate-x-1">일정조회</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#488ad8] transition-all group-hover:w-full" />
                    </div>

                    {/* 메뉴 2: 시스템 설정 (풀 와이드 통일) */}
                    <div className="relative h-full flex items-center group">
                        <button className="flex items-center gap-1 text-[15px] font-bold text-gray-700 group-hover:text-[#488ad8] transition-colors h-full">
                            시스템 설정
                            <ChevronDownIcon className="w-4 h-4 transition-transform group-hover:rotate-180" />
                        </button>
                        <div className="fixed left-0 top-16 w-screen bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100 opacity-0 invisible -translate-y-5 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-[100] py-10">
                            <div className="max-w-7xl mx-auto px-10 flex gap-20">
                                <div className="w-1/4 border-r border-gray-100">
                                    <h3 className="text-xl font-bold text-[#488ad8]">System</h3>
                                    <p className="text-xs text-gray-400 mt-2 italic">Configuration</p>
                                </div>
                                <div className="flex flex-col gap-4 text-lg font-semibold text-gray-600">
                                    <Link href="/system/user" className="hover:text-[#488ad8] transition-all hover:translate-x-1">사용자 권한 관리</Link>
                                    <Link href="/system/code" className="hover:text-[#488ad8] transition-all hover:translate-x-1">공통 코드 관리</Link>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#488ad8] transition-all group-hover:w-full" />
                    </div>
                </nav>

                {/* [오른쪽]: 마이페이지 & 햄버거 */}
                <div className="flex items-center gap-2">
                    <button onClick={() => router.push('/mypage')} className="p-2 hover:bg-gray-100 rounded-md transition-all active:scale-95">
                        <AvatarIcon className="w-6 h-6 text-gray-400" />
                    </button>
                    <button onClick={toggleMenu} className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-all">
                        <HamburgerMenuIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* --- 2. 모바일 사이드 메뉴 (기존 로직 유지) --- */}
            <div 
                className={`fixed inset-0 bg-black/50 z-[120] transition-opacity duration-300 md:hidden ${
                    isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={toggleMenu}
            />
            <aside 
                className={`fixed top-0 right-0 z-[130] h-screen w-[77.5%] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* 닫기 버튼 (굵기 트릭 적용) */}
                <button onClick={toggleMenu} className="fixed -left-10 top-6 transition-all duration-300">
                    <Cross1Icon className="w-5 h-5 text-white drop-shadow-[0.5px_0.5px_0px_white]" />
                </button>

                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-6 border-b border-gray-100">
                        {user ? (
                            <button onClick={() => { if(confirm('로그아웃?')) logoutMutate(); }} className="flex flex-col items-start">
                                <span className="text-lg font-bold text-[#488ad8]">{user.userNm}님</span>
                                <span className="text-[11px] text-gray-400">로그아웃</span>
                            </button>
                        ) : (
                            <button onClick={() => router.push('/login')} className="text-[#488ad8] font-bold text-lg">로그인</button>
                        )}
                        <button onClick={() => router.push('/mypage')}><AvatarIcon className="w-12 h-12 text-gray-400" /></button>
                    </div>

                    <nav className="flex-1 px-6 py-10 overflow-y-auto">
                        <ul className="space-y-6 text-gray-600 font-semibold">
                            {/* 모바일 아코디언 메뉴 */}
                            <li>
                                <div onClick={() => setIsScheduleOpen(!isScheduleOpen)} className="flex justify-between items-center py-2 active:translate-x-1 transition-all">
                                    <span>스케줄 관리</span>
                                    <ChevronDownIcon className={`transition-transform ${isScheduleOpen ? 'rotate-180 text-[#488ad8]' : ''}`} />
                                </div>
                                <div className={`overflow-hidden transition-all duration-300 ${isScheduleOpen ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                    <ul className="ml-4 space-y-4 border-l-2 border-gray-50 pl-4">
                                        <li onClick={() => {router.push('/schedule/apply'); toggleMenu();}} className="flex items-center gap-3 active:translate-x-1 text-sm">
                                            <span className="w-1.5 h-1.5 bg-[#488ad8] rounded-full" /> 출근신청
                                        </li>
                                        <li onClick={() => {router.push('/schedule/list'); toggleMenu();}} className="flex items-center gap-3 active:translate-x-1 text-sm">
                                            <span className="w-1.5 h-1.5 bg-[#488ad8] rounded-full" /> 일정조회
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="py-2 active:translate-x-1 transition-all">시스템 설정</li>
                            <li className="py-2 active:translate-x-1 transition-all">공지사항</li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
}

// React.CSSProperties - Style 방식 .. 음 근데 TailWind로 가자...
//const commonHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc', position: 'fixed', top: '0', z-index: '99', width: '100vw', background: 'white' };
//const commonHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc', position: 'fixed', top: '0px', width: '100vw', background: 'white' };
