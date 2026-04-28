'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMyProfile } from '@/hooks/mypage/useMyProfile';
import { useModalStore } from '@/stores/useModalStore';
import PasswordConfirm from '../_components/PasswordConfirm'; // 방금 만든 컴포넌트
import { 
    EnvelopeClosedIcon, 
    MobileIcon, 
    ChevronLeftIcon,
    CheckIcon 
} from '@radix-ui/react-icons';

export default function EditProfilePage() {
    const router = useRouter();
    const { detail } = useMyProfile();
    const showAlert = useModalStore((state) => state.showAlert);

    // [상태 관리] 1. 비밀번호 인증 여부 2. 수정할 데이터
    const [isVerified, setIsVerified] = useState(false);
    const [formData, setFormData] = useState({
        email: detail?.email || '',
        phoneNum: detail?.phoneNum || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 수정 처리 함수
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // TODO: mypageService.updateProfile(formData) 호출 로직
            console.log("수정 요청 데이터:", formData);
            
            showAlert('개인정보가 성공적으로 수정되었습니다.', () => {
                router.replace('/mypage'); // 수정 후 마이페이지 메인으로
            });
        } catch (error) {
            showAlert('수정 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // [Step 1] 아직 비밀번호 인증 전이라면 인증 화면 표시
    if (!isVerified) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                {/* 뒤로가기 버튼 */}
                <div className="max-w-md mx-auto mb-4">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-1 text-gray-400 hover:text-gray-600 font-bold transition-colors"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                        마이페이지로 돌아가기
                    </button>
                </div>
                <PasswordConfirm 
                    title="개인정보 수정" 
                    onConfirm={() => setIsVerified(true)} 
                />
            </div>
        );
    }

    // [Step 2] 인증 완료 후 실제 수정 폼 표시
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-xl mx-auto">
                <h2 className="text-3xl font-black text-gray-800 mb-8 tracking-tighter">개인정보 수정</h2>
                
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-8">
                        
                        {/* 이메일 수정 (기본값 표시) */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-black text-gray-700 ml-1">
                                <EnvelopeClosedIcon className="text-[#488ad8]" />
                                이메일 주소
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#488ad8] transition-all outline-none font-bold text-gray-600"
                                placeholder="example@global.com"
                            />
                        </div>

                        {/* 전화번호 수정 */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-black text-gray-700 ml-1">
                                <MobileIcon className="text-[#488ad8]" />
                                전화번호
                            </label>
                            <input
                                type="text"
                                value={formData.phoneNum}
                                onChange={(e) => setFormData({...formData, phoneNum: e.target.value})}
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#488ad8] transition-all outline-none font-bold text-gray-600"
                                placeholder="010-0000-0000"
                            />
                        </div>

                        {/* 수정 불가 항목 (안내용) */}
                        <div className="pt-4 border-t border-dashed border-gray-100">
                            <p className="text-[14px] text-[#488ad8] font-bold leading-relaxed">
                                ※ 이름, 아이디, 사번 등 기본정보는 수정이 불가합니다.
                                정보 변경이 필요한 경우 인사팀으로 문의해 주세요.
                            </p>
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
                            {isSubmitting ? '저장 중...' : (
                                <>
                                    <CheckIcon className="w-5 h-5" />
                                    수정 완료
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}