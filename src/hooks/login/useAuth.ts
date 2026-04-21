import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth/authService';
import { useAuthStore } from '@/stores/authStore';
import { useModalStore } from '@/stores/useModalStore';
import { ApiResponse } from '../../types/common/api'; // [ 백엔드 응답 데이터 공통 규격 ]

/**
 * 서버: 유저 정보 제공.
 * TanStack Query: 서버 데이터를 가져와서 캐싱 (네트워크 효율성).
 * Zustand: 캐싱된 데이터 중 유저 객체만 쏙 뽑아서 전역 상태로 관리 (UI 반응성).
 * 컴포넌트: Zustand에서 user를 꺼내 쓰고, isInitialized가 false면 로딩을 보여주며 대기.
 */

/**
 * 인증 관련 통합 비즈니스 로직 훅
 * TanStack Query의 캐시 관리와 Zustand의 상태 플래그를 결합합니다.
 * 
 * options 객체를 인자로 받습니다. 기본값으로 enabled: true를 줍니다.
 * enabled 상태를 useQuery에 전달할 수 있도록 수정
 */
//export const useAuth = () => {
export const useAuth = (options = { enabled: true }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    //const searchParams = useSearchParams();
    const { setInitialized, setUser } = useAuthStore();
    //const setInitialized = useAuthStore((state) => state.setInitialized);
    //const setUser = useAuthStore((state) => state.setUser);
    const showAlert = useModalStore((state) => state.showAlert);
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
                setUser(data);
                //router.push('/'); 
                
                /* 페이지 전환은 호출한 화면에서 처리
                const prevUri = searchParams.get('redirect');

                // 가려던 경로가 있으면 그곳으로, 없으면 메인('/')으로 이동
                // decodeURIComponent는 브라우저가 알아서 처리해주기도 하지만 명시적으로 처리하면 안전합니다.
                const targetPath = prevUri ? decodeURIComponent(prevUri) : '/';
                
                router.replace(targetPath);
                */
            }
        },
        onError: (error: any) => {

            // Axios 에러나 서비스 레이어에서 던진 Error
            console.log("useAuth.ts 로그인 훅 :: 에러 ::");
            console.log(error);
            //alert(error.response?.data?.message || "로그인에 실패했습니다.");
            showAlert(error.response?.data?.message || "로그인 정보를 확인해주세요.");
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
            setUser(null);
            showAlert('로그아웃 되었습니다.');
            router.replace('/login'); // 리플레이스해서 기존창 찢어버리고 메인 시작(이전 페이지로 뒤로가기 안됨)
        },
        onSettled: () => {
            // 에러 여부와 상관없이 클라이언트 정보는 초기화하는 것이 안전
            queryClient.setQueryData(['profile'], null);
            setUser(null);
            router.replace('/'); // 리플레이스해서 기존창 찢어버리고 메인 시작(이전 페이지로 뒤로가기 안됨)
        }
    });

    /** [3] 프로필 조회 Query (앱 구동 시, 새로고침 시 유저 정보 최신화) */
    const profileQuery = useQuery({
        queryKey: ['profile'],
        //queryFn: authService.getProfile,
        
        queryFn: async () => {
            try {
                console.log('useAuth.ts 훅 :: 프로필 조회 :: ');
                //return await authService.getProfile();

                const data = await authService.getProfile();
                //캐시 데이터가 들어오면 Zustand 스토어와 동기화
                useAuthStore.getState().setUser(data);
                return data;
            } catch (err: any) {

                // 에러 핸들링 : 정보를 못 가져오거나, 서버 에러(401 미인증 등)가 나도 앱이 죽지 않고 null을 반환하게 하여 자연스럽게 비로그인 상태를 유지
                // 401 에러 등이 나면 비로그인 상태이므로 null 반환
                // 세션이 만료되었거나 토큰이 DB에서 지워진 경우 (401, 403 등)
                //console.error("인증 실패 : " + err);
                setUser(null);
                return null; // 미인증 시 자연스럽게 null 반환
            } finally {
                // 렌더링 차단을 막기 위해 초기화 완료 처리
                // [중요] enabled: false일 때는 이 함수 자체가 실행되지 않으므로 
                // 아래 setInitialized는 실제 호출 시점에만 작동합니다
                setInitialized(true);
            }
        },
        
        enabled: options.enabled, // [추가] 외부에서 제어 가능하게 설정
        staleTime: Infinity,
        //staleTime: 1000 * 60 * 5, // 5분 정도는 캐시 인정.. 
        /**
         *  로그아웃 전까지 유저 정보는 계속 유지
            장점: 페이지 이동 시마다 /profile API를 호출하지 않아 매우 빠릅니다.
            단점: 만약 유저가 다른 탭에서 정보를 수정했거나, 서버에서 권한이 바뀌어도 새로고침 전까지는 클라이언트에 반영되지 않습니다.
            해결책: 유저 정보를 수정하는 로직이 있다면, 수정 성공 후 반드시 queryClient.invalidateQueries({ queryKey: ['profile'] })를 호출해서 강제로 최신화해줘야 합니다.
         */
        gcTime: 1000 * 60 * 60, // 1시간 캐싱
        retry: false, // 인증 에러는 재시도해도 실패하므로 false 설정
        //refetchOnWindowFocus: false,
    });

    // 3. 카카오 간편 로그인 뮤테이션
    //const kakaoSimpleLoginMutation = useMutation({
    const kakaoSimpleLoginMutation = useMutation<ApiResponse<any>, Error, string>({  
        mutationFn: (code: string) => authService.socialLogin("kakao", code),
        onSuccess: (res) => {
            sessionStorage.clear();
            
            console.log("### [ socialLogin ] ###");
            console.log(res);
            //if(res){
            if(res && res.cd === '0000') {
                //showAlert(res.msg || "")
                queryClient.setQueryData(['profile'], res.data.user);
                router.push('/');
            } else {
                queryClient.setQueryData(['profile'], null);
                // 회원이 아닌 경우가 있을 수 있음
                showAlert(res?.msg || "가입 도중 오류가 발생했습니다.", () => router.push('/login'));
            }
        },
        onError: (error: any) => {
            queryClient.setQueryData(['profile'], null);
            console.error('KakaoSimpleLogin Err ', error);
            showAlert(error.response?.data?.msg || "서버 통신 중 에러가 발생했습니다.", () => router.push('/login'));
        },
        onSettled: () => {
            
            sessionStorage.removeItem('kakao_auth_code');
        }

        // 원래 여기서 onSuccess/onError를 하지만,
        // 페이지 특화 로직은 호출부에서 해도됨
    });

    return {
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        logout: logoutMutation.mutate,
        user: profileQuery.data,
        isProfileLoading: profileQuery.isLoading,
        //isInitialized, // Zustand 상태를 여기서 함께 리턴해주면 더 편리

        // 간편 로그인_카카오
        simpleLoginKakao: kakaoSimpleLoginMutation.mutate,
        isLoginingKaKao: kakaoSimpleLoginMutation.isPending,
    };
};