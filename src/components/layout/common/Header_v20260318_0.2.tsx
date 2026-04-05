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
            {/* --- 상단 헤더 바 --- */}
            <header className="sticky top-0 z-40 w-full flex justify-between items-center p-4 border-b border-[#ccc] bg-white text-gray-800 px-6 md:px-10">
                
                {/* [왼쪽 그룹]: 홈/뒤로가기 + PC용 로고/타이틀 */}
                <div className="flex items-center gap-4">
                    {pathname === '/' ? (
                        <Link href="/"><button className="p-2 hover:bg-gray-100 rounded-md transition-all"><HomeIcon className="w-6 h-6" /></button></Link>
                    ) : (
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-md transition-all"><CaretLeftIcon  className="w-6 h-6" /></button>
                    )}
                    
                    {/* PC에서만 보이는 서비스 타이틀 (선택 사항) */}
                    <span className="hidden md:block font-bold text-lg text-[#488ad8]">Global ERP</span>
                </div>

                {/* [중앙 그룹]: PC 전용 가로 네비게이션 + 드롭다운 */}
{/* [중앙 그룹]: PC 전용 가로 네비게이션 */}
<nav className="hidden md:flex items-center gap-10 h-full">
    
    {/* --- 스케줄 관리 (Full-Width 드롭다운) --- */}
    <div className="relative h-full flex items-center group">
        <button className="flex items-center gap-1 text-[15px] font-bold text-gray-700 group-hover:text-[#488ad8] transition-colors h-full">
            스케줄 관리
            <ChevronDownIcon className="w-4 h-4 transition-transform group-hover:rotate-180" />
        </button>
        
        {/* [핵심] 풀 와이드 드롭다운 박스 */}
        <div className="fixed left-0 top-16 w-screen h-[25vh] bg-white shadow-xl border-b border-gray-100 opacity-0 invisible -translate-y-5 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-[30]">
            <div className="max-w-7xl mx-auto px-10 py-8 flex gap-20">
                {/* 왼쪽 타이틀 영역 (선택사항) */}
                <div className="w-1/4 border-r border-gray-50">
                    <h3 className="text-xl font-bold text-[#488ad8]">Schedule</h3>
                    <p className="text-xs text-gray-400 mt-2">효율적인 일정 관리를 위한<br/>스케줄링 서비스입니다.</p>
                </div>

                {/* 오른쪽 실제 메뉴 리스트 */}
                <ul className="flex gap-16">
                    <li className="space-y-4">
                        <p className="text-[12px] text-gray-300 font-bold uppercase tracking-widest">Management</p>
                        <div className="flex flex-col gap-3">
                            <Link href="/schedule/apply" className="text-[16px] font-semibold text-gray-600 hover:text-[#488ad8] transition-all active:translate-x-1">
                                출근신청
                            </Link>
                            <Link href="/schedule/list" className="text-[16px] font-semibold text-gray-600 hover:text-[#488ad8] transition-all active:translate-x-1">
                                일정조회
                            </Link>
                        </div>
                    </li>
                    {/* 필요 시 다른 카테고리 추가 가능 */}
                </ul>
            </div>
        </div>

        {/* 하단 인디케이터 바 */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#488ad8] transition-all group-hover:w-full" />
    </div>

    {/* 다른 메뉴들도 동일한 구조로 작성 가능 */}
    <div className="h-full flex items-center group">
        <Link href="/system" className="text-[15px] font-bold text-gray-700 group-hover:text-[#488ad8] transition-colors h-full flex items-center">
            시스템 설정
        </Link>
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#488ad8] transition-all group-hover:w-full" />
    </div>
</nav>

                {/* [오른쪽 그룹]: 마이페이지 & 햄버거 버튼 */}
                <div className="flex items-center gap-2">
                    {/* PC에서도 마이페이지 아바타는 유지 */}
                    <button onClick={() => router.push('/mypage')} className="p-2 hover:bg-gray-100 rounded-md transition-all active:scale-95">
                        <AvatarIcon className="w-6 h-6 text-gray-400" />
                    </button>

                    {/* 햄버거 버튼: 모바일에서만 보이고 PC(md 이상)에서는 숨김 */}
                    <button onClick={toggleMenu} className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-all">
                        <HamburgerMenuIcon className="w-6 h-6" />
                    </button>

                    {/* PC에서만 보이는 로그아웃 버튼 (선택 사항) */}
                    {user && (
                        <button 
                            onClick={() => { if(confirm('로그아웃?')) logoutMutate(); }}
                            className="hidden md:block ml-4 text-xs font-medium text-gray-400 hover:text-red-400"
                        >
                            로그아웃
                        </button>
                    )}
                </div>
            </header>

            {/* --- 모바일 전용 사이드 메뉴 (기존 코드 유지) --- */}
            {/* md:hidden을 추가하여 PC에서는 사이드바가 아예 작동 안 하게 막을 수도 있습니다. */}
            <div className="md:hidden">
                {/* 딤 처리 오버레이 & aside 메뉴 코드 위치 */}
            </div>

            {/* 2. 배경 딤(Dim) 처리 */}
            <div 
                className={`fixed inset-0 bg-black/50 z-[90] transition-opacity duration-300 ${
                    isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={toggleMenu}
            />

            {/* 3. 사이드 슬라이드 메뉴 (너비 77.5%) */}
            {/* 반응형 대비 */}
            <aside 
                className={`fixed top-0 right-0 z-[100] h-screen transition-transform duration-300 ease-in-out 
                /* 기본(모바일): 77.5% | 태블릿(md): 40% | PC(lg): 30% */
                w-[70%] md:w-[40%] lg:w-[35%] 
                bg-white shadow-2xl transform ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >

                {/* 닫기 버튼: 배경 제거, 크기 축소, 흰색 아이콘 */}
                <button 
                    onClick={toggleMenu}
                    className={`fixed -left-10 top-6 transition-all duration-300 ${
                        isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
                    }`}
                >
                    <Cross1Icon className="w-5 h-5 text-white drop-shadow-[0.9px_0.5px_0px_white]" />
                </button>

                <div className="flex flex-col h-full">
                    {/* 상단 섹션 */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-100">
                        {/* 왼쪽: userNm & 로그아웃 (Brand Color 적용) */}
                        <div className="flex flex-col">
                            {user ? (
                                <button 
                                    onClick={() => { if(confirm('로그아웃 하시겠습니까?')) { logoutMutate(); toggleMenu(); } }}
                                    className="group flex flex-col items-start text-left"
                                >
                                    <span className="text-lg font-bold text-[#488ad8] transition-colors">
                                        {user.userNm}님
                                    </span>
                                    <span className="text-[11px] text-gray-400 group-hover:text-red-400 font-medium">로그아웃</span>
                                </button>
                            ) : (
                                <button 
                                    onClick={() => { router.push('/login'); toggleMenu(); }} 
                                    className="text-[#488ad8] font-bold text-lg"
                                >
                                    로그인
                                </button>
                            )}
                        </div>

                        {/* 오른쪽: 마이페이지 Avatar (보더 제거, 이미지만 노출) */}
                        <button 
                            onClick={() => { router.push('/mypage'); toggleMenu(); }}
                            className="transition-all active:scale-90 active:opacity-80"
                        >
                            <AvatarIcon className="w-7 h-7 text-gray-600" />
                        </button>
                    </div>

                    {/* 메뉴 본문 (Brand Color 강조) */}
                    <nav className="flex-1 px-6 py-10">
                        <ul className="space-y-4 text-[16px] font-semibold text-gray-600">
                            
                            {/* --- 스케줄 관리 (아코디언 메뉴) (1뎁스) --- */}
                            <li> 
                                <div 
                                    onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                                    className="flex items-center justify-between py-2 hover:text-[#488ad8] cursor-pointer transition-all active:translate-x-1 active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-3">
                                    {/* 메인 메뉴는 동그라미 없이 깔끔하게 텍스트만 (원하시면 추가 가능) */}
                                    <span>스케줄 관리</span>
                                    </div>
                                    
                                    {/* 느낌 있는 V자 아이콘 (회전 애니메이션 추가) */}
                                    <ChevronDownIcon 
                                    className={`w-5 h-5 transition-transform duration-300 ${isScheduleOpen ? 'rotate-180' : ''}`} 
                                    />
                                </div>

                                {/* --- 서브 메뉴 (2뎁스) --- */}
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isScheduleOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                    <ul className="ml-4 space-y-4 border-l-2 border-gray-50 pl-2">
                                    <li 
                                        className="flex items-center gap-3 py-1 hover:text-[#488ad8] cursor-pointer transition-all active:translate-x-1 text-[15px] text-gray-500"
                                        onClick={() => { router.push('/schedule/apply'); toggleMenu(); }}
                                    >
                                        <span className="w-1.5 h-1.5 bg-[#488ad8] rounded-full" />
                                        출근신청
                                    </li>
                                    <li 
                                        className="flex items-center gap-3 py-1 hover:text-[#488ad8] cursor-pointer transition-all active:translate-x-1 text-[15px] text-gray-500"
                                        onClick={() => { router.push('/schedule/list'); toggleMenu(); }}
                                    >
                                        <span className="w-1.5 h-1.5 bg-[#488ad8] rounded-full" />
                                        일정조회
                                    </li>
                                    </ul>
                                </div>
                            </li>

                            {/* 다른 메뉴들... */}
                            <li className="flex items-center gap-4 py-2 hover:text-[#488ad8] cursor-pointer transition-all active:translate-x-1">
                            시스템 설정
                            </li>
                        </ul>
                    </nav>

                    {/* 하단 버튼 영역 (Brand Color 바탕색 적용 예시) */}
                    {!user && (
                        <div className="p-6">
                            <button 
                                onClick={() => { router.push('/login'); toggleMenu(); }}
                                className="w-full py-4 bg-[#488ad8] text-white rounded-lg font-bold shadow-md active:bg-[#3a72b5] transition-colors"
                            >
                                로그인 하러가기
                            </button>
                        </div>
                    )}
                    
                    <div className="p-6 text-center text-[10px] text-gray-300">
                        © 2026 Global Enterprise Inc.
                    </div>
                </div>
            </aside>
        </>
    );
}

// React.CSSProperties - Style 방식 .. 음 근데 TailWind로 가자...
//const commonHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc', position: 'fixed', top: '0', z-index: '99', width: '100vw', background: 'white' };
//const commonHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc', position: 'fixed', top: '0px', width: '100vw', background: 'white' };
