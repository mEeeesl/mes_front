'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/login/useAuth'; // 리팩토링된 훅
import CustomInput from '@/components/common/CustomInput';
import { useModalStore } from '@/stores/useModalStore';






// [1] 실제 로그인 로직과 UI를 담은 내부 컴포넌트
function LoginForm() {

    const router = useRouter();
    const { login, isLoggingIn, user } = useAuth(); // 로직 집약적 추출
    const [formData, setFormData] = useState({ userId: '', password: '' });
    const showAlert = useModalStore((state) => state.showAlert);
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');

    // 로그인 상태라면 접근 차단
    //이미 로그인된 유저가 로그인 후 뒤로가기로 접근 시 홈으로 튕겨내기
    useEffect(() => {
        if (user) {
            // 이미 로그인된 유저가 들어왔을 때도 redirect 파라미터가 있다면 그곳으로 보내주는 게 친절한 설계입니다.
            const targetPath = redirect ? decodeURIComponent(redirect) : '/';
            // Next.js App Router의 안정성을 위해 refresh 후 이동
            router.refresh(); 
            router.replace(targetPath);
        }
    }, [user, router, redirect]); // redirect를 의존성 배열에 추가
    /*
    useEffect(() => {
        if (user) router.replace('/');
    }, [user, router]);
    */

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ 
            ...prev, // 이전 값
            [name]: value 
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(formData); // 깔끔한 호출
    };

    // 카카오 SDK 초기화
    const initKakao = useCallback(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
          console.log('Kakao SDK 초기화 완료');
        }
      }, []);

    // 카카오 로그인 핸들러
    const handleKakaoLogin = () => {
        if (!window.Kakao || !window.Kakao.isInitialized()) {
           return showAlert('카카오 SDK가 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
        }

        sessionStorage.setItem("REQ_AUTH_TYPE", "KAKAO_LOGIN");
        if (redirect) {
            sessionStorage.setItem('login_redirect', redirect);
        }

        window.Kakao.Auth.authorize({
            redirectUri: `${window.location.origin}/signup/callback`,
            scope: 'profile_nickname',
            throughTalk: false,
            state: 'simplLoginKakao', // GET방식으로 callback 페이지에 넘겨줌 - 구글/카카오/네이버 모두 지원하는 표준 파라미터인듯, 근데 code도 넘겨서 별로인듯
        });
        //const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
        //window.location.href = KAKAO_AUTH_URL;
    };

    // 준비 중 알럿 핸들러
    const handleReadySoon = (name: string) => {
        showAlert(`${name} 로그인은 현재 준비 중입니다.`);
    };

    return (
        <>
        <Script
            src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
            onLoad={initKakao}
            strategy="afterInteractive"
        />
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-5">
            <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 transition-all">
                {/* 상단 디자인 포인트 */}
                <div className="h-2 w-full bg-[#488ad8]" />
                
                <div className="p-10 md:p-12">
                    
                    
                    {/* 로그인 타이틀 영역 */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-[#488ad8] mb-2 tracking-tighter">로그인</h2>
                        <div className="w-8 h-1 bg-gray-100 mx-auto rounded-full" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            {/* 기존 CustomInput 구조 유지 */}
                            <CustomInput
                                label="아이디"
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                placeholder="아이디를 입력하세요"
                                // CustomInput 내부에 className 전달이 가능하다면 아래처럼 디밸롭 가능
                                // className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#488ad8] outline-none transition-all"
                            />
                            <CustomInput
                                label="비밀번호"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="비밀번호를 입력하세요"
                            />
                        </div>

                        {/* 로그인 버튼 디밸롭 */}
                        <button 
                            type="submit" 
                            disabled={isLoggingIn}
                            className={`w-full py-5 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-[0.98] mt-4
                                ${isLoggingIn 
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                    : 'bg-[#488ad8] text-white hover:bg-[#3a72b5] hover:shadow-[#488ad8]/30 shadow-[#488ad8]/20'
                                }`}
                        >
                            {isLoggingIn ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    로그인 중...
                                </span>
                            ) : '로그인'}
                        </button>
                    </form>

                    {/* --- 간편 로그인 영역 시작 --- */}
                    <div className="mt-8">
                        <div className="relative flex items-center mb-8">
                            <div className="flex-grow border-t border-gray-100"></div>
                            <span className="flex-shrink mx-4 text-gray-300 text-xs font-bold uppercase tracking-widest">소셜 로그인</span>
                            <div className="flex-grow border-t border-gray-100"></div>
                        </div>

                        <div className="flex justify-center gap-4">
                            {/* 카카오톡 */}
                            <button 
                                onClick={handleKakaoLogin}
                                //className="w-14 h-14 bg-[#FEE500] rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
                                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
                                title="카카오 로그인"
                            >
                                <Image src="/images/kakao/kakaotalk_sharing_btn_small.png" alt="K" width={35} height={35} priority />
                            </button>

                            {/* 네이버 */}
                            <button 
                                onClick={() => handleReadySoon('네이버')}
                                //className="w-14 h-14 bg-[#03A94D] rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
                                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
                                title="네이버 로그인"
                            >
                                <img src="/images/naver/NAVER_login_KR/NAVER_login_Dark_KR_green_icon_H48.png" alt="네이버" className="w-10 h-10" />
                            </button>

                            {/* 구글 */}
                            <button 
                                onClick={() => handleReadySoon('구글')}
                                className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
                                title="구글 로그인"
                            >
                                <img src="/images/google/web_neutral_rd_na@1x.png" alt="구글" className="w-10 h-10" />
                            </button>
                        </div>
                    </div>
                    {/* --- 간편 로그인 영역 끝 --- */}

                    {/* 하단 보조 메뉴 */}
                    <div className="mt-10 flex justify-center gap-6 text-xs font-bold text-gray-400">
                        <button onClick={() => {router.push('/signup');}} className="hover:text-[#488ad8] transition-colors cursor-pointer">회원가입</button>
                        <div className="w-[1px] h-3 bg-gray-200 self-center" />
                        <button className="hover:text-[#488ad8] transition-colors cursor-pointer">아이디 찾기</button>
                        <div className="w-[1px] h-3 bg-gray-200 self-center" />
                        <button className="hover:text-[#488ad8] transition-colors cursor-pointer">비밀번호 찾기</button>                     
                    </div>
                </div>
            </div>
        </div>
        </>
    );
    
}







export default function LoginPage() {

    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#488ad8]"></div>
                <p className="ml-3 text-gray-500">로그인 화면을 불러오는 중입니다...</p>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
