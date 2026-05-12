'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronRightIcon, CalendarIcon, Cross1Icon, CheckIcon } from '@radix-ui/react-icons';
import { getAvailableDates } from './_lib/utils';
import RegistrationForm from './_components/RegistrationForm';
import PrivacyConsent from './_components/PrivacyConsent';
import { useApply } from '@/hooks/schedule/useApply';
import { useModalStore } from '@/stores/useModalStore'; 

const SHUTTLE_STOPS: Record<string, string[]> = {
    "용인": ["명지대사거리", "용인터미널 다리 위(양지방향)", "양지사거리 통근버스 정류장"],
    "수원": ["수원역 10번출구", "동수원사거리 CU 앞", "아주대학교입구 버스정류장(아주대방면)"],
    "원주": ["단계사거리", "합동청사 왈왈이카페 앞", "시청사거리 다이소 옆 주유소"],
    "서울": ["2호선 잠실역 8번출구 앞 잠실시그마타워 앞", "천호역 8번출구 효성해링턴타워 횡단보도 앞"],
    "안산": ["중앙역 2번출구 맞은편", "상록수역 3번출구 맞은편"],
    "자차": ["자차로 출근"]
};

export default function AttendanceApply() {
    const [selectedStore, setSelectedStore] = useState<string | null>(null);
    const [showRegModal, setShowRegModal] = useState(false);
    const [isIdentityVerified, setIsIdentityVerified] = useState(false); 
    const [isAgreed, setIsAgreed] = useState(false);
    const showAlert = useModalStore((state) => state.showAlert);
    const submitButtonRef = useRef<HTMLButtonElement>(null);

    // applyAttendance 추가
    const { chkPersonalId, isCheckkingId, applyAttendance, isApplying } = useApply();

    // 최초 신청자 정보 저장용 상태 (RegistrationForm에서 받아옴)
    const [regFormData, setRegFormData] = useState<any>(null);

    const [applyData, setApplyData] = useState<{
        dates: string[];
        shuttleRegion: string;
        shuttleStop: string;
    }>({
        dates: [],
        shuttleRegion: '',
        shuttleStop: '',
    });

    const stores = ['Zara', 'Massimo Dutti', 'Nike', 'H & M', 'MUSINSA STORE'];
    const availableDates = getAvailableDates();

    // --- 모달 오픈 시 부모 스크롤 방지 로직 ---
    useEffect(() => {
        if (selectedStore || showRegModal) {
            document.body.style.overflow = 'hidden'; // 스크롤 잠금
        } else {
            document.body.style.overflow = 'unset'; // 스크롤 해제
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedStore, showRegModal]);

    // 동의(true) 혹은 비동의(false)를 '클릭'했을 때 버튼 위치로 부모 요소를 스크롤
    useEffect(() => {
        if (submitButtonRef.current) {
            submitButtonRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' // 너무 과하게 이동하지 않고 버튼이 보이게만 처리
            });
        }
    }, [isAgreed]); // isAgreed 값이 바뀔 때마다 실행

    // --- UI 로직 ---
    const handleDateClick = (date: string) => {
        setApplyData(prev => {
            const isSelected = prev.dates.includes(date);
            return {
                ...prev,
                dates: isSelected ? prev.dates.filter(d => d !== date) : [...prev.dates, date]
            };
        });
    };

    const handleStoreClick = async (store: string) => {
        if (store !== 'Zara') {
            showAlert("준비중입니다.");
            return;
        }
        // 실제로는 여기서 DB 체크 로직(주민)
        chkPersonalId({}, {
            onSuccess: (res) => {
                if(res.existYn != 'Y'){
                    setIsIdentityVerified(false);
                    setShowRegModal(true);
                } else {
                    setIsIdentityVerified(true);
                    setSelectedStore(store);
                }
            },
            onError: (error) => {
                showAlert("잠시후 다시 시도해주세요.");
            }
        })
    };

    const closeModal = () => {
        setSelectedStore(null);
        setShowRegModal(false);
        setApplyData({ dates: [], shuttleRegion: '', shuttleStop: '' });
        setIsAgreed(false);
        setRegFormData(null); // 폼 데이터 초기화
    };

    // 신청하기 버튼 클릭
    const handleFinalSubmit = () => {
        // 서버에 보낼 최종 페이로드 구성
        const payload = {
            brand: selectedStore,
            ...applyData,
            // 최초 신청자 정보가 있다면 포함해서 전송
            ...(regFormData && {
                ju1: regFormData.ju1,
                ju2: regFormData.ju2,
                user_sex: regFormData.user_sex,
                bank_nm: regFormData.bank_nm,
                accnt_num: regFormData.accnt_num
            })
        };

        applyAttendance(payload, {
            onSuccess: (res) => {
                // 응답 코드(cd)에 따른 분기 처리
                if (res.cd === '0000') {
                    showAlert("신청이 완료되었습니다."); 
                    //closeModal(); 일단 대기, 개발 끝나면 활성화
                } else {
                    showAlert(res.msg || "신청 중 오류가 발생했습니다.");
                }
            },
            onError: () => {
                showAlert("서버 통신에 실패했습니다. 잠시 후 다시 시도해주세요.");
            }
        });
    };

    const isAllValid = applyData.dates.length > 0 && applyData.shuttleRegion && applyData.shuttleStop && isAgreed;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
            {/* Header */}
            <div className="bg-white px-8 py-16 shadow-sm border-b border-slate-100 text-center sm:text-left">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight italic">ATTENDANCE</h2>
                    <p className="text-slate-400 mt-3 font-semibold text-lg">브랜드를 선택하고 근무를 신청하세요.</p>
                </div>
            </div>

            {/* Brand Selection Grid */}
            <div className="max-w-5xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                {stores.map((store) => (
                    <button 
                        key={store}
                        onClick={() => handleStoreClick(store)}
                        className={`group relative overflow-hidden bg-white p-10 rounded-[3rem] border-2 transition-all flex justify-between items-center
                            ${store === 'Zara' ? 'border-transparent shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:scale-[1.03] active:scale-95 hover:shadow-2xl' : 'border-slate-50 opacity-40 cursor-not-allowed'}`}
                    >
                        <div className="flex items-center gap-6 z-10">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl 
                                ${store === 'Zara' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                {store[0]}
                            </div>
                            <span className="text-2xl font-black text-slate-800">{store}</span>
                        </div>
                        {store === 'Zara' && <ChevronRightIcon className="w-8 h-8 text-slate-300 group-hover:text-blue-600 transition-colors" />}
                    </button>
                ))}
            </div>

            {showRegModal && (
                <RegistrationForm 
                    onSuccess={(data) => { // 폼 데이터를 인자로 받음
                        setRegFormData(data); // 상세 정보 임시 저장
                        setShowRegModal(false);
                        setIsIdentityVerified(true);
                        setSelectedStore('Zara');
                    }} 
                    onClose={closeModal}
                />
            )}

            {/* [신청 모달] Step 1/2 UI 스타일 적용 */}
            {selectedStore && isIdentityVerified && (
                <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal} />
                    
                    <div className="relative bg-white w-full max-w-2xl h-[92vh] sm:h-auto sm:max-h-[85vh] rounded-t-[3.5rem] sm:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500">
                        
                        {/* Header Section */}
                        <div className="px-10 pt-12 pb-6 flex justify-between items-center border-b-1 mb-5">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 leading-tight">
                                    {selectedStore} <span className="text-[#488ad8]">신청</span>
                                </h3>
                                <p className="text-slate-400 font-bold mt-1">정보를 순서대로 선택해주세요.</p>
                            </div>
                            <button onClick={closeModal} className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-full hover:bg-slate-100">
                                <Cross1Icon className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Content Section (Scrollable) */}
                        <div className="flex-1 overflow-y-auto px-10 pb-12 space-y-12 custom-scrollbar">
                            
                            {/* 1. 날짜 선택 - PC에서 3열로 보이게 */}
                            <section className="space-y-6">
                                <label className="flex items-center gap-2 text-[12px] font-black text-[#488ad8] uppercase tracking-widest">
                                    <CalendarIcon /> Step 01. 근무 일자
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {availableDates.map(date => (
                                        <button
                                            key={date}
                                            onClick={() => handleDateClick(date)}
                                            className={`p-6 rounded-[2rem] border-2 text-left transition-all relative
                                                ${applyData.dates.includes(date) 
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg shadow-blue-100' 
                                                    : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                                        >
                                            <span className="text-l font-black">{date}</span>
                                            {applyData.dates.includes(date) && <CheckIcon className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6" />}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* 2. 지역 선택 - 모바일 가로스크롤 유지 + PC 여러 줄(Wrap) 대응 */}
                            <section className="space-y-6">
                                <label className="flex items-center gap-2 text-[12px] font-black text-[#488ad8] uppercase tracking-widest">
                                    Step 02. 탑승 지역
                                </label>
                                {/* sm:flex-wrap을 주면 PC(넓은화면)에서는 아래로 떨어지면서 여러 줄이 됩니다 */}
                                <div className="flex flex-nowrap sm:flex-wrap gap-3 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 no-scrollbar">
                                    {Object.keys(SHUTTLE_STOPS).map(region => (
                                        <button
                                            key={region}
                                            onClick={() => setApplyData(prev => ({ ...prev, shuttleRegion: region, shuttleStop: '' }))}
                                            className={`flex-shrink-0 px-8 py-5 rounded-[1.5rem] font-black text-lg border-2 transition-all
                                                ${applyData.shuttleRegion === region 
                                                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                                                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                        >
                                            {region}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* 3. 상세 장소 선택 */}
                            {applyData.shuttleRegion && (
                                <section className="space-y-6 animate-in fade-in slide-in-from-top-4">
                                    <label className="text-[12px] font-black text-[#488ad8] uppercase tracking-widest">
                                        Step 03. 상세 탑승지
                                    </label>
                                    <div className="space-y-3">
                                        {SHUTTLE_STOPS[applyData.shuttleRegion].map(stop => (
                                            <button
                                                key={stop}
                                                onClick={() => setApplyData(prev => ({ ...prev, shuttleStop: stop }))}
                                                className={`w-full p-6 rounded-[2rem] border-2 text-left transition-all flex justify-between items-center
                                                    ${applyData.shuttleStop === stop 
                                                        ? 'border-[#488ad8] bg-blue-50/50 text-slate-900 shadow-md' 
                                                        : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                                            >
                                                <span className="font-bold text-lg">{stop}</span>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                                    ${applyData.shuttleStop === stop ? 'bg-[#488ad8] border-blue-600' : 'border-slate-200'}`}>
                                                    {applyData.shuttleStop === stop && <CheckIcon className="text-white w-4 h-4" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <PrivacyConsent onAgreeChange={setIsAgreed} />

                            <div className="pt-3">
                                <button 
                                    ref={submitButtonRef}
                                    disabled={!isAllValid || isApplying} // 통신 중일 때 비활성화 추가
                                    className="w-full py-5 bg-slate-900 text-white font-black rounded-[2.5rem] text-2xl shadow-2xl hover:bg-blue-600 disabled:opacity-20 transition-all active:scale-95"
                                    onClick={handleFinalSubmit}
                                >
                                    {isApplying ? "처리 중..." : "신청하기"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}