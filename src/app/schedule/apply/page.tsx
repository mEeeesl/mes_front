'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, CalendarIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { getAvailableDates } from './_lib/utils';
import RegistrationForm from './_components/RegistrationForm';
import PrivacyConsent from './_components/PrivacyConsent';
import { useModalStore } from '@/stores/useModalStore'; 

/**
 * 지역별 상세 탑승 장소 데이터
 */
const SHUTTLE_STOPS: Record<string, string[]> = {
    "용인": ["명지대사거리", "용인터미널 다리 위(양지방향)", "양지사거리 통근버스 정류장"],
    "수원": ["수원역 10번출구", "동수원사거리 CU 앞", "아주대학교입구 버스정류장(아주대방면)"],
    "원주": ["단계사거리", "합동청사 왈왈이카페 앞", "시청사거리 다이소 옆 주유소"],
    "서울": ["2호선 잠실역 8번출구 앞 잠실시그마타워 앞", "천호역 8번출구 효성해링턴타워 횡단보도 앞"],
    "안산": ["중앙역 2번출구 맞은편", "상록수역 3번출구 맞은편"]
};

export default function AttendanceApply() {
    // --- 상태 관리 ---
    const [selectedStore, setSelectedStore] = useState<string | null>(null);
    const [showRegModal, setShowRegModal] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false); 
    const [isAgreed, setIsAgreed] = useState(false);
    const showAlert = useModalStore((state) => state.showAlert);
    
    const [applyData, setApplyData] = useState<{
        dates: string[];
        shuttleRegion: string;
        shuttleStop: string;
    }>({
        dates: [],
        shuttleRegion: '',
        shuttleStop: '',
    });

    const stores = ['Zara', 'Nike', 'Massimo Dutti', 'Apple Store', 'Samsung Experience'];
    const availableDates = getAvailableDates();

    // --- 핸들러 ---

    // 날짜 복수 선택/해제 로직
    const handleDateClick = (date: string) => {
        setApplyData(prev => {
            const isSelected = prev.dates.includes(date);
            return {
                ...prev,
                dates: isSelected 
                    ? prev.dates.filter(d => d !== date) 
                    : [...prev.dates, date]
            };
        });
    };

    // 지역 선택 시 장소 초기화 로직 포함
    const handleRegionChange = (region: string) => {
        setApplyData(prev => ({
            ...prev,
            shuttleRegion: region,
            shuttleStop: '' // 지역이 바뀌면 기존 선택된 장소 초기화
        }));
    };

    const handleStoreClick = async (store: string) => {
        if (store !== 'Zara') {
            showAlert("준비중입니다.");
            return;
        }
        // TODO: 실제 서버 통신 코드로 대체 가능
        const hasJumin = false; 
        if (!hasJumin) {
            setShowRegModal(true);
        } else {
            setIsRegistered(true);
            setSelectedStore(store);
        }
    };

    const closeModal = () => {
        setSelectedStore(null);
        setShowRegModal(false);
        setApplyData({ dates: [], shuttleRegion: '', shuttleStop: '' });
        setIsAgreed(false);
    };

    const isAllValid = applyData.dates.length > 0 && applyData.shuttleRegion && applyData.shuttleStop && isAgreed;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
            {/* [Header] 상단 헤더 */}
            <div className="bg-white px-8 py-14 shadow-sm border-b border-gray-100">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">근무 신청</h2>
                    <p className="text-slate-400 mt-2 font-medium">원하시는 브랜드를 선택하여 일정을 등록하세요.</p>
                </div>
            </div>

            {/* [Brand List] 매장 선택 리스트 */}
            <div className="max-w-5xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                {stores.map((store) => (
                    <button 
                        key={store}
                        onClick={() => handleStoreClick(store)}
                        className={`group relative overflow-hidden bg-white p-8 rounded-[2.5rem] border-2 transition-all flex justify-between items-center
                            ${store === 'Zara' ? 'border-transparent shadow-xl hover:scale-[1.02]' : 'border-gray-50 opacity-60 cursor-not-allowed'}`}
                    >
                        {store === 'Zara' && <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />}
                        <div className="flex items-center gap-5 z-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl 
                                ${store === 'Zara' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-400'}`}>
                                {store[0]}
                            </div>
                            <span className="text-xl font-bold text-slate-700">{store}</span>
                        </div>
                        {store === 'Zara' ? <ChevronRightIcon className="w-6 h-6 text-blue-500" /> : <LockClosedIcon className="w-5 h-5 text-gray-300" />}
                    </button>
                ))}
            </div>

            {/* [Step 1] 상세 정보 등록 모달 (개인정보 동의 포함) */}
            {showRegModal && (
                <RegistrationForm 
                    onSuccess={() => {
                        setShowRegModal(false);
                        setIsRegistered(true);
                        setSelectedStore('Zara');
                    }} 
                    onClose={closeModal}
                />
            )}

            {/* [Step 2] 메인 신청 폼 모달 */}
            {selectedStore && isRegistered && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal} />
                    <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-300">
                        <div className="p-10">
                            {/* 모달 헤더 */}
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Attendance Form</span>
                                    <h3 className="text-3xl font-black text-slate-800 mt-3 tracking-tight">{selectedStore} 출근 신청</h3>
                                </div>
                                <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">✕</button>
                            </div>

                            <div className="space-y-10">
                                {/* 1. 날짜 선택 영역 */}
                                <section className="space-y-4">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                        <CalendarIcon className="w-4 h-4 text-blue-500" /> 근무 희망 날짜 (복수 선택)
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {availableDates.map(date => (
                                            <button
                                                key={date}
                                                onClick={() => handleDateClick(date)}
                                                className={`py-5 rounded-[1.5rem] font-bold transition-all border-2 
                                                    ${applyData.dates.includes(date) 
                                                        ? 'border-blue-600 bg-blue-600 text-white shadow-lg scale-[0.98]' 
                                                        : 'border-slate-50 bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                            >
                                                {date}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* 2. 셔틀 정보 영역 */}
                                <section className="space-y-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                   {/* 지역 선택 */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                            탑승 지역
                                        </label>
                                        <div className="relative group">
                                            <select 
                                                value={applyData.shuttleRegion}
                                                className="w-full p-5 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 shadow-sm outline-none 
                                                        /* 호버 시: 배경은 연한 하늘색, 테두리는 메인 컬러 */
                                                        hover:bg-[#488ad8]/10 hover:border-[#488ad8]/30 
                                                        /* 포커스 시: 메인 컬러 테두리와 글로우 효과 */
                                                        focus:border-[#488ad8] focus:ring-4 ring-[#488ad8]/10 
                                                        transition-all appearance-none cursor-pointer"
                                                onChange={(e) => handleRegionChange(e.target.value)}
                                            >
                                                <option value="">지역을 선택해 주세요</option>
                                                {Object.keys(SHUTTLE_STOPS).map(region => (
                                                    <option key={region} value={region}>{region}</option>
                                                ))}
                                            </select>
                                            {/* 화살표 아이콘도 호버 시 메인 컬러로 변경 */}
                                            <ChevronDownIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-[#488ad8] transition-colors pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* 상세 장소 선택 */}
                                    {applyData.shuttleRegion && (
                                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">상세 탑승 장소</label>
                                            <div className="relative group">
                                                <select 
                                                    value={applyData.shuttleStop}
                                                    className="w-full p-5 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 shadow-sm outline-none 
                                                            hover:bg-[#488ad8]/10 hover:border-[#488ad8]/30 
                                                            focus:border-[#488ad8] focus:ring-4 ring-[#488ad8]/10 
                                                            transition-all appearance-none cursor-pointer text-sm"
                                                    onChange={(e) => setApplyData({...applyData, shuttleStop: e.target.value})}
                                                >
                                                    <option value="">탑승 장소를 선택해 주세요</option>
                                                    {SHUTTLE_STOPS[applyData.shuttleRegion].map(stop => (
                                                        <option key={stop} value={stop}>{stop}</option>
                                                    ))}
                                                </select>
                                                <ChevronDownIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-[#488ad8] transition-colors pointer-events-none" />
                                            </div>
                                        </div>
                                    )}
                                </section>

                                {/* 3. 개인정보 동의 (컴포넌트 내 체크박스 상태 연동) */}
                                <PrivacyConsent onAgreeChange={setIsAgreed} />

                                {/* 4. 최종 신청 버튼 */}
                                <button 
                                    disabled={!isAllValid}
                                    className="w-full py-6 bg-blue-600 text-white font-black rounded-[2rem] text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
                                    onClick={() => { 
                                        showAlert(`${applyData.dates.length}건의 출근 신청이 완료되었습니다.`); 
                                        closeModal(); 
                                    }}
                                >
                                    신청 완료하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}