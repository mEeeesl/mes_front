'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/login/useAuth'; // 리팩토링된 훅
import CustomInput from '@/components/common/CustomInput';

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoggingIn, user } = useAuth(); // 로직 집약적 추출
    const [formData, setFormData] = useState({ userId: '', password: '' });

    // 로그인 상태라면 접근 차단
    //이미 로그인된 유저가 로그인 후 뒤로가기로 접근 시 홈으로 튕겨내기
    useEffect(() => {
        if (user) router.replace('/');
    }, [user, router]);

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

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-5">
            <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 transition-all">
                {/* 상단 디자인 포인트 */}
                <div className="h-2 w-full bg-[#488ad8]" />
                
                <div className="p-10 md:p-12">
                    {/* 타이틀 영역 */}
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
    );
}