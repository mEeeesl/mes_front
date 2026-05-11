'use client';

import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth/authService';

export const useApply = () => {
    const chkPersonalIdMutation = useMutation({
    mutationFn: (data:any) => authService.checkPersonalId(data),
    onSuccess: (exists) => {
      if (exists) {
        // 이미 존재하는 유저일 때의 처리 로직
        
      } else {
        // 신규 유저일 때의 처리 로직 (회원가입 모달 오픈 등)

      }
      
    },
    onError: (error) => {
      console.error("사용자 확인 중 오류 발생:", error);
    }
  });

  return {
    chkPersonalId: chkPersonalIdMutation.mutate,
    isCheckkingId: chkPersonalIdMutation.isPending,
  }
};