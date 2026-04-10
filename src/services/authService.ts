/**
 * [ 로그인 관련 Auth API 서비스 ]
 * 서비스 레이어는 오직 백엔드 서버 통신(Axios)과 응답 데이터 반환만 담당
 */

import api from '@/lib/axios'; // [ 공통 서버 통신 axios ]
import { ApiResponse } from '../types/common/api'; // [ 백엔드 응답 데이터 공통 규격 ]
import { UserMap, LoginRequest, LoginResponse, UserProfile } from '@/types/auth'; // [ 전용 로그인 데이터 규격 ]
import { ApiError } from '../app/util/error';

export const authService = {
    /** 
     * 로그인 요청
     * 리턴 타입: Promist<LoginData> (ApiResponse의 data 부분만 반환)
     * (Hook에서 res.data.data 등 지저분하게 받지 않도록)
     *  */
    login: async (formData: LoginRequest): Promise<UserMap> => {
        console.log('authService >> 로그인 호출');
        // [ 방식 1. 명시적 ] 서버에서 내려주는 데이터 필드명까지 일치 { cd , data } 혹은 { data } 방식
        // const { cd, data } = await api.post<LoginResponse>('/login', formData);
        // cd, data, data.user, data.userId, data.userNm

        // [ 방식 1-1 alias ] = data :res
        //const { cd, msg, data: res } = await api.post<LoginResponse>('/login', formData);
        // cd, msg, res, res.user, res.user.userNm

        // [ 방식 2. 걍 json으로 받는 방식 필드명 일치하지 않아도됨 - 이걸 써도되지만 최대한 안쓰도록하자 ]
        //const res = await api.post<LoginResponse>('/login', formData);
        // res.cd, res.data, res.data.user, res.data.user.userNm
        
        /** 2026.04.09 빌드 에러 조치 */
        // [ 방식 3. as any 타입정의 + Alias ]
        // 1. 먼저 Axios의 전체 응답(Response)을 받습니다.
        const response = await api.post<LoginResponse>('/auth/login', formData) as any;
    
        // 2. response.data = ApiResponse<UserMap> 타입
        // 여기서 code, message, data를 꺼냅니다.
        const { cd, msg, data: res } = response;

        /**
         * [ 서버 응답코드 체크 ]
         * 로그인 실패 시 코드별로 에러 처리
         */
        
        if(cd === "401") { // 아이디 비밀번호 재확인 필요 코드
            console.log("authService >> 401 ");
            throw new ApiError(cd, "authService >> 서버에서 준 메시지 : " + msg);
        } else if(cd !== "0000") { // 기타 사유 실패 코드
            console.log("authService >> !== 0000 ");
            throw new Error(msg || "authService >> 로그인 실패 응답 [ axios 에러 / 서버 에러 ] 등");
        }

        // 로그인 성공 응답 시 유저 반환
        return res.user;
    },

    /** 로그아웃 요청 */
    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
        //await api.post<ApiResponse<null>>('/logout');
    },

    /** 유저 프로필 조회 */
    getProfile: async (): Promise<UserMap> => {
        console.log('authService >> 프로필 조회');

        ////const { cd, msg, data } = await api.get<UserProfile>('/profile');
        //const { data } = await api.get<{ user: UserProfile }>('/profile');

        /** 2026.04.09 빌드 에러 조치 */
        // 1. 먼저 Axios의 전체 응답(Response)을 받습니다.
        const response = await api.get<UserProfile>('/auth/profile');
    
        // 2. response.data = ApiResponse<UserMap> 타입
        // 여기서 code, message, data를 꺼냅니다.
        const { cd, msg, data: res } = response.data;


        /**
         * [ 서버 응답코드 체크 ]
         * 로그인 실패 시 코드별로 에러 처리
         */
        if(cd === "400") { // 아이디 비밀번호 재확인 필요 코드
            throw new Error(msg || "authService >> 아이디 비밀번호 재확인 응답");
        } else if(cd !== "0000") { // 기타 사유 실패 코드
            throw new Error(msg || "authService >> 로그인 실패 응답 [ axios 에러 / 서버 에러 ] 등");
        }

        //return data.user;
        return res.user;
    },

    // 일반 회원가입
    signup: async (userData: any) => {
        //const { data } = await axios.post('/auth/signup', userData);
        //return data;
    },
    // 소셜 로그인 (카카오, 구글 등 공통 처리 가능)
    socialLogin: async (provider: 'kakao' | 'google' | 'naver', code: string) => {
        //const { data } = await axios.post(`/auth/social/${provider}`, { code });
        //return data;
    }
};