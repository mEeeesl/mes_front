'use client';

import React, { useState, useRef } from 'react';
import { CheckIcon, ChevronRightIcon, LockClosedIcon, InfoCircledIcon, Cross1Icon } from '@radix-ui/react-icons';
import { useApply } from '@/hooks/schedule/useApply'; // 훅 임포트

/**
 * RegistrationForm: 개인정보 동의(Consent)부터 상세 정보 입력까지 처리하는 통합 모달
 * 모바일에서는 '바텀 시트' 스타일로, 데스크톱에서는 일반 모달로 동작합니다.
 * onSuccess에서 입력된 데이터를 부모 컴포넌트로 넘겨줍니다.
 */
// onSuccess 타입을 (data: any) => void 로 변경
export default function RegistrationForm({ onSuccess, onClose }: { onSuccess: (data: any) => void, onClose: () => void }) {
    const { appliedDates } = useApply(); // 이미 신청된 날짜 가져오기
    const [currentStep, setCurrentStep] = useState(1); // 1: 동의(Consent), 2: 입력(Registration)
    const [isAgreed, setIsAgreed] = useState(false);
    
    const [formData, setFormData] = useState({
        ju1: '', ju2: '', bank_nm: '', accnt_num: '', user_sex: '',
        selectedDate: '' // 선택된 날짜 필드
    });

    const ju2Ref = useRef<HTMLInputElement>(null);
    const submitSectionRef = useRef<HTMLDivElement>(null); // 1. 등록 버튼 영역을 가리킬 Ref 생성 (성별 선택 시 스크롤용)

    // 날짜 비활성화 여부 체크 함수
    const isDateDisabled = (dateString: string) => {
        return appliedDates.includes(dateString);
    };

    const handleGenderSelect = (g: string) => {
        setFormData({ ...formData, user_sex: g });
        
        // 성별을 클릭하고 버튼이 렌더링된 직후에 스크롤 (약간의 지연 필요)
        setTimeout(() => {
            submitSectionRef.current?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    };

    // 주민번호 앞자리 입력
    const handleJu1Change = (val: string) => {
        const filtered = val.replace(/[^0-9]/g, '').slice(0, 6);
        setFormData(prev => ({ ...prev, ju1: filtered }));
        if (filtered.length === 6) ju2Ref.current?.focus();
    };

    // 주민번호 뒷자리
    const handleJu2Change = (val: string) => {
        const filtered = val.replace(/[^0-9]/g, '').slice(0, 7);
        setFormData(prev => ({ ...prev, ju2: filtered }));
    };

    // 계좌번호
    const handleAccountChange = (val: string) => {
        const filtered = val.replace(/[^0-9-]/g, '');
        setFormData(prev => ({ ...prev, accnt_num: filtered }));
    };

    // 최종 제출 핸들러
    const handleSubmit = () => {
        // 날짜 선택 여부 등 최종 확인 후 제출
        onSuccess(formData);
    };

    // 단계별 유효성 검사 로직
    const isJuminFull = formData.ju1.length === 6 && formData.ju2.length === 7;
    const canShowAccount = isJuminFull && formData.bank_nm.trim().length > 0;
    const canShowGender = canShowAccount && formData.accnt_num.length > 5;

    return (
        <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* 배경 블러 처리 */}
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
            
	    {/* 모달 본체: 모바일 바텀시트 애니메이션 및 스타일 추가 */}
            <div className="relative bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden h-[92vh] sm:h-auto max-h-[100vh] sm:max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-500 ease-out">
                
                {/* 모바일 전용 핸들 바: 시각적으로 바텀 시트임을 인지하게 함 */}
                <div className="flex justify-center pt-4 pb-2 sm:hidden">
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                </div>

                {/* 상단 프로그레스바 */}
                <div className="flex h-1.5 w-full bg-slate-50">
                    <div className={`h-full bg-blue-500 transition-all duration-700 ease-out ${currentStep === 1 ? 'w-1/3' : 'w-2/3'}`} />
                </div>

                {/* 닫기 버튼 */}
                <button onClick={onClose} className="absolute top-12 right-6 z-10 w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                    <Cross1Icon className="w-5 h-5" />
                </button>

                <div className="p-8 sm:p-12 overflow-y-auto custom-scrollbar flex-1">
                    
                    {/* [Step 1] 개인정보 수집 및 이용 동의 */}
                    {currentStep === 1 && (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                            <header className="mb-8 pr-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                    <LockClosedIcon className="w-3 h-3" /> Security Check
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">서비스 이용 동의</h3>
                                <div className="text-slate-500 mt-3 font-medium text-sm leading-relaxed">
                                    정확한 급여 지급 및 고용보험 신고를 위해<br/> 
                                    <span className="text-slate-900 font-bold">개인정보 수집 동의</span>가 필요합니다.<br/><br/>
                                    동의를 거부할 수 있으나, 필수 항목 미동의 시<br/>
                                    근무신청과 급여지급이 제한될 수 있습니다.
                                </div>
                            </header>

                            <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 mb-8">
                                <div className="text-[12px] text-slate-500 leading-relaxed space-y-4 h-44 overflow-y-auto pr-2 custom-scrollbar">
                                    <p>근무 신청, 급여 이체, 법정 의무 신고를 위해 주민등록번호 등의 수집이 필요합니다.</p>
                                    <section>
                                        <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-1">
                                            <InfoCircledIcon /> 수집 및 이용 목적
                                        </h4>
                                        <p>근무 신청 확인, 본인 식별, 급여 이체, 법정 의무 신고(고용보험, 간이지급명세서 제출 등)</p>
                                    </section>
                                    <section>
                                        <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-1">
                                            <InfoCircledIcon /> 수집 항목
                                        </h4>
                                        <p>성명, 주민등록번호(앞/뒤), 은행명, 계좌번호, 성별, 연락처</p>
                                    </section>
                                    <section>
                                        <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-1">
                                            <InfoCircledIcon /> 보유 및 이용 기간
                                        </h4>
                                        <p>소득세법 등 관계 법령에 따라 최대 5년 보관 후 즉시 파기합니다.</p>
                                    </section>
                                </div>
                                
                                {/* 커스텀 체크박스 UI */}
                                <div className="mt-6 pt-5 border-t border-slate-200">
                                    <button onClick={() => setIsAgreed(!isAgreed)} className="flex items-center justify-between w-full group">
                                        <span className={`font-black transition-colors ${isAgreed ? 'text-blue-600' : 'text-slate-400'}`}>위 내용을 확인했습니다</span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border-2 
                                            ${isAgreed ? 'bg-blue-600 border-blue-600' : 'border-slate-200'}`}>
                                            <CheckIcon className="text-white w-5 h-5" />
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <button 
                                disabled={!isAgreed}
                                onClick={() => setCurrentStep(2)}
                                className="w-full py-6 bg-slate-900 text-white font-black rounded-[2rem] text-lg shadow-xl hover:bg-black transition-all disabled:opacity-20 flex items-center justify-center gap-2"
                            >
                                다음 단계로 <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* [Step 2] 정보 입력 */}
                    {currentStep === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-10 duration-500">
                            <header className="mb-10">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">상세 정보 입력</h3>
                                <p className="text-slate-500 mt-2 font-medium text-sm">
                                    급여 지급 및 고용보험 신고를 위한 정보입니다.
                                </p>
                                <p className="text-slate-500 mt-2 font-medium leading-relaxed text-sm">
                                    입력하신 정보는 <span className="text-slate-900 font-bold underline decoration-blue-200 decoration-4">급여 지급 목적</span> 외에<br/> 절대 사용되지 않습니다.
                                </p>
                            </header>

                            <div className="space-y-8 pb-10">
                                {/* 주민번호 섹션 */}
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">주민등록번호</label>
                                    <div className="flex items-center gap-2">
                                        <input type="text" inputMode="numeric" placeholder="앞 6자리" value={formData.ju1} onChange={(e) => handleJu1Change(e.target.value)}
                                            className="w-full p-5 bg-slate-50 rounded-2xl font-bold text-center outline-none focus:ring-2 ring-blue-500/20 transition-all" />
                                        <span className="text-slate-300">-</span>
                                        <input type="password" ref={ju2Ref} inputMode="numeric" placeholder="뒤 7자리" value={formData.ju2} onChange={(e) => handleJu2Change(e.target.value)}
                                            className="w-full p-5 bg-slate-50 rounded-2xl font-bold text-center outline-none focus:ring-2 ring-blue-500/20 transition-all" />
                                    </div>
                                </div>

                                {/* [참고] 날짜 선택 달력 영역이 이 위치에 들어갈 경우 예시 */}
                                {/* <Calendar tileDisabled={({date}) => isDateDisabled(format(date, 'yyyy-MM-dd'))} /> */}

                                {/* 은행명 & 계좌번호 섹션 */}
                                {isJuminFull && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">은행 및 계좌</label>
                                        <input type="text" placeholder="은행명 (ex: 국민은행, 카카오뱅크)" value={formData.bank_nm} onChange={(e) => setFormData({...formData, bank_nm: e.target.value})}
                                            className="w-full p-5 bg-slate-50 rounded-2xl font-bold mb-2 outline-none focus:ring-2 ring-blue-500/20" />
                                        {formData.bank_nm && (
                                            <input type="text" placeholder="계좌번호 (- 포함)" value={formData.accnt_num} onChange={(e) => handleAccountChange(e.target.value)}
                                                className="w-full p-5 bg-slate-50 rounded-2xl font-bold text-blue-600 outline-none focus:ring-2 ring-blue-500/20" />
                                        )}
                                    </div>
                                )}

                                {/* 성별 섹션 */}
                                {canShowAccount && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">성별</label>
                                        <div className="flex gap-2">
                                            {[
                                                { label: '남성', value: 'M' },
                                                { label: '여성', value: 'F' }
                                            ].map((user_sex) => (
                                                <button 
                                                    key={user_sex.value} 
                                                    onClick={() => handleGenderSelect(user_sex.value)}
                                                    className={`flex-1 py-4 rounded-2xl font-black border-2 transition-all 
                                                        ${formData.user_sex === user_sex.value 
                                                            ? 'bg-[#488ad8] border-blue-600 text-white shadow-md' 
                                                            : 'bg-white border-slate-100 text-slate-400'}`}
                                                >
                                                    {user_sex.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 등록 완료 버튼 섹션 - 스크롤 타겟 */}
                                <div ref={submitSectionRef} className="pt-4 min-h-[80px]">
                                    {formData.user_sex && (
                                        <button 
                                            onClick={handleSubmit}
                                            className="w-full py-6 bg-[#488ad8] text-white font-black rounded-[2rem] text-xl shadow-lg active:scale-95 transition-all animate-in zoom-in-95 duration-300"
                                        >
                                            신청하기
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}