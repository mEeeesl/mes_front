'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useModalStore } from '@/stores/useModalStore'; // Custom modal 스토어

export default function KakaoCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code');
  const showAlert = useModalStore((state) => state.showAlert);
  const isProcessing = useRef(false); // StrictMode 중복 실행 방지

  useEffect(() => {
        // 이미 처리 중이면 중단
        if (isProcessing.current) return;
        
        if (code) {
            isProcessing.current = true;
            console.log('카카오 인증 코드 획득:', code);

            // 여기서 alert을 띄우기 전에, 
            // 현재 페이지에서 getProfile 등이 호출되지 않도록 주의해야 합니다.
            
            showAlert('카카오 인증에 성공했습니다!');
            
            // 인증 성공 후 가입 페이지의 '마지막 단계'로 이동
            // 이때 code를 쿼리스트링으로 들고 가서 가입 버튼 클릭 시 자바 백엔드로 전송
            //router.replace(`/signup?step=final&code=${code}`);


            // 1. URL 파라미터 대신 세션 스토리지에 저장 (브라우저 끄면 날아감 - 보안상 적절)
            sessionStorage.setItem('kakao_auth_code', code);

            // 2. signup 페이지로 이동
            router.replace('/signup?step=final');

        } else {
            // 코드가 없으면 가입 페이지로 튕구기
            router.replace('/signup');
        }
    }, [code, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#488ad8]"></div>
            <p className="mt-4 text-gray-500 font-medium">본인 확인 완료 중...</p>
        </div>
    );
}