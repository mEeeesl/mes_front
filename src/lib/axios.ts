import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// 환경 변수에서 URL을 가져옵니다. 
// Vercel(운영)에서는 설정한 값이, 로컬(.env.local)에서는 로컬 주소가 들어옵니다.
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    //baseURL: 'http://localhost/api', // next.config.ts의 rewrites를 통해 http://localhost/api 호출
    baseURL: baseURL,
    withCredentials: true/*, // 모든 요청에 쿠키 포함 설정
    headers: {
        'Content-Type': 'application/json',
    },
    */
});

// 요청 인터셉터 (로깅, 로딩바, Api 응답 Alias, 등등 추가)
api.interceptors.request.use(
    (config) => {
        
        // 모든 요청에 자동으로 캐시 방지를 위한 타임스탬프 추가
        config.params = {
            ...config.params,
            _t: Date.now(),
        };

        /* AS-IS
        if (config.method === 'get') {
            config.params = { ...config.params, _t: Date.now() };
        }
        */
        return config;
    }
);

api.interceptors.response.use(
    (response) => {
        /* Api 리턴받을때 alias */
        return response.data; // 데이터 포맷팅
    },
    async (error) => {
        
        const originalRequest = error.config;
        console.log(" api err.. ");
        console.log(originalRequest);


        console.log("chk");
        console.log(originalRequest._retry);
        console.log(originalRequest.url.includes('/auth/reissue'))
        // 루프방지
        // 이미 재시도 중인 요청이거나
        // 토큰 재발급이 실패한 거면 루프 종료
        // 1. 루프 방지 및 reissue 실패 시 처리
        if(originalRequest._retry || originalRequest.url.includes('/auth/reissue')){
            console.log("axios res interceptor... 루프방지..");
            
            return Promise.reject(error);
        }

        console.log("chk");
        console.log(error.response);

        // 토큰 만료 시 처리
        // 에러 상태가 401(Unauthorized) && 아직 재시도를 하지 않은 경우
        // 2. 토큰 만료 시 처리 (401)
        if(error.response?.status === 401 && !originalRequest._retry){
            
            

            originalRequest._retry = true; // 무한 루프 방지

            try { 
                // 서버로 토큰 재발급 요청
                console.log('--- AccessToken 만료: 재발급 시도 ---');

                // api 인스턴스말고 axios 기본 인스턴스를 사용해야 인터셉터 중복 호출을 피함 
                // 401이 다시 나도 인터셉터가 중복실행되지 않음
                // baseURL이 설정된 api 인스턴스가 아닌, 전체 경로 작성이 안전..
                await axios.post('/api/auth/reissue', {}, {withCredentials:true});

                // 재발급 성공 시 원래 요청 다시
                // 재발급 성공 후 originalRequest의 헤더 등을 최신화할 필요가 있다면 여기서 수정
                // (쿠키 방식이면 브라우저가 알아서 새 쿠키를 보낼 것이므로 그대로 리턴해도 됨)
                return api(originalRequest);
            
            
            } catch(reissueError){

                // Refresh Token까지 만료되었거나, 재발급 실패한 경우 -> 로그아웃 처리
                console.log("axiox.ts /// Refresh Token까지 만료... 로그아웃처리... ");
                console.log("세션 완전히 종료됨 -- Refresh 만료 or DB 불일치");
                
                useAuthStore.getState().logout(); // Zustand 상태 초기화

                if(typeof window !== 'undefined'){
                    console.log("axiox.ts /// 토큰 자동 재발급 에러 시 ... typeof window !== 'undefined' 문 안에 /login 이동 처리를 넣을지말지..");


                    // [핵심 수정 부분]
                    // 로그인, 회원가입이나 회원가입 콜백 페이지 등 에서는 로그인이 안 되어 있는 게 당연하므로 튕구면 안 됩니다.
                    const publicPaths = ['/login', '/signup', '/signup/callback'];
                    const isPublicPath = publicPaths.some(path => window.location.pathname.includes(path));

                    if (!isPublicPath) {
                        console.log("인증이 필요한 페이지이므로 로그인으로 이동");
                        window.location.href = '/login?expired=true';
                    } else {
                        console.log("공개 페이지(회원가입 등)이므로 리다이렉트 차단");
                    }

                    // 사용자 경험을 위해 리다이렉트는 여기서 처리하는 것이 좋습니다.
                    // 단, 현재 페이지가 이미 login 페이지라면 이동하지 않도록 방어 로직 추가
                    //if (!window.location.pathname.includes('/login')) {
                        //window.location.href = '/login?expired=true';
                    //}
                }
                //window.location.href='/login';
                return Promise.reject(reissueError)
            }
        }
        
        
        return Promise.reject(error)
    }
)
export default api;