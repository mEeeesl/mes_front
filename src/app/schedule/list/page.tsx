/** 바닐라 리액트 Home.jsx */

'use client'; // 클라이언트 컴포넌트로 지정
/*
Next.js App Router는 기본이 서버 컴포넌트. 
'use client'; 클라이언트 컴포넌트로 선언 - useEffect나 useState, Zustand 사용을 위함
*/

import { CalendarIcon, ClockIcon, ArrowRightIcon } from '@radix-ui/react-icons';

export default function Home() {

    const mockSchedules = [
        { id: 1, title: '오전 일일 스크럼', time: '09:00 - 09:30', type: '미팅', color: 'bg-blue-500' },
        { id: 2, title: '운영 시스템 로그 점검', time: '10:30 - 11:30', type: '업무', color: 'bg-emerald-500' },
    ];

    return (
        
        
        
        
        
        
        
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20">
        <div className="flex justify-between items-end mb-8 px-2">
            <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tighter mb-2">오늘의 일정</h2>
            <p className="text-sm text-gray-400 font-medium">2026년 3월 18일 수요일, 업무 현황입니다.</p>
            </div>
            <button className="hidden md:flex items-center gap-1 text-sm font-bold text-[#488ad8] hover:underline">
            전체 보기 <ArrowRightIcon />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. 메인 일정 카드 */}
            <div className="md:col-span-2 bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-100 p-8 hover:shadow-[0_20px_50px_rgba(72,138,216,0.1)] transition-all">
            <div className="space-y-6">
                {mockSchedules.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group">
                    <div className="flex items-center gap-5">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <div>
                        <h4 className="font-bold text-gray-800 group-hover:text-[#488ad8] transition-colors">{item.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 font-medium">
                        <span className="flex items-center gap-1"><ClockIcon /> {item.time}</span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] uppercase">{item.type}</span>
                        </div>
                    </div>
                    </div>
                    <button className="p-2 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowRightIcon className="text-[#488ad8]" />
                    </button>
                </div>
                ))}
            </div>
            </div>

            {/* 2. 퀵 액션 카드 (출근 신청 등) */}
            <div className="bg-[#488ad8] rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-lg shadow-[#488ad8]/30">
            <div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                <CalendarIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-2 tracking-tight">아직 출근 전이신가요?</h3>
                <p className="text-white/70 text-sm leading-relaxed">버튼 한 번으로 간편하게<br/>오늘의 출근 신청을 완료하세요.</p>
            </div>
            <button className="w-full py-4 bg-white text-[#488ad8] font-black rounded-xl hover:bg-gray-100 transition-all active:scale-95 mt-8">
                지금 출근 신청하기
            </button>
            </div>
        </div>
        </section>




        
        
    );
}
