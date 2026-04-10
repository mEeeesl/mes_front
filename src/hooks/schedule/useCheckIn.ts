'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkInService } from '@/services/schedule/checkInService';

const COMPANY = { 
    // 일원역
    lat: 37.4836, // 위도 (Latitude): 37.4836
    lng: 127.0844 // 경도 (Longitude): 127.0844
};

export const useCheckIn = () => {
    const queryClient = useQueryClient();
    
    const [distance, setDistance] = useState<number | null>(null); // 거리 상태 추가
    

    /** 거리 계산 로직 (순수 함수) */
    const calculateDistance = (lat1: number, lon1: number) => {
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const R = 6371000;
        const dLat = toRad(COMPANY.lat - lat1);
        const dLon = toRad(COMPANY.lng - lon1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(COMPANY.lat)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    /** [핵심] 출근 Mutation */
    const checkInMutation = useMutation({
        mutationFn: checkInService.postCheckIn,
        onSuccess: (res) => {
            // 출근 성공 시 관련 데이터(예: 오늘의 일정, 출근 기록 등) 캐시를 무효화하여 새로고침
            if(res.data.info.success){
                alert("출근 처리가 완료되었습니다.");
            } else {
                alert("회사 주변으로 이동해주세요.")
            }

            // invalidateQueries :: 서버의 데이터가 변했으니, 브라우저가 들고 있는 옛날 데이터를 버리고 새로 받아와라
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "출근 처리 중 에러가 발생했습니다.");
        }
    });

    /** 위치 확인 후 실행할 함수 */
    const handleCheckIn = () => {
        if (!navigator.geolocation) return alert("위치 권한이 필요합니다.");

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude, accuracy } = pos.coords;
                const distance = calculateDistance(latitude, longitude);

                // 계산된 거리를 상태에 저장 (소수점은 컴포넌트에서 처리하거나 여기서 처리)
                setDistance(distance);

                if (distance <= 300) {
                    // Mutation 실행!
                    checkInMutation.mutate({ lat: latitude, lng: longitude, accuracy });
                } else {
                    //alert(`회사 주변으로 이동해주세요. (현재 거리: ${Math.round(distance)}m)`);
                    alert(`회사 주변으로 이동해주세요. (현재 거리: ${distance}m`);
                }
            },
            () => alert("위치 정보를 가져올 수 없습니다."),
            { enableHighAccuracy: true }
        );
    };

    return {
        handleCheckIn,
        distance, // 컴포넌트에서 쓸 수 있게 내보내기
        isPending: checkInMutation.isPending, // TanStack Query v5 기준 isPending
        isSuccess: checkInMutation.isSuccess
    };
};