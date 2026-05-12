'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth/authService';
import { scheduleService } from '@/services/schedule/scheduleService';

export const useApply = () => {
  // 신청된 날짜 목록 조회 훅
  const { data: appliedDatesData, isLoading: isLoadingDates } = useQuery({
    queryKey: ['appliedDates'],
    queryFn: () => scheduleService.getAppliedDates(),
  });

  // 최초 신청자 체크 훅
  const chkPersonalIdMutation = useMutation({
    mutationFn: (data:any) => authService.checkPersonalId(data),
  });

  // 근무 신청 처리 훅
  const applyAttendanceMutation = useMutation({
    mutationFn: (data: any) => scheduleService.applyAttendance(data),
  });

  return {
    appliedDates: appliedDatesData?.data || [], // 조회된 날짜 배열
    isLoadingDates,                             // 로딩 상태

    chkPersonalId: chkPersonalIdMutation.mutate,
    isCheckkingId: chkPersonalIdMutation.isPending,

    applyAttendance: applyAttendanceMutation.mutate,
    isApplying: applyAttendanceMutation.isPending,
  }
};