/** 바닐라 리액트 Home.jsx */

'use client'; // 클라이언트 컴포넌트로 지정
/*
Next.js App Router는 기본이 서버 컴포넌트. 
'use client'; 클라이언트 컴포넌트로 선언 - useEffect나 useState, Zustand 사용을 위함
*/

import Image from "next/image";
import { CalendarIcon, ClockIcon, ArrowRightIcon } from '@radix-ui/react-icons';

export default function Home() {

  const mockSchedules = [
    { id: 1, title: '오전 일일 스크럼', time: '09:00 - 09:30', type: '미팅', color: 'bg-blue-500' },
    { id: 2, title: '운영 시스템 로그 점검', time: '10:30 - 11:30', type: '업무', color: 'bg-emerald-500' },
  ];

  return (
    
    <section className="relative w-full h-[38vh] md:h-[420px] bg-gradient-to-br from-[#488ad8] to-[#2b5a9e] overflow-hidden">
      {/* 배너 - 배경 장식 패턴 */}
      <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] bg-white/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto h-full px-8 md:px-10 flex flex-col justify-center items-start text-white relative z-10">
        <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-sm">
          Enterprise Solution
        </span>
        <h1 className="text-3xl md:text-5xl font-black leading-[1.2] mb-4 tracking-tighter">
          효율적인 업무의 시작,<br />
          <span className="text-blue-200">Global ERP</span>
        </h1>
        <p className="hidden md:block text-lg text-white/80 mb-8 max-w-xl leading-relaxed font-medium">
          스케줄 관리부터 시스템 설정까지, 한 곳에서 완벽하게 제어하세요.
        </p>
        
        <button className="px-6 py-3 md:px-8 md:py-4 bg-white text-[#488ad8] font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all active:scale-95 text-sm md:text-base">
          지금 시작하기
        </button>
      </div>
    </section>
    
    




    
    
  );
}
