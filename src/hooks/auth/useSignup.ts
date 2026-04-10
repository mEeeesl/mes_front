import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

export const useSignup = () => {
    const router = useRouter();

    const signupMutation = useMutation({
        mutationFn: authService.signup,
        onSuccess: () => {
            alert("회원가입이 완료되었습니다! 로그인해주세요.");
            router.push('/login');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "회원가입 실패");
        }
    });

    return {
        signup: signupMutation.mutate,
        isLoading: signupMutation.isPending
    };
};