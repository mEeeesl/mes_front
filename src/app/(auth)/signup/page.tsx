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
  CheckCircledIcon,
  ChevronRightIcon
} from '@radix-ui/react-icons';
import Script from 'next/script';

declare global {
  interface Window {
    Kakao: any;
  }
}

// --- 약관 데이터 ---
const TERMS_DATA = {
  terms: {
    title: "이용약관 전문",
    content: `제1조 (목적)\n본 약관은 회사가 운영하는 온라인 채널(홈페이지 및 모바일 앱)에서 제공하는 제반 서비스의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.\n\n제2조 (용어의 정의)\n1. "서비스"라 함은 접속 가능한 단말기의 종류와 상관없이 이용할 수 있는 회사의 서비스를 의미합니다.\n2. "회원"이라 함은 회사의 서비스에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고 이용자 아이디를 부여받은 자를 말합니다.\n\n제3조 (약관의 효력 및 변경)\n본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생하며, 회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.`
  },
  privacy: {
    title: "개인정보 수집 및 이용 동의 전문",
    content: `회사는 통합회원가입 서비스 제공을 위해 아래와 같이 귀하의 개인정보를 수집·이용합니다.\n\n1. 수집 및 이용 목적\n- 회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리\n- 서비스 부정 이용 방지, 각종 고지·통지, 고충 처리\n\n2. 수집하는 개인정보 항목\n- 필수항목: 성명, 생년월일, 성별, 아이디, 비밀번호, 휴대전화번호, 이메일 주소, CI/DI(본인확인정보)\n\n3. 개인정보의 보유 및 이용 기간\n- 회원 탈퇴 시까지 (단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간까지 보존)`
  },
  guide: {
    title: "기타 안내 사항",
    content: `개인정보 보호법 제15조 및 제17조 등 관련 법령의 근거가 있는 경우, 정보주체의 동의 없이 개인정보를 수집·이용하거나 제3자에게 제공할 수 있습니다.\n\n[개인정보 수집 및 이용 안내]\n1. 수집 목적: 회원가입 및 근태 관리(출근 관리) 연동\n2. 수집 항목: 성명, 생년월일, 휴대전화번호, 이메일\n3. 이용 기간: 고용계약 종료 시 또는 법정 보유 기간(5년) 경과 시까지\n4. 수집 근거: 근로기준법 및 관련 인사 관리 규정`
  }
};

export default function SignUpPage() {
  const router = useRouter();
  const showAlert = useModalStore((state) => state.showAlert);

  // --- [추가] 약관 동의 관련 상태 ---
  const [isAgreed, setIsAgreed] = useState(false);
  const [checks, setChecks] = useState({ terms: false, privacy: false });
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

  // --- 기존 상태 선언 ---
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [isVerified, setIsVerified] = useState(false);
  const [formData, setFormData] = useState({
    userNm: '',
    userId: '',
    userPw: '',
    telNo: '010-',
    birthDate: '',
    email: '',
  });
  const { checkId, isChecking, signup, isSigning } = useSignup();

  // 2. 마운트 시점에 스토리지 데이터 로드 및 하이드레이션 준비
  useEffect(() => {
    setIsMounted(true);

    // 기존 입력값 복원
    const savedData = sessionStorage.getItem('temp_signup_data');
    if (savedData) {
      setFormData(JSON.parse(savedData));
      setIsAgreed(true); // 데이터가 있으면 약관은 통과한 것으로 간주
    }

    // 카카오 인증 여부 확인 및 자동 스텝 이동
    const authCode = sessionStorage.getItem('kakao_auth_code');
    if (authCode) {
      setIsVerified(true);
      setStep(2);
      setIsAgreed(true);
    }

    // 다른 탭/창에서 세션 변경 시 실시간 반영
    const handleStorageChange = () => {
      const auth = sessionStorage.getItem('kakao_auth_code');
      if (auth) {
        setIsVerified(true);
        setStep(2);
        setIsAgreed(true);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 3. 입력 핸들러 (한글 조합 이슈 및 타입 에러 방지)
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget; // [수정] e.target 대신 e.currentTarget 사용
    let newValue = value;
    if (name === 'userNm') newValue = value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    else if (name === 'userId') newValue = value.toLowerCase().replace(/[^a-z0-9]/g, '');
    else if (name === 'userPw') newValue = value.replace(/[^a-z0-9!@#$%^&*()]/g, '');
    else if (name === 'telNo') {
      let onlyNums = value.replace(/[^0-9]/g, '');
      if (!onlyNums.startsWith('010')) onlyNums = '010';
      if (onlyNums.length <= 3) newValue = onlyNums;
      else if (onlyNums.length <= 7) newValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
      else newValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
    }
    else if (name === 'birthDate') newValue = value.replace(/[^0-9]/g, '').slice(0, 8);
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
    try {
      const res = await checkId(formData.userId);
      if(res.cd === '0000') setStep(2);
      else showAlert(res.msg || "이미 사용중인 아이디입니다.");
    } catch(error) {
      // 훅 error 실행 후 이곳 실행
    }
  };

  // 5. 카카오 SDK 초기화
  const initKakao = useCallback(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
  }, []);

  const handleKakaoVerify = () => {
    if (isVerified) return;
    if (!window.Kakao || !window.Kakao.isInitialized()) return showAlert('카카오 SDK가 준비되지 않았습니다.');
    sessionStorage.setItem('temp_signup_data', JSON.stringify(formData));

    window.Kakao.Auth.authorize({
      redirectUri: `${window.location.origin}/signup/callback`,
      scope: 'profile_nickname',
      throughTalk: false, 
    });
  };

  const handleSubmit = async () => {
    const authCode = sessionStorage.getItem('kakao_auth_code');
    signup({ ...formData, kakaoCode: authCode });
  };

  // [중요] 하이드레이션 불일치 방지 (반드시 모든 Hook 호출 뒤에 위치)
  if (!isMounted) return null;

  return (
    <>
      <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js" onLoad={initKakao} strategy="afterInteractive" />

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 font-sans">
        
        {/* 상단 헤더 영역 */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
          <Logo type="symbol" className="w-12 h-12 mb-4" />
          <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">
            {!isAgreed ? '약관 동의' : step === 1 ? '회원정보 입력' : '본인 확인'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            {!isAgreed ? '통합회원가입을 위해 약관에 동의해주세요.' : '서비스 이용을 위해 정보를 입력해주세요.'}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
            
            {/* --- CASE 0: 약관 동의 UI --- */}
            {!isAgreed ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="pb-4 border-b border-gray-100">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded-full border-gray-300 text-[#488ad8] focus:ring-[#488ad8]"
                      checked={checks.terms && checks.privacy}
                      onChange={(e) => setChecks({ terms: e.target.checked, privacy: e.target.checked })}
                    />
                    <span className="font-bold text-gray-800 group-hover:text-black transition-colors">이용약관 및 개인정보 수집에 전체 동의</span>
                  </label>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'terms', label: '이용 약관 동의 (필수)', data: TERMS_DATA.terms },
                    { id: 'privacy', label: '개인정보 수집 및 이용 동의 (필수)', data: TERMS_DATA.privacy },
                    { id: 'guide', label: '기타 안내 사항', data: TERMS_DATA.guide, isOptional: true }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between group">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        {!item.isOptional ? (
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 text-[#488ad8] focus:ring-[#488ad8]"
                            checked={checks[item.id as keyof typeof checks]}
                            onChange={(e) => setChecks({...checks, [item.id]: e.target.checked})}
                          />
                        ) : <div className="w-4 ml-3" />}
                        <span className="text-sm text-gray-600">{item.label}</span>
                      </label>
                      <button 
                        onClick={() => setModalContent(item.data)}
                        className="flex items-center text-[11px] text-gray-400 hover:text-[#488ad8] transition-colors"
                      >
                        전문보기 <ChevronRightIcon />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-xl text-[11px] text-gray-500 leading-relaxed border border-gray-100">
                  <p>※ 귀하는 본 서비스의 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다.</p>
                  <p className="mt-1">단, 동의 거부 시 온라인 채널(홈페이지/모바일웹) 이용이 제한됩니다.</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => router.push('/login')} className="flex-1 py-3.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">이전</button>
                  <button 
                    disabled={!(checks.terms && checks.privacy)}
                    onClick={() => setIsAgreed(true)}
                    className="flex-[2] py-3.5 bg-[#488ad8] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 disabled:bg-gray-200 disabled:shadow-none transition-all active:scale-[0.98]"
                  >
                    다음 단계로
                  </button>
                </div>
              </div>
            ) : (
              /* --- 기존 회원가입 로직 (Step 1 & 2) --- */
              step === 1 ? (
                <form className="space-y-5 animate-in fade-in duration-500" onSubmit={handleNextStep}>
                  {/* 이름 */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 ml-1">이름</label>
                    <input 
                      name="userNm" type="text" required value={formData.userNm} maxLength={5}
                      className="mt-1.5 block w-full border-gray-200 border rounded-xl p-3 focus:ring-[#488ad8] focus:border-[#488ad8] text-sm transition-all"
                      onInput={handleChange}
                    />
                    <span className="block text-[11px] mt-1.5 ml-1 text-[#488ad8]">※ 한글만 입력가능</span>
                  </div>

                  {/* 아이디 */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 ml-1">아이디</label>
                    <input 
                      name="userId" type="text" required value={formData.userId} placeholder="6자 이상 입력"
                      className="mt-1.5 block w-full border-gray-200 border rounded-xl p-3 focus:ring-[#488ad8] focus:border-[#488ad8] text-sm transition-all"
                      onInput={handleChange}
                    />
                    <span className="block text-[11px] mt-1.5 ml-1 text-[#488ad8]">※ 영문 소문자/숫자 조합 6~20자</span>
                  </div>

                  {/* 비밀번호 */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 ml-1">비밀번호</label>
                    <input 
                      name="userPw" type="password" required value={formData.userPw} maxLength={20}
                      className="mt-1.5 block w-full border-gray-200 border rounded-xl p-3 focus:ring-[#488ad8] focus:border-[#488ad8] text-sm transition-all"
                      onInput={handleChange}
                    />
                  </div>

                  {formData.userNm && formData.userId.length >= 6 && formData.userPw.length >= 9 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-500">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 ml-1">전화번호</label>
                        <div className="mt-1.5 relative">
                          <MobileIcon className="absolute left-4 top-3.5 text-gray-400" />
                          <input 
                            name="telNo" type="tel" value={formData.telNo} maxLength={13}
                            className="pl-11 block w-full border-gray-200 border rounded-xl p-3 focus:ring-[#488ad8] focus:border-[#488ad8] text-sm transition-all"
                            onInput={handleChange} 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 ml-1">생년월일</label>
                        <div className="mt-1.5 relative">
                          <CalendarIcon className="absolute left-4 top-3.5 text-gray-400" />
                          <input 
                            name="birthDate" type="text" value={formData.birthDate} placeholder="19940101" maxLength={8}
                            className="pl-11 block w-full border-gray-200 border rounded-xl p-3 focus:ring-[#488ad8] focus:border-[#488ad8] text-sm transition-all"
                            onInput={handleChange} 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 ml-1">이메일</label>
                        <div className="mt-1.5 relative">
                          <EnvelopeClosedIcon className="absolute left-4 top-3.5 text-gray-400" />
                          <input 
                            name="email" type="email" value={formData.email} placeholder="example@erp.com"
                            className="pl-11 block w-full border-gray-200 border rounded-xl p-3 focus:ring-[#488ad8] focus:border-[#488ad8] text-sm transition-all"
                            onChange={handleChange} 
                          />
                        </div>
                      </div>

                      <button type="submit"
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-[#488ad8] hover:bg-[#3a72b5] transition-all active:scale-[0.98]">
                        {isChecking ? '중복 확인 중...' : '다음 단계로 (본인인증)'}
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                <div className="text-center space-y-6 py-4 animate-in fade-in duration-500">
                  {!isVerified ? (
                    <div className="space-y-4">
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
                        disabled={isSigning}
                        className="w-full py-4 rounded-2xl font-black shadow-lg bg-[#488ad8] text-white hover:bg-[#3a72b5] active:scale-95 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isSigning ? '처리 중...' : '회원가입 완료하기'}
                      </button>
                      <p className="text-[10px] text-gray-300">Auth ID: {sessionStorage.getItem('kakao_auth_code')?.substring(0, 8)}***</p>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* --- 모달 UI --- */}
      {modalContent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-5 z-[9999] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[70vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 border-b border-gray-100 font-bold text-lg text-gray-800">{modalContent.title}</div>
            <div className="p-6 overflow-y-auto text-[13px] text-gray-600 whitespace-pre-wrap leading-6 bg-gray-50/50">
              {modalContent.content}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end bg-white">
              <button 
                className="px-8 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors"
                onClick={() => setModalContent(null)}
              >확인</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}