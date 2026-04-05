import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const api = axios.create({
    baseURL: 'http://localhost/api', // next.config.ts의 rewrites를 통해 http://localhost/api 호출
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
        return response.data;
    },
    async (error) => {
        /*
        const originalRequest = error.config;
        console.log(" api err.. ");
        console.log(originalRequest);

        // 토큰 재발급이 실패한 거라면 종료. 루프방지
        if(originalRequest.url.includes('/reissue')){
            return Promise.reject(error);
        }

        // 토큰 만료 시 처리
        // 에러 상태가 401(Unauthorized) && 아직 재시도를 하지 않은 경우
        if(error.response?.status === 401 && !originalRequest._retry){
            
            

            originalRequest._retry = true; // 무한 루프 방지

            try { 
                // 서버로 토큰 재발급 요청
                console.log('재로그인 시도중');
                // api 인스턴스말고 axios 기본 인스턴스를 해야 401이 다시 나도 인터셉터가 중복실행되지 않음
                await axios.post('/api/reissue', {}, {withCredentials:true});

                // 재발급 성공 시 원래 요청 다시
                return api(originalRequest);
            } catch(reissueError){
                // Refresh Token까지 만료된 경우 -> 로그아웃 처리
                console.log("axiox.ts /// Refresh Token까지 만료...");
                useAuthStore.getState().logout();
                if(typeof window !== 'undefined'){
                    console.log("axiox.ts /// 토큰 자동 재발급 에러 시 ... typeof window !== 'undefined' 문 안에 /login 이동 처리를 넣을지말지..");
                }
                //window.location.href='/login';
                return Promise.reject(reissueError)
            }
        }
        
        
        */
        
        return Promise.reject(error)
    }
)
export default api;