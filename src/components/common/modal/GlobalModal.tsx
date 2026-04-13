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
          {/* 메인 컬러 아이콘 영역 */}
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