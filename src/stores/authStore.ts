/** Zustand 설정 */
import { create } from 'zustand';
/*
유저 정보(User) 자체는 TanStack Query의 캐시에서 꺼내쓰도록 처리
Zustand는 "서버에서 데이터를 가져왔는지(초기화)" 여부만 관리하도록 처리
*/
interface AuthState {
    isInitialized: boolean;
    setInitialized: (val: boolean) => void;

    /** 2026.04.09 빌드 에러 조치 */
    // [추가] 로그아웃 액션 정의
    logout: () => void; 
}

export const useAuthStore = create<AuthState>((set) => ({
    isInitialized: false, // 앱 실행 시 최초 1회 인증 체크 완료 여부
    setInitialized: (val) => set({ isInitialized: val }),

    /** 2026.04.09 빌드 에러 조치 */
    // [추가] 로그아웃 시 상태 초기화
    logout: () => set({ isInitialized: false }), 
}));


















/* 유저 정보는 TanStack Query에서 캐싱하도록 처리.. Zustand는 유저 관리안하도록함. 
interface User {
    userNm: string; // 필드명을 백엔드 응답에 맞춰 userNm으로 통일
}

interface AuthState {
    user: User | null;
    isInitialized: boolean;
    // 액션 함수들
    setAuth: (user: User | null) => void; // 로그인/프로필 성공 시 유저 세팅
    clearAuth: () => void;              // 로그아웃 시 초기화
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isInitialized: false,

    // 유저 상태 업데이트 (성공 시 호출)
    setAuth: (userData) => set({
        user: userData,
        isInitialized: true,
    }),

    // 모든 상태 초기화 (로그아웃 혹은 인증 실패 시 호출)
    clearAuth: () => set({
        user: null,
        isInitialized: true,
    }),
}));
*/



































/* [as-is] 소스


import { create } from 'zustand';
import api from '@/lib/axios'; // axios 인스턴스

// 유저 정보 타입 정의 (Java의 UserEntity와 매칭)
interface User {
    userName: string;
    //role: string;
    //id: string;
}

// 2. 스토어 전체의 '타입' 정의
// 2. 스토어 상태 및 함수 타입 정의
interface AuthState {
    user: User | null;
    isInitialized: boolean;
    /////////////////isLoading: boolean;

    // 액션 함수들
    login: (user: User) => void;
    getProfileApi: () => Promise<void>;
    logout: () => Promise<void>;
}

// 3. 실제 스토어 구현
export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isInitialized: false,
    isLoading: false,

    // 로그인 성공 시 호출(유저 정보 수동 세팅)
    login: (userData) => set({
        user: userData, 
        isInitialized: true, // (기본값:false) 서버 응답 기다림.. 앱 실행 시 최초 인증 체크 여부 - 초기화 여부 
        isLoading: false  // (기본값: false) - true면 로딩중
    }),

    // 새로고침 시 서버에서 유저 정보 가져오기
    // 새로고침 시 인증 체크
    getProfileApi: async () => {
        // 이미 초기화되었고 유저 정보가 있다면 중복 호출 방지 (선택 사항)
        if(get().isInitialized) return;

        set({ isLoading: true });

        try {
            console.log("getProfileApi 실행...");
            const res = await api.get('/profile');
        
            // 서버 응답: { user: { name: '강영민' } } 구조라고 가정
            // 서버 응답 데이터 구조 확인 필요
            


            console.log("getProfileApi 응답");
            const userData = res.data?.user 
            // 추후 if문 안에 userData && userData.userName 이게 나을지도
            if (res.data && res.data.user) {
                set({ user: res.data.user, isInitialized: true });
            } else {
                set({ user: null, isInitialized: true });
            }
        } catch (err) {
            console.error("인증 체크 실패:", err);
            console.warn("비로그인 사용자 또는 인증 만료");
            set({ user: null, isInitialized: true });

        } finally {
            set({ isLoading: false });
        }
    },
    
    // 로그아웃 시 초기화
    logout: async () => {
        try {
            await api.post('/logout'); // 서버 DB 토큰 삭제
        } catch (err) {
            console.error("로그아웃 실패:", err);
            set({ user: null, isInitialized: true }); 
        } finally {
            set({ user: null, isLoading: false }); // 스토어 비우기
        }
    },
}));

[as-is] 소스 */