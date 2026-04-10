import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';

/**
 * 인증 관련 통합 비즈니스 로직 훅
 * TanStack Query의 캐시 관리와 Zustand의 상태 플래그를 결합합니다.
 */
export const useAuth = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const setInitialized = useAuthStore((state) => state.setInitialized);

    /**
     * 서버 데이터 변경(CUD) 시 useMutation을 사용
     */

    /** [1] 로그인 Mutation */
    const loginMutation = useMutation({
        mutationFn: authService.login, // 서비스의 login 함수 호출
        onSuccess: (data) => {
        
            console.log("useAuth 로그인 훅 :: 성공 :: 응답 데이터 ");
            console.log(data);
            if (data) {
                // [중요] 'profile' 키의 캐시를 즉시 유저 데이터로 채웁니다.
                // 캐시에 즉시 유저 정보 주입 (Header 등 UI 동기화)
                queryClient.setQueryData(['profile'], data);
                
                /**
                 * router.push
                 * 기존 페이지 위에 한 페이지 얹는거라서
                 * 뒤로가기하면 전 페이지인 로그인 페이지로 이동될듯
                 * 
                 * router.replace
                 * 페이지 다 찢어버리고 새로시작
                 * 뒤로가기해도 찢어버려서 뒤로못감
                 */
                
                router.push('/'); 
            }
        },
        onError: (error: any) => {

            // Axios 에러나 서비스 레이어에서 던진 Error
            console.log("useAuth.ts 로그인 훅 :: 에러 ::");
            console.log(error);
            alert(error.response?.data?.message || "로그인에 실패했습니다.");
        }
    });

    /** [2] 로그아웃 Mutation */
    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            // [중요] 로그아웃 성공 시 'profile' 캐시를 비웁니다(null).
            // 캐시가 비워지는 순간 Header의 user 정보도 자동으로 사라집니다.
            queryClient.setQueryData(['profile'], null);
            // queryClient.clear(); // TanStack Query 캐시 전체 삭제(메모리 비우기)

            alert('로그아웃 되었습니다.');
            router.replace('/login'); // 리플레이스해서 기존창 찢어버리고 메인 시작(이전 페이지로 뒤로가기 안됨)
        },
        onSettled: () => {
            // 에러 여부와 상관없이 클라이언트 정보는 초기화하는 것이 안전
            queryClient.setQueryData(['profile'], null);
            router.replace('/'); // 리플레이스해서 기존창 찢어버리고 메인 시작(이전 페이지로 뒤로가기 안됨)
        }
    });

    /** [3] 프로필 조회 Query (앱 구동 시, 새로고침 시 유저 정보 최신화) */
    const profileQuery = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            try {
                console.log('useAuth.ts 훅 :: 프로필 조회 :: ');
                return await authService.getProfile();
            } catch (err) {

                // 에러 핸들링 : 정보를 못 가져오거나, 서버 에러(401 미인증 등)가 나도 앱이 죽지 않고 null을 반환하게 하여 자연스럽게 비로그인 상태를 유지
                // 401 에러 등이 나면 비로그인 상태이므로 null 반환
                return null; // 미인증 시 자연스럽게 null 반환
            } finally {
                setInitialized(true); // 초기화 완료 플래그 update
            }
        },
        staleTime: Infinity, // 로그아웃 전까지 유저 정보는 계속 유지
        gcTime: 1000 * 60 * 60, // 1시간 캐싱
    });

    return {
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        logout: logoutMutation.mutate,
        user: profileQuery.data,
        isProfileLoading: profileQuery.isLoading,
    };
};