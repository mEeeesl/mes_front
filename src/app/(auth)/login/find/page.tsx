'use client';

import { useState, useEffect } from 'react'; // useEffect 추가
import Link from 'next/link';
import { useFindStore, FindType } from '@/stores/auth/find/useFindStore';
import { useFindAccount } from '@/hooks/login/find/useFindAccount';
import { useModalStore } from '@/stores/useModalStore';

//type FindType = 'ID' | 'PW';

export default function FindAccountPage() {
    const showAlert = useModalStore((state) => state.showAlert);
    const { activeTab, setActiveTab } = useFindStore();
    
    const [isAuthSent, setIsAuthSent] = useState(false); // 인증번호 발송 여부
    const [authCode, setAuthCode] = useState(''); // 인증번호 입력값
    // 훅을 부를 때 성공(onSuccess) 시 실행할 로직
    //const { findId, isFindingId, findPw, isFindingPw } = useFindAccount();
    const { verifyAuthCode, findId, isFindingId, findPw, isFindingPw } = useFindAccount(() => {
        setIsAuthSent(true); // 훅에서 성공하면 페이지의 이 상태를 true로!
    });
    

    // 1. 상태 : 이름, 아이디, 이메일 관리
    const [formValues, setFormValues] = useState({
        name: '',
        userId: '',
        email: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget; // [수정] e.target 대신 e.currentTarget 사용
        let newValue = value;

        if (name === 'userId') newValue = value.toLowerCase().replace(/[^a-z0-9]/g, '');
        else if (name === 'email') newValue = value.replace(/[^a-z0-9!@#$%^&*()._\-]/g, '');
        else if (name === 'name') newValue = value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');

        setFormValues(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    // 인증번호 핸들러
    const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 영문+숫자만 허용
        const val = e.currentTarget.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        setAuthCode(val);
    };

    // 쿨타임 상태 관리 (초 단위)
    const [coolDown, setCoolDown] = useState(0);
    const brandColor = "#488ad8";

    // 쿨타임 타이머 로직
    useEffect(() => {
        if (coolDown > 0) {
            const timer = setTimeout(() => setCoolDown(coolDown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [coolDown]);

    // 인증번호 확인 + 찾기 요청 데이터 반환 로직
    const handleVerifyCode = () => {
        
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // { 공통 로직 }
        if (coolDown > 0) return; // 쿨타임 중 중복 클릭 방지

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const userId = formData.get('userId') as string;
        const authCode = formData.get('authCode') as string;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        // { 인증번호 발송 후 }
        if(isAuthSent){
            handleVerifyCode();
            
            if (activeTab === 'ID') {
                findId({ activeTab, name, email, authCode });
            } else {
                findPw({ activeTab, name, userId, email, authCode });
            }

        
        // { 인증번호 발송 전 }
        } else {
            
            if (!emailRegex.test(email)) return showAlert("올바른 이메일 형식이 아닙니다.");

            verifyAuthCode({ activeTab, name, email, authCode });

            // 요청 성공 여부와 상관없이 발송 버튼 클릭 시 5초 쿨타임 시작
            setCoolDown(10);
        }
        
        
    };

    

    const isLoading = isFindingId || isFindingPw;
    // 버튼 비활성화 조건: 로딩 중이거나 쿨타임이 남았을 때
    const isButtonDisabled = isLoading || coolDown > 0;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                
                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">계정 찾기</h2>
                    
                    <p className="text-gray-500 mt-2 text-sm"><span className="text-[15px] text-[#488ad8]">가입하신 정보</span>를 입력하여 본인 인증을 진행해 주세요.</p>
                </div>

                {/* Tab Menu */}
                <div className="flex border-b">
                    {(['ID', 'PW'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setFormValues({ name: '', userId: '', email: '' }); // 탭 변경 시 리셋
                                //setCoolDown(0); // 탭 전환 시 쿨타임 초기화 여부

                            }}
                            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                                activeTab === tab ? 'border-b-2' : 'text-gray-400'
                            }`}
                            style={activeTab === tab ? { borderColor: brandColor, color: brandColor } : {}}
                        >
                            {tab === 'ID' ? '아이디 찾기' : '비밀번호 찾기'}
                        </button>
                    ))}
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* 1. 이름 입력 (항상 노출) */}
                        <div className="transition-all duration-300 ease-in-out">
                            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                            <input
                                name="name"
                                value={formValues.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                                style={{ '--tw-ring-color': brandColor } as any}
                                placeholder="가입한 이름을 입력하세요"
                            />
                            <span className="block text-[11px] mt-1.5 ml-1 text-[#488ad8]">※ 한글만 입력가능</span>
                        </div>

                        {/* 2. 아이디 입력 (PW 탭이면서 이름이 2자 이상일 때만 노출) */}
                        {activeTab === 'PW' && formValues.name.length >= 2 && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                                <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
                                <input
                                    name="userId"
                                    value={formValues.userId}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                                    style={{ '--tw-ring-color': brandColor } as any}
                                    placeholder="아이디를 입력하세요"
                                />
                                <span className="block text-[11px] mt-1.5 ml-1 text-[#488ad8]">※ 영문 소문자/숫자 조합 6~20자</span>
                            </div>
                        )}

                        {/* 3. 이메일 입력 (이전 단계가 완료되었을 때 노출) 
                            - ID 탭: 이름 2자 이상
                            - PW 탭: 이름 2자 이상 AND 아이디 2자 이상
                        */}
                        {((activeTab === 'ID' && formValues.name.length >= 2) || 
                            (activeTab === 'PW' && formValues.name.length >= 2 && formValues.userId.length >= 2)) && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formValues.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                                    style={{ '--tw-ring-color': brandColor } as any}
                                    placeholder="example@email.com"
                                />
                            </div>
                        )}

                        {/* 4. 버튼 노출 (마지막 단계인 이메일이 2자 이상일 때만 노출) */}
                        {formValues.email.length >= 2 && (
                            <div className="animate-in fade-in zoom-in-95 duration-300">
                                <button
                                    type="submit"
                                    disabled={isButtonDisabled}
                                    className="w-full py-4 rounded-lg text-white font-bold shadow-md hover:opacity-90 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: !isButtonDisabled ? brandColor : undefined }}
                                >
                                    {isLoading ? (
                                    '요청 처리 중...'
                                    ) : coolDown > 0 ? (
                                    `재발송 가능까지 ${coolDown}초`
                                    ) : (
                                    '이메일로 인증번호 발송'
                                    )}
                                </button>
                            </div>
                        )}

                        {/* 인증번호 입력란 - isAuthSent가 true일 때만 노출 */}
                        {isAuthSent && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4 pt-4 border-t">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-xs text-blue-600 font-semibold mb-2">
                                        입력하신 이메일로 인증번호가 전송되었습니다.
                                    </p>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">인증번호</label>
                                    <input
                                        name="authCode"
                                        value={authCode}
                                        onChange={handleAuthChange}
                                        maxLength={6}
                                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 text-center text-xl font-bold tracking-widest"
                                        placeholder="인증번호 6자리"
                                    />
                                </div>
                                <button
                                    type="button" // 서브밋 방지
                                    className="w-full py-4 rounded-lg text-white font-bold shadow-md bg-gray-800 hover:bg-black transition-all"
                                >
                                    인증번호 확인
                                </button>
                            </div>
                        )}


                    </form>

                    

                    <div className="mt-8 flex justify-between text-sm">
                        <Link href="/login" className="text-gray-400 hover:text-gray-600 transition-colors">로그인으로 돌아가기</Link>
                        <Link href="/signup" style={{ color: brandColor }} className="font-bold">회원가입</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}