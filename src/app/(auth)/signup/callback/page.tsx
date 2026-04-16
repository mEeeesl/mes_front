'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useModalStore } from '@/stores/useModalStore'; // Custom modal 스토어
import { useSignup } from '@/hooks/auth/useSignup';
import { useAuth } from '@/hooks/login/useAuth';

//export default function KakaoCallback() {
function KakaoCallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const showAlert = useModalStore((state) => state.showAlert);
  const isProcessing = useRef(false); // StrictMode 중복 실행 방지

  const { simpleLoginKakao, isLoginingKaKao } = useAuth(); // Hook
  

  useEffect(() => {
        // 이미 처리 중이면 중단
        if (isProcessing.current) return;
        
        // 1. 로그인(KAKAO_LOGIN/NAVER_LOGIN/GOOGLE_LOGIN) OR 회원가입
        const reqType = sessionStorage.getItem("REQ_AUTH_TYPE");
        console.log("######################");
        console.log(state);

        if(!code) {
            showAlert("잘못된 접근입니다.", () => router.replace('/login'));
            return;
        }

        isProcessing.current = true;

        // [ 간편 로그인 ]
        if(reqType?.endsWith("_LOGIN")) {
            
            // 카카오
            if(reqType?.startsWith("KAKAO")){
                sessionStorage.setItem('kakao_auth_code', code);
                simpleLoginKakao(code);

            // 구글
            } else if(reqType?.startsWith("GOOGLE")){


            // 네이버    
            } else if(reqType?.startsWith("NAVER")){


            }

        // [ 회원가입 ]
        } else {

            // 1. URL 파라미터 대신 세션 스토리지에 저장 (브라우저 끄면 날아감 - 보안상 적절)
            sessionStorage.setItem('kakao_auth_code', code);

            // 2. 간편 로그인 : sessionStorage.getItem("LOGIN_TYPE", "KAKAO");           
            showAlert('카카오 인증에 성공했습니다.', () => router.replace('/signup?step=final'));
            //window.location.href = '/signup'; //세션 동기화에는 더 유리

        }
        
    }, [code, router, showAlert]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#488ad8]"></div>
            <p className="mt-4 text-gray-500 font-medium">본인 확인 완료 중...</p>
        </div>
    );
}

// 2. 외부로 내보낼 메인 컴포넌트 (Suspense로 감싸기)
export default function KakaoCallback() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-200"></div>
        <p className="mt-4 text-gray-500 font-medium">페이지를 불러오는 중...</p>
      </div>
    }>
      <KakaoCallbackInner />
    </Suspense>
  );
}