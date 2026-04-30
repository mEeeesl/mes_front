import React, { useState, useRef } from 'react';
import { CheckIcon, ChevronRightIcon, LockClosedIcon, InfoCircledIcon } from '@radix-ui/react-icons';

/**
 * RegistrationForm: 개인정보 동의(Consent)부터 상세 정보 입력까지 처리하는 통합 모달
 */
export default function RegistrationForm({ onSuccess, onClose }: { onSuccess: () => void, onClose: () => void }) {
    const [currentStep, setCurrentStep] = useState(1); // 1: 동의(Consent), 2: 입력(Registration)
    const [isAgreed, setIsAgreed] = useState(false);
    
    const [formData, setFormData] = useState({
        ju1: '', ju2: '', bank: '', account: '', gender: ''
    });

    const ju2Ref = useRef<HTMLInputElement>(null);

    // 주민번호 앞자리 입력 (숫자 6자리 완료 시 뒷자리로 포커스 이동)
    const handleJu1Change = (val: string) => {
        const filtered = val.replace(/[^0-9]/g, '').slice(0, 6);
        setFormData(prev => ({ ...prev, ju1: filtered }));
        if (filtered.length === 6) ju2Ref.current?.focus();
    };

    // 주민번호 뒷자리 (숫자 7자리 제한)
    const handleJu2Change = (val: string) => {
        const filtered = val.replace(/[^0-9]/g, '').slice(0, 7);
        setFormData(prev => ({ ...prev, ju2: filtered }));
    };

    // 계좌번호 (숫자와 하이픈만 허용)
    const handleAccountChange = (val: string) => {
        const filtered = val.replace(/[^0-9-]/g, '');
        setFormData(prev => ({ ...prev, account: filtered }));
    };

    // 단계별 유효성 검사 로직
    const isJuminFull = formData.ju1.length === 6 && formData.ju2.length === 7;
    const canShowAccount = isJuminFull && formData.bank.trim().length > 0;
    const canShowGender = canShowAccount && formData.account.length > 5;
    const isAllValid = canShowGender && formData.gender !== '';

    return (
        <div className="fixed inset-0 z-[500] flex items-center sm:items-center justify-center p-0 sm:p-4">
            {/* 시각적 깊이감을 주는 블러 배경 */}
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
            
            <div className="relative bg-white w-full max-w-lg rounded-[3rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
                
                {/* 상단 프로그레스 인디케이터 */}
                <div className="flex h-1.5 w-full bg-slate-50">
                    <div className={`h-full bg-blue-500 transition-all duration-700 ease-out ${currentStep === 1 ? 'w-1/3' : 'w-full'}`} />
                </div>

                <div className="p-8 sm:p-12 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    
                    {/* [1단계] 개인정보 수집 및 이용 동의 (Privacy Consent) */}
                    {currentStep === 1 && (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                            <header className="mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                    <LockClosedIcon className="w-7 h-7 text-blue-600" />Security Check
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">서비스 이용 동의 <span className="text-[20px] text-[#488ad8]">(필수)</span></h3>
                                <p className="text-slate-500 mt-3 font-medium leading-relaxed">
                                    정확한 급여 지급 및 고용보험 신고를 위해<br/> 
                                    <span className="text-slate-900 font-bold">개인정보 수집 동의</span>가 필요합니다.<br/><br/>
                                    동의를 거부할 수 있으나, 필수 항목 미동의 시<br/>
                                    근무신청과 급여지급이 제한될 수 있습니다.
                                    

                                </p>
                            </header>

                            {/* 동의 내용 박스 (더 깔끔하게 개선) */}
                            <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 mb-8 transition-all">
                                <div className="text-[12px] text-slate-500 leading-relaxed space-y-4 h-44 overflow-y-auto pr-2 custom-scrollbar scroll-smooth">
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
                                    <button 
                                        onClick={() => setIsAgreed(!isAgreed)}
                                        className="flex items-center justify-between w-full group"
                                    >
                                        <span className={`font-black transition-colors ${isAgreed ? 'text-blue-600' : 'text-slate-400'}`}>
                                            위 내용을 모두 확인했습니다
                                        </span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border-2 
                                            ${isAgreed ? 'bg-blue-600 border-blue-600' : 'border-slate-200 group-hover:border-slate-300'}`}>
                                            <CheckIcon className="text-white w-5 h-5" />
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <button 
                                disabled={!isAgreed}
                                onClick={() => setCurrentStep(2)}
                                className="w-full py-6 bg-slate-900 text-white font-black rounded-[1.8rem] text-lg shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center gap-2"
                            >
                                동의 완료 후 정보 입력 <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* [2단계] 상세 정보 입력 (Registration) */}
                    {currentStep === 2 && (
                        <div className="animate-in slide-in-from-right-10 duration-500">
                            <header className="mb-10 text-center sm:text-left">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">상세 정보 입력</h3>
                                <p className="text-slate-500 mt-2 font-medium leading-relaxed">
                                    입력하신 정보는 <span className="text-slate-900 font-bold underline decoration-blue-200 decoration-4">급여 지급 목적</span> 외에<br/> 절대 사용되지 않습니다.
                                </p>
                            </header>

                            <div className="space-y-8">
                                {/* 주민번호 섹션 */}
                                <div className="space-y-3">
                                    <label className="text-[14px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">주민등록번호</label>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="text" inputMode="numeric" placeholder="앞 6자리"
                                            value={formData.ju1} onChange={(e) => handleJu1Change(e.target.value)}
                                            className="w-full p-5 bg-slate-50 rounded-2xl font-bold text-center tracking-widest focus:ring-2 ring-blue-500/20 outline-none transition-all"
                                        />
                                        <span className="text-slate-300 font-bold">-</span>
                                        <input 
                                            type="password" ref={ju2Ref} inputMode="numeric" placeholder="뒤 7자리"
                                            value={formData.ju2} onChange={(e) => handleJu2Change(e.target.value)}
                                            className="w-full p-5 bg-slate-50 rounded-2xl font-bold text-center tracking-[0.6em] focus:ring-2 ring-blue-500/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* 은행명 섹션 */}
                                {isJuminFull && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                                        <label className="text-[14px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">입금은행</label>
                                        <input 
                                            type="text" placeholder="예: 국민은행, 카카오뱅크"
                                            value={formData.bank} onChange={(e) => setFormData({...formData, bank: e.target.value})}
                                            className="w-full p-5 bg-slate-50 rounded-2xl font-bold focus:ring-2 ring-blue-500/20 outline-none transition-all"
                                        />
                                    </div>
                                )}

                                {/* 계좌번호 섹션 */}
                                {canShowAccount && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                                        <label className="text-[14px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">계좌번호</label>
                                        <input 
                                            type="text" inputMode="numeric" placeholder="하이픈(-)을 포함해 입력하세요"
                                            value={formData.account} onChange={(e) => handleAccountChange(e.target.value)}
                                            className="w-full p-5 bg-slate-50 rounded-2xl font-bold focus:ring-2 ring-blue-500/20 outline-none transition-all text-blue-600"
                                        />
                                        <span className='ml-2 text-[#488ad8]'>※ 하이픈(-)을 포함하여 입력해주세요.</span><br/>
                                        <span className='ml-5 text-[#488ad8]'>예) 111-333-777999</span>
                                    </div>
                                )}

                                {/* 성별 섹션 */}
                                {canShowGender && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                                        <label className="text-[14px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">성별</label>
                                        <div className="flex gap-3">
                                            {['남성', '여성'].map(g => (
                                                <button 
                                                    key={g}
                                                    onClick={() => setFormData({...formData, gender: g})}
                                                    className={`flex-1 mt-2 py-4 rounded-2xl font-black transition-all border-2 
                                                        ${formData.gender === g 
                                                            ? 'bg-[#488ad8] border-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.02]' 
                                                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 등록 완료 버튼 */}
                                {formData.gender && (
                                    <div className="pt-4 animate-in fade-in slide-in-from-bottom-4">
                                        <button 
                                            disabled={!isAllValid}
                                            onClick={onSuccess}
                                            className="w-full py-5 bg-[#488ad8] text-white font-black rounded-[1.8rem] text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                                        >
                                            등록
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}