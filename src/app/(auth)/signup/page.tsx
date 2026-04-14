'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { useModalStore } from '@/stores/useModalStore';
import { useSignup } from '@/hooks/auth/useSignup';
import { 
  EnvelopeClosedIcon, 
  MobileIcon, 
  CalendarIcon, 
  CheckCircledIcon
} from '@radix-ui/react-icons';
import Script from 'next/script';

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function SignUpPage() {
  const router = useRouter();
  const showAlert = useModalStore((state) => state.showAlert);

  // 1. 상태 선언
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [isVerified, setIsVerified] = useState(false);
  //const [isCheckingId, setIsCheckingId] = useState(false);
  const [formData, setFormData] = useState({
    userNm: '',
    userId: '',
    userPw: '',
    telNo: '010-',
    birthDate: '',
    email: '',
  });
  const { checkId, isChecking, signup, isSigning } = useSignup(); // Hook

  // 2. 마운트 시점에 스토리지 데이터 로드 및 하이드레이션 준비
  useEffect(() => {
    setIsMounted(true); // [핵심] 이제 브라우저 환경임을 확정함

    // 기존 입력값 복원
    const savedData = sessionStorage.getItem('temp_signup_data');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }

    // 카카오 인증 여부 확인 및 자동 스텝 이동
    const authCode = sessionStorage.getItem('kakao_auth_code');
    if (authCode) {
      setIsVerified(true);
      setStep(2); // 인증 완료 상태라면 바로 Step 2로
    }

    // 다른 탭/창에서 세션 변경 시 실시간 반영
    const handleStorageChange = () => {
      const auth = sessionStorage.getItem('kakao_auth_code');
      if (auth) {
        setIsVerified(true);
        setStep(2);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 3. 입력 핸들러 (한글 조합 이슈 및 타입 에러 방지)
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget; // [수정] e.target 대신 e.currentTarget 사용
    let newValue = value;

    if (name === 'userNm') {
      newValue = value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    } 
    else if (name === 'userId') {
      newValue = value.toLowerCase().replace(/[^a-z0-9]/g, '');
    } 
    else if (name === 'userPw') {
      newValue = value.replace(/[^a-z0-9!@#$%^&*()]/g, '');
    }
    else if (name === 'telNo') {
      let onlyNums = value.replace(/[^0-9]/g, '');
      if (!onlyNums.startsWith('010')) onlyNums = '010';
      
      if (onlyNums.length <= 3) newValue = onlyNums;
      else if (onlyNums.length <= 7) newValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
      else newValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
    }
    else if (name === 'birthDate') {
      newValue = value.replace(/[^0-9]/g, '').slice(0, 8);
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  // 4. 유효성 검사 및 단계 이동
  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.userNm.length < 2) return showAlert("이름을 올바르게 입력해주세요.");
    if (formData.userId.length < 6) return showAlert("아이디를 6자 이상으로 입력해주세요.");
    if (formData.userPw.length < 9) return showAlert("비밀번호를 9자 이상으로 입력해주세요.");
    if (formData.telNo.length !== 13) return showAlert("전화번호를 올바르게 입력해주세요.");
    if (formData.birthDate.length !== 8) return showAlert("생년월일 8자리를 입력해주세요. (예: 19940101)");
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) return showAlert("올바른 이메일 형식이 아닙니다.");

    // 아이디 중복체크
    try{
      const res = await checkId(formData.userId);
      console.log(res);
      
      if(res.cd === '0000') {
        setStep(2);
      } else {
        showAlert(res.msg || "이미 사용중인 아이디입니다.");
      }
    } catch(error) {
      // 훅 error 실행 후 이곳 실행
    }

    //setStep(2);
  };

  // 5. 카카오 SDK 초기화
  const initKakao = useCallback(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      console.log('Kakao SDK 초기화 완료');
    }
  }, []);

  const handleKakaoVerify = () => {
    if (isVerified) return;
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      return showAlert('카카오 SDK가 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
    }

    // [중요] 떠나기 전 현재 데이터 세션에 백업
    sessionStorage.setItem('temp_signup_data', JSON.stringify(formData));

    window.Kakao.Auth.authorize({
      redirectUri: `${window.location.origin}/signup/callback`,
      scope: 'profile_nickname',
      throughTalk: false, 
    });
  };

  const handleSubmit = async () => {
    const authCode = sessionStorage.getItem('kakao_auth_code');
    const finalPayload = { ...formData, kakaoCode: authCode };
    
    console.log("최종 전송 데이터:", finalPayload);
    
    //임시임시!!! 테스트용
    //sessionStorage.clear(); // [중요] 가입 완료 후 스토리지 정리
    
    // TanStack Query 실행
    //mutate(finalPayload);
    signup(finalPayload);
    // 여기서 API 호출 후 성공 시 세션초기화 + 로그인페이지 이동
    
  };

  // [중요] 하이드레이션 불일치 방지 (반드시 모든 Hook 호출 뒤에 위치)
  if (!isMounted) return null;

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
        onLoad={initKakao}
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6">
        {/* ... (상단 로고/제목 생략 - 기존 코드 유지) ... */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
          <Logo type="symbol" className="w-12 h-12 mb-4" />
          <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">
            {step === 1 ? '회원정보 입력' : '본인 확인'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            서비스 이용을 위해 정보를 입력해주세요.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
            
            {step === 1 ? (
              <form className="space-y-5" onSubmit={handleNextStep}>
                {/* 이름 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700">이름</label>
                  <input 
                    name="userNm" 
                    type="text" 
                    required 
                    value={formData.userNm} 
                    maxLength={5}
                    className="mt-1 block w-full border-gray-200 border rounded-xl p-2.5 focus:ring-[#488ad8] focus:border-[#488ad8] text-sm"
                    onInput={handleChange} // [수정] onChange 대신 onInput
                  />
                  <span className="block text-[12px] mt-1 ml-1 text-[#488ad8]">
                    ※ 한글만 입력가능
                  </span>
                </div>

                {/* 아이디 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700">아이디</label>
                  <input 
                    name="userId" 
                    type="text" 
                    required 
                    value={formData.userId}
                    placeholder="6자 이상 입력"
                    className="mt-1 block w-full border-gray-200 border rounded-xl p-2.5 focus:ring-[#488ad8] focus:border-[#488ad8] text-sm"
                    onInput={handleChange}
                  />
                  <span className="block text-[12px] mt-1 ml-1 text-[#488ad8]">
                    ※ 영문 소문자/숫자 조합 6~20자
                  </span>
                </div>

                {/* 비밀번호 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700">비밀번호</label>
                  <input 
                    name="userPw" 
                    type="password" 
                    required 
                    value={formData.userPw}
                    maxLength={20}
                    className="mt-1 block w-full border-gray-200 border rounded-xl p-2.5 focus:ring-[#488ad8] focus:border-[#488ad8] text-sm"
                    onInput={handleChange}
                  />
                </div>

                {/* 조건부 노출 영역 */}
                {formData.userNm && formData.userId.length >= 6 && formData.userPw.length >= 9 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div>
                      <label className="block text-sm font-bold text-gray-700">전화번호</label>
                      <div className="mt-1 relative">
                        <MobileIcon className="absolute left-3 top-3 text-gray-400" />
                        <input 
                          name="telNo" 
                          type="tel" 
                          value={formData.telNo} 
                          maxLength={13}
                          className="pl-10 block w-full border-gray-200 border rounded-xl p-2.5 focus:ring-[#488ad8] focus:border-[#488ad8] text-sm"
                          onInput={handleChange} 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700">생년월일</label>
                      <div className="mt-1 relative">
                        <CalendarIcon className="absolute left-3 top-3 text-gray-400" />
                        <input 
                          name="birthDate" 
                          type="text" 
                          value={formData.birthDate}
                          placeholder="19940101"
                          maxLength={8}
                          className="pl-10 block w-full border-gray-200 border rounded-xl p-2.5 focus:ring-[#488ad8] focus:border-[#488ad8] text-sm"
                          onInput={handleChange} 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700">이메일</label>
                      <div className="mt-1 relative">
                        <EnvelopeClosedIcon className="absolute left-3 top-3 text-gray-400" />
                        <input 
                          name="email" 
                          type="email"
                          value={formData.email}
                          placeholder="example@erp.com"
                          className="pl-10 block w-full border-gray-200 border rounded-xl p-2.5 focus:ring-[#488ad8] focus:border-[#488ad8] text-sm"
                          onChange={handleChange} 
                        />
                      </div>
                    </div>

                    <button type="submit"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#488ad8] hover:bg-[#3a72b5] transition-all active:scale-[0.98]">
                      {isChecking ? '중복 확인 중...' : '다음 단계로 (본인인증)'}
                    </button>
                  </div>
                )}
              </form>
            ) : (
              /* --- STEP 2: 본인 확인 --- */
              <div className="text-center space-y-6 py-4">
                

                {!isVerified ? (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Image src="/images/kakao/kakaotalk_sharing_btn_small.png" alt="K" width={35} height={35} priority />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">카카오 인증이 필요합니다</h3>
                    <p className="text-sm text-gray-500">안전한 서비스 이용을 위해 본인 확인을 진행합니다.</p>
                    <button 
                      onClick={handleKakaoVerify}
                      className="w-full bg-[#FEE500] text-[#3c1e1e] py-4 rounded-2xl font-black hover:bg-[#fada0a] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-md"
                    >
                      카카오로 인증하기
                    </button>
                    <button onClick={() => setStep(1)} className="text-xs text-gray-400 underline">정보 수정하러 가기</button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center">
                        <div className="bg-blue-50 p-3 rounded-full mb-3">
                            <CheckCircledIcon className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-bold text-blue-600">인증이 완료되었습니다!</h3>
                        <p className="text-sm text-gray-500 mt-1">회원가입을 마무리해 주세요.</p>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={isSigning} // 통신 중일 때 버튼 비활성화
                      //className="w-full py-4 rounded-2xl font-black shadow-lg bg-[#488ad8] text-white hover:bg-[#3a72b5] active:scale-95"
                      className="w-full py-4 rounded-2xl font-black shadow-lg bg-[#488ad8] text-white hover:bg-[#3a72b5] active:scale-95 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isSigning ? (
                          <span className="flex items-center gap-2">
                            처리 중...
                          </span>
                        ) : '회원가입 완료하기'
                      }
                    </button>
                    {/* [보안] 인증코드는 살짝만 보여주거나 마스킹 처리 */}
                    <p className="text-[10px] text-gray-300">Auth ID: {sessionStorage.getItem('kakao_auth_code')?.substring(0, 8)}***</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}