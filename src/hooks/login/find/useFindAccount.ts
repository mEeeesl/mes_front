import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth/authService';
import { useModalStore } from '@/stores/useModalStore';
import { ApiResponse } from '@/types/common/api'; // [ 백엔드 응답 데이터 공통 규격 ]

export const useFindAccount = () => {
  const { showAlert } = useModalStore(); // 예시: 전역 알럿/모달 사용

  // 1. 아이디 찾기 뮤테이션
  //const findIdMutation = useMutation<ApiResponse<null>, Error, { name: string; email: string }>({
  const findIdMutation = useMutation<ApiResponse<any>, Error, { name: string; email: string }>({
    mutationFn: authService.findId,
    onSuccess: (res) => {
      if (res.cd === '0000') {
        showAlert(res.msg || "아이디 정보가 이메일로 발송되었습니다.");
      } else {
        showAlert(res.msg || "일치하는 회원 정보가 없습니다.");
      }
    },
    onError: (err: any) => {
      showAlert(err.response?.data?.msg || "통신 중 오류가 발생했습니다.");
    }
  });

  // 2. 비밀번호 찾기(재설정 메일) 뮤테이션
  //const findPwMutation = useMutation<ApiResponse<null>, Error, { name: string; userId: string; email: string }>({
  const findPwMutation = useMutation({
    mutationFn: authService.findPw,
    onSuccess: (res) => {
      if (res.cd === '0000') {
        showAlert(res.msg || "비밀번호 재설정 메일이 발송되었습니다.");
      } else {
        showAlert(res.msg || "정보가 일치하지 않습니다.");
      }
    },
    onError: (err: any) => {
      showAlert(err.response?.data?.msg || "통신 중 오류가 발생했습니다.");
    }
  });

  return {
    findId: findIdMutation.mutate,
    isFindingId: findIdMutation.isPending,
    findPw: findPwMutation.mutate,
    isFindingPw: findPwMutation.isPending,
  };
};