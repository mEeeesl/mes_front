import { useMutation } from '@tanstack/react-query';
import { signupService, SignupPayload } from '@/services/auth/signupService';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/stores/useModalStore';

export const useSignup = () => {
  const router = useRouter();
  const showAlert = useModalStore((state) => state.showAlert);

  // 1. 아이디 중복 체크 뮤테이션
  const checkMutation = useMutation({
    mutationFn: (userId: string) => signupService.checkDuplicateId(userId),

    // 원래 여기서 onSuccess/onError를 하지만,
    // 페이지 특화 로직은 호출부에서 해도됨
  });

  // 2. 회원가입 뮤테이션
  const registerMutation = useMutation({
    mutationFn: (payload: SignupPayload) => signupService.registerUser(payload),
    onSuccess: (res) => {
      console.log("####################");
      console.log(res);
      // 걍 삭제가 맘편함
      sessionStorage.clear();
      if(res.cd === '0000') {
        //sessionStorage.clear();
        showAlert("회원가입이 완료되었습니다.", () => {
          router.push('/login');
        });
      } else {
        showAlert(res.msg || "가입 중 오류가 발생했습니다.");
      }
    },
    onError: (error: any) => {
      console.error('Signup Error: ', error);
      showAlert(error.response?.data?.msg || "서버 통신 중 에러가 발생했습니다.");
    },
  })

  return {
    // 중복체크 관련
    checkId: checkMutation.mutateAsync, // async로 넘겨주면 page에서 await 사용 가능
    isChecking: checkMutation.isPending,

    // 회원가입 관련
    signup: registerMutation.mutate,
    isSigning: registerMutation.isPending,
  };
}


/*
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
*/