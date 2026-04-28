'use client';

import { useState, FormEvent } from 'react';
import { LockClosedIcon } from '@radix-ui/react-icons';
import { useModalStore } from '@/stores/useModalStore';

/**
 * @param onConfirm - 비밀번호 확인 성공 시 실행할 함수
 * @param title - 화면에 표시할 제목 (개인정보 수정 혹은 비밀번호 변경)
 */

// 1. Props에 대한 타입 정의 (인터페이스)
interface PasswordConfirmProps {
    onConfirm: () => void; // 매개변수 없고 리턴값 없는 함수
    title: string;         // 문자열
}

export default function PasswordConfirm({ onConfirm, title }: PasswordConfirmProps) {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const showAlert = useModalStore((state) => state.showAlert);

    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!password) {
            showAlert('비밀번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            // TODO: 여기서 authService.verifyPassword(password) 같은 API 호출
            // 성공했다는 가정하에 진행합니다.
            console.log("비밀번호 검증 시도:", password);
            
            // 실제로는 API 응답이 성공(0000)일 때만 onConfirm 호출
            onConfirm(); 
        } catch (error) {
            showAlert('비밀번호가 일치하지 않습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <LockClosedIcon className="w-8 h-8 text-[#488ad8]" />
                </div>
                <h2 className="text-2xl font-black text-gray-800">{title}</h2>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                    개인정보 보호를 위해 <br />현재 비밀번호를 입력해주세요.
                </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Current Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#488ad8] transition-all outline-none font-bold"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#488ad8] text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-[#3a72b5] transition-all disabled:bg-gray-300"
                >
                    {isLoading ? '확인 중...' : '인증하기'}
                </button>
            </form>
        </div>
    );
}