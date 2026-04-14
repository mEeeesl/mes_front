import { useMutation } from '@tanstack/react-query';
import { signupService, SignupPayload } from '@/services/auth/signupService';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/stores/useModalStore';

export const useSignupMutation = () => {
  const router = useRouter();
  const showAlert = useModalStore((state) => state.showAlert);

  return useMutation({
    // mutationFn: 실제 API 호출 함수
    mutationFn: (payload: SignupPayload) => signupService.registerUser(payload),
    
    // 성공 시 로직
    onSuccess: (res) => {
      if (res.cd === '0000') {
        sessionStorage.clear(); // [중요] 가입 완료 후 스토리지 정리
        showAlert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.", () => {
            router.push('/login');
        });
        
      } else {
        // 비즈니스 에러 처리 (ex: 중복 아이디 등)
        showAlert(res.msg || "가입 중 오류가 발생했습니다.");
      }
    },
    
    // 네트워크 에러 등 처리
    onError: (error: any) => {
      console.error('Signup Error:', error);
      showAlert(error.response?.data?.msg || "서버 통신 중 에러가 발생했습니다.");
    },
  });
};