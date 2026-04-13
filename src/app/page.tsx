/** 바닐라 리액트 Home.jsx */

'use client'; // 클라이언트 컴포넌트로 지정
/*
Next.js App Router는 기본이 서버 컴포넌트. 
'use client'; 클라이언트 컴포넌트로 선언 - useEffect나 useState, Zustand 사용을 위함
*/
import Link from 'next/link';
import Image from "next/image";
import { CalendarIcon, ClockIcon, ArrowRightIcon } from '@radix-ui/react-icons';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* 1. 히어로 배너 섹션 (기존 코드 유지 및 최적화) */}
      <section className="relative w-full h-[45vh] md:h-[500px] bg-gradient-to-br from-[#488ad8] to-[#2b5a9e] overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[250px] h-[250px] bg-blue-400/20 rounded-full blur-2xl" />
        
        <div className="max-w-7xl mx-auto h-full px-6 md:px-10 flex flex-col justify-center items-start text-white relative z-10">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-sm">
            HR Management System
          </span>
          <h1 className="text-3xl md:text-5xl font-black leading-[1.2] mb-4 tracking-tighter">
            스마트한 인사관리,<br />
            <span className="text-blue-200">더 편리해진 워크플로우</span>
          </h1>
          <p className="text-sm md:text-lg text-white/80 mb-8 max-w-xl leading-relaxed font-medium">
            복잡한 출근 신청부터 실시간 스케줄 조회까지,<br className="hidden md:block" /> 
            효율적인 업무 환경을 한눈에 확인하세요.
          </p>
        </div>
      </section>

      {/* 2. 핵심 바로가기 섹션 (카드 UI) */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 -mt-16 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 출근 신청 카드 */}
          <Link href="/schedule/apply" className="group">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-start transition-all duration-300 group-hover:-translate-y-2 group-hover:border-[#488ad8]/30">
              <div className="w-14 h-14 bg-[#488ad8]/10 rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-[#488ad8]">
                <svg className="w-7 h-7 text-[#488ad8] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">출근 신청</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                오늘의 근무 계획을 제출하세요.<br />
                빠르고 간편하게 승인 요청이 가능합니다.
              </p>
              <span className="text-[#488ad8] font-bold inline-flex items-center group-hover:underline">
                신청하기 
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </Link>

          {/* 스케줄 조회 카드 */}
          <Link href="/schedule/list" className="group">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-start transition-all duration-300 group-hover:-translate-y-2 group-hover:border-[#488ad8]/30">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-[#488ad8]">
                <svg className="w-7 h-7 text-[#488ad8] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">스케줄 조회</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                팀원들과 본인의 전체 일정을 확인하세요.<br />
                월간/주간 단위로 최적화된 정보를 제공합니다.
              </p>
              <span className="text-[#488ad8] font-bold inline-flex items-center group-hover:underline">
                조회하기
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </Link>

        </div>

        {/* 3. 하단 안내 텍스트 (옵션) */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm">
            문의사항이 있으신가요? 관리자에게 연락하거나 <span className="underline cursor-pointer">도움말</span>을 확인하세요.
          </p>
        </div>
      </section>
    </div>
  );
}