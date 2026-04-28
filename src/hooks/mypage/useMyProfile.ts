import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { mypageService } from '@/services/mypage/mypageService';
import { useAuthStore } from '@/stores/authStore';
import { useModalStore } from '@/stores/useModalStore';
import { ApiResponse } from '../../types/common/api'; // [ 백엔드 응답 데이터 공통 규격 ]

export const useMyProfile = () => {

    const detailProfileQuery = useQuery({
       queryKey: ['mypage-detail'],
       queryFn: async () => {
            const data = await mypageService.getDetailProfile();
            console.log("-------------");
            console.log(data);
            return data.user;
       },
       enabled: true,
       staleTime: 1000 * 60 * 1, // 캐싱 1분
       retry: false,
    });


    return {
        detail: detailProfileQuery.data,
        
        isDetailLoading: detailProfileQuery.isPending,

        detailError: detailProfileQuery.isError,

    }
};