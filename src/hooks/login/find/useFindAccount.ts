import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth/authService';
import { useModalStore } from '@/stores/useModalStore';
import { ApiResponse } from '@/types/common/api'; // [ 백엔드 응답 데이터 공통 규격 ]

// props로 성공 시 실행할 함수(onSuccess)를 받음
//export const useFindAccount = () => {
export const useFindAccount = (onSuccessCallback?: () => void) => {

  const { showAlert } = useModalStore(); // 예시: 전역 알럿/모달 사용

  // 1. 아이디 찾기 뮤테이션
  //const findIdMutation = useMutation<ApiResponse<null>, Error, { name: string; email: string }>({
  const verifyMutation = useMutation<ApiResponse<any>, Error, { activeTab:string, name: string; email: string, authCode: string }>({
    mutationFn: authService.chkAuthCode,
    onSuccess: (res) => {
      if (res.cd === '0000') {
        showAlert(res.msg || "인증번호가 이메일로 발송되었습니다.");
        if (onSuccessCallback) onSuccessCallback();
      } else {
        showAlert(res.msg || "일치하는 회원 정보가 없습니다.");
      }
    },
    onError: (err: any) => {
      showAlert(err.response?.data?.msg || "통신 중 오류가 발생했습니다.");
    }
  });

  // 1. 아이디 찾기 뮤테이션
  //const findIdMutation = useMutation<ApiResponse<null>, Error, { name: string; email: string }>({
  const findIdMutation = useMutation<ApiResponse<any>, Error, { activeTab: string, name: string; email: string, authCode: string }>({
    mutationFn: authService.findId,
    onSuccess: (res) => {
      if (res.cd === '0000') {
        showAlert(res.msg || "아이디 정보가 이메일로 발송되었습니다.");
        if (onSuccessCallback) onSuccessCallback();
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
    verifyAuthCode: verifyMutation.mutate,
    isVerifing: verifyMutation.isPending,
    findId: findIdMutation.mutate,
    isFindingId: findIdMutation.isPending,
    findPw: findPwMutation.mutate,
    isFindingPw: findPwMutation.isPending,
  };
};