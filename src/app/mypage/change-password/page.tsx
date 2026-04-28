'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/stores/useModalStore';
import PasswordConfirm from '../_components/PasswordConfirm'; // 공통 컴포넌트 재사용
import { 
    LockClosedIcon, 
    ChevronLeftIcon,
    UpdateIcon,
    CheckIcon
} from '@radix-ui/react-icons';

export default function ChangePasswordPage() {
    const router = useRouter();
    const showAlert = useModalStore((state) => state.showAlert);

    // [상태 관리] 1. 기존 비번 인증 여부 2. 새 비번 입력값들
    const [isVerified, setIsVerified] = useState(false);
    const [pwdData, setPwdData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 비밀번호 변경 처리 함수
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // [유효성 검사] 1. 빈값 확인
        if (!pwdData.newPassword || !pwdData.confirmPassword) {
            showAlert('새 비밀번호를 모두 입력해주세요.');
            return;
        }

        // [유효성 검사] 2. 일치 여부 확인
        if (pwdData.newPassword !== pwdData.confirmPassword) {
            showAlert('새 비밀번호가 서로 일치하지 않습니다.');
            return;
        }

        // [유효성 검사] 3. 길이 등 정책 (예: 8자 이상)
        if (pwdData.newPassword.length < 8) {
            showAlert('비밀번호는 최소 8자 이상이어야 합니다.');
            return;
        }

        setIsSubmitting(true);
        try {
            // TODO: authService.changePassword(pwdData.newPassword) 호출
            console.log("비밀번호 변경 요청:", pwdData.newPassword);
            
            showAlert('비밀번호가 안전하게 변경되었습니다.', () => {
                router.replace('/mypage');
            });
        } catch (error) {
            showAlert('비밀번호 변경 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // [Step 1] 현재 비밀번호 인증 전
    if (!isVerified) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-md mx-auto mb-4">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-1 text-gray-400 hover:text-gray-600 font-bold transition-colors"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                        마이페이지로 돌아가기
                    </button>
                </div>
                {/* 비밀번호 변경을 위한 인증임을 title로 전달 */}
                <PasswordConfirm 
                    title="비밀번호 변경" 
                    onConfirm={() => setIsVerified(true)} 
                />
            </div>
        );
    }

    // [Step 2] 인증 완료 후 새 비밀번호 설정 폼
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-xl mx-auto">
                <h2 className="text-3xl font-black text-gray-800 mb-8 tracking-tighter">비밀번호 변경</h2>
                
                <form onSubmit={handleChangePassword} className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-8">
                        
                        {/* 새 비밀번호 입력 */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-black text-gray-700 ml-1">
                                <LockClosedIcon className="text-[#488ad8]" />
                                새 비밀번호
                            </label>
                            <input
                                type="password"
                                value={pwdData.newPassword}
                                onChange={(e) => setPwdData({...pwdData, newPassword: e.target.value})}
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#488ad8] transition-all outline-none font-bold text-gray-600"
                                placeholder="새로운 비밀번호를 입력하세요"
                            />
                        </div>

                        {/* 새 비밀번호 확인 */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-black text-gray-700 ml-1">
                                <CheckIcon className="text-[#488ad8]" />
                                새 비밀번호 확인
                            </label>
                            <input
                                type="password"
                                value={pwdData.confirmPassword}
                                onChange={(e) => setPwdData({...pwdData, confirmPassword: e.target.value})}
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#488ad8] transition-all outline-none font-bold text-gray-600"
                                placeholder="비밀번호를 한번 더 입력하세요"
                            />
                        </div>

                        <div className="pt-4 border-t border-dashed border-gray-100">
                            <ul className="text-[14px] text-[#488ad8] font-bold space-y-1">
                                <li>• 영문, 숫자, 특수문자를 포함하여 8자 이상 권장합니다.</li>
                                <li>• 타 사이트와 중복되지 않는 안전한 비밀번호를 사용하세요.</li>
                            </ul>
                        </div>
                    </div>

                    {/* 하단 버튼 영역 */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 py-4 bg-white text-gray-500 rounded-2xl font-black border border-gray-100 hover:bg-gray-50 transition-all"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] py-4 bg-[#488ad8] text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-[#3a72b5] transition-all flex items-center justify-center gap-2 disabled:bg-gray-300"
                        >
                            {isSubmitting ? (
                                <UpdateIcon className="w-5 h-5 animate-spin" />
                            ) : (
                                '비밀번호 변경하기'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}