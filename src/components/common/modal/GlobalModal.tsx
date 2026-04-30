'use client';

import { useModalStore } from '@/stores/useModalStore';

export default function GlobalModal() {
  const { isOpen, message, closeModal } = useModalStore();
  
  if (!isOpen) return null;

  // 메시지에 '완료'나 '성공'이 포함되면 더 긍정적인 느낌의 초록색 계열을 쓸 수도 있습니다.
  const isSuccess = message.includes('완료') || message.includes('성공');

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
      {/* 배경 블러 처리 */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={closeModal} 
      />
      
      {/* 모달 본체 */}
      <div className="relative w-full max-w-[340px] overflow-hidden rounded-[2.5rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-in zoom-in-95 slide-in-from-top-4 duration-300">
        <div className="p-8 text-center">
          {/* 아이콘 영역: 주의 아이콘 대신 부드러운 체크 아이콘으로 변경 */}
          <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${isSuccess ? 'bg-green-50' : 'bg-blue-50'}`}>
            <svg className={`h-8 w-8 ${isSuccess ? 'text-green-500' : 'text-[#488ad8]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isSuccess ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
          </div>
          
          <h3 className="text-lg font-black text-slate-800 mb-2">알림</h3>
          <p className="whitespace-pre-wrap text-slate-500 font-semibold leading-relaxed break-keep">
            {message}
          </p>
        </div>

        <div className="p-6 pt-0">
            <button
            onClick={closeModal}
            className={`w-full py-4 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95 ${isSuccess ? 'bg-[#488ad8] shadow-green-100' : 'bg-[#488ad8] shadow-blue-100'} hover:brightness-110`}
            >
            확인
            </button>
        </div>
      </div>
    </div>
  );
}

/*
// components/common/GlobalModal.tsx
'use client';

import { useModalStore } from '@/stores/useModalStore';

export default function GlobalModal() {
  const { isOpen, message, closeModal } = useModalStore();
  console.log("모달 상태:", {isOpen, message});
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#488ad8]/10">
            <svg className="h-6 w-6 text-[#488ad8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="whitespace-pre-wrap text-gray-700 font-medium leading-relaxed">
            {message}
          </p>
        </div>
        <button
          onClick={closeModal}
          className="w-full bg-[#488ad8] py-4 text-white font-bold hover:bg-[#3a72b5] transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
}
  */