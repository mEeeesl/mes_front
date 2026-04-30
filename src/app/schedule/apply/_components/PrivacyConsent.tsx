import React from 'react';

export default function PrivacyConsent({ onAgreeChange }: { onAgreeChange: (agreed: boolean) => void }) {
    return (
        <div className="bg-slate-50 rounded-[2rem] p-6 space-y-4 border border-slate-100">
            <h4 className="font-black text-slate-700 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block" />
                개인정보 수집 및 이용 동의
            </h4>
            
            <div className="text-[14px] text-slate-500 leading-relaxed h-32 overflow-y-auto pr-2 custom-scrollbar bg-white/50 p-0 rounded-xl border border-slate-100">
                <p>
                    <strong>1. 수집 항목:</strong><br/>
                    성별, 주민등록번호, 계좌정보, 지역, 연락처 등
                </p>
                <p>
                    <strong>2. 이용 목적:</strong><br/>
                    근무 신청 접수 및 본인 확인, 근무 배정, 급여 지급 처리, 고용보험 신고
                </p>
                <p>
                    <strong>3. 보유 및 이용기간:</strong><br/>
                     관계 법령(국세기본법, 전자금융거래법 등)에 따라 <strong>최대 5년간 보관</strong> 후 지체 없이 파기합니다.
                </p>
                <p>
                    <strong>4. 동의 거부 권리:</strong><br/>
                    귀하는 동의를 거부할 권리가 있으나, 미동의 시 근무 신청 및 급여 지급에 제한이 있을 수 있습니다.
                </p>
            </div>

            <div className="flex items-center justify-end gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="privacy" onChange={() => onAgreeChange(true)} className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">동의함</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="privacy" onChange={() => onAgreeChange(false)} className="w-4 h-4 accent-slate-400" />
                    <span className="text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors">동의하지 않음</span>
                </label>
            </div>
        </div>
    );
}