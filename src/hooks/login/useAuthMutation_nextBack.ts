// src/hooks/useAuthMutation.ts
////////////////import { useMutation } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';



// useQueryClient -> Zustand처럼 수동으로 상태관리하는게 아닌, TanStack Query 메모리(캐시) 에 직접 데이터를 넣거나 뺄 수 있음
// setInitialized만 Zustand로 관리, Zustand는 오직 "인증 체크가 끝났나?"라는 플래그(Flag) 역할만 수행합니다.
// 유저 데이터는 Query가 관리하고, 

/**
 * 1. 로그인 Mutation
 * 로그인 시도 및 성공 시 캐시 업데이트를 담당
 */
export const useLoginMutation = () => {
    const queryClient = useQueryClient(); 
    const router = useRouter();
    

    return useMutation({
        mutationFn: async (formData: any) => {
            const res = await api.post('/login', formData);
            return res.data; // 서버 응답: { user: { userNm: '강영민', ... } }
        },
        onSuccess: (data) => {
            if (data.user) {
                // [중요] 'profile' 키의 캐시를 즉시 유저 데이터로 채웁니다.
                // 이렇게 하면 Header 등에서 useProfileQuery를 쓸 때 즉시 유저명이 보입니다.
                queryClient.setQueryData(['profile'], data.user);
                router.push('/');
            }
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "로그인에 실패했습니다.");
        }
    });
};

/**
 * 2. 로그아웃 Mutation
 * 서버 로그아웃 호출 및 클라이언트 캐시를 비웁니다.
 */
export const useLogoutMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    
    return useMutation({
        mutationFn: async () => {
            return await api.post('/logout');
        },
        onSuccess: () => {
            // [중요] 로그아웃 성공 시 'profile' 캐시를 비웁니다(null).
            // 캐시가 비워지는 순간 Header의 user 정보도 자동으로 사라집니다.
            queryClient.setQueryData(['profile'], null);
            // queryClient.clear(); // TanStack Query 캐시 전체 삭제(메모리 비우기)
            alert('로그아웃 되었습니다.');

            router.push('/login');
        },
        onError: (err) => {
            console.error("로그아웃 실패:", err);
            // 에러가 나더라도 클라이언트 정보는 비우는 것이 안전합니다.
            
            queryClient.setQueryData(['profile'], null);
            // queryClient.clear(); // TanStack Query 캐시 전체 삭제(메모리 비우기)
            
            router.push('/login');
        }
    });
};


// 에러 핸들링: useProfileQuery에서 서버 에러(401 미인증 등)가 나도 앱이 죽지 않고 null을 반환하게 하여 자연스럽게 비로그인 상태를 유지

/**
 * 3. 프로필 조회 Query
 * 앱 실행 시 혹은 새로고침 시 유저 정보를 가져옵니다.
 */
export const useProfileQuery = () => {
    const setInitialized = useAuthStore((state) => state.setInitialized);

    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            try {
                const res = await api.get('/profile');
                return res.data.user; // 유저 객체 반환
            } catch (err) {
                // 401 에러 등이 나면 비로그인 상태이므로 null 반환
                return null;
            } finally {
                // 성공하든 실패하든 앱 초기화(인증체크)는 완료됨
                setInitialized(true);
            }
        },
        staleTime: Infinity, // 로그아웃 전까지 유저 정보는 '신선함' 유지
        gcTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
    });
};











/*
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios'; // axios 인스턴스
import { useAuthStore } from '@/stores/authStore'; // Zustand 스토어

// TanStack Query유저정보 관리
// 해당 훅이 유저 정보의 유일한 통로로 관리

export const useProfileQuery = () => {
    const setInitialized = useAuthStore((state) => state.setInitialized);

    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
        try {
            const res = await api.get('/profile');
            return res.data.user; // { userNm: '강영민' } 반환
        } catch (err) {
            return null; // 비로그인 시 null 반환
        } finally {
            setInitialized(true); // 성공하든 실패하든 "체크는 끝났다"
        }
        },
        staleTime: Infinity, // 유저 정보는 로그아웃 전까지 변하지 않으므로 무한대 설정
        gcTime: 1000 * 60 * 60, // 가비지 컬렉션 타임
    });
};

*/
























/* 유저정보를 TanStack Query에서 담당하도록 변경 함.. AS-IS 주석
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios'; // 기존에 만드신 axios 인스턴스
import { useAuthStore } from '@/stores/authStore'; // Zustand 스토어
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'; // useEffect









 * 로그인 로직을 담당하는 커스텀 훅
 * useMutation: 데이터를 생성/수정/삭제(CUD)할 때 주로 사용합니다.

export const useLoginMutation = () => {
    //////////const login = useAuthStore((state) => state.login); // Zustand의 로그인 함수
    const setAuth = useAuthStore((state) => state.setAuth);
    const router = useRouter();

    return useMutation({
        // 1. 실제 비동기 함수 (axios 호출)
        mutationFn: async (formData: any) => {
            // api.post('/login', { userId, password }) 실행
            const res = await api.post('/login', formData);
            return res.data; // 서버 응답 데이터 반환
        },

        // 2. 요청 성공 시 실행되는 콜백
        onSuccess: (data) => {
            // data: 위 mutationFn이 리턴한 res.data 값
            const userData = data.user; 

            if (userData) {
                // Zustand 스토어에 유저 정보 저장 (isInitialized: true 됨)
                //login(userData); 
                setAuth(data.user);
                
                alert(`${userData.userNm || '사용자'}님, 환영합니다!`);
                
                // 메인 페이지로 이동
                router.push('/');
            }
        },

        // 3. 요청 실패 시 실행되는 콜백
        onError: (error: any) => {
            console.error("로그인 에러 상세:", error);
            
            // 서버에서 내려주는 에러 메시지가 있다면 사용, 없다면 기본 메시지
            const message = error.response?.data?.message || "아이디 또는 비밀번호가 일치하지 않습니다.";
            alert(message);
        },
    });
};














// 2. 로그아웃 훅
export const useLogoutMutation = () => {
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            return await api.post('/logout');
        },
        onSuccess: () => {
            clearAuth(); // 스토어 비우기
            alert('로그아웃 되었습니다.');
            router.push('/');
        },
        onError: (err) => {
            console.error("로그아웃 실패:", err);
            clearAuth(); // 에러가 나더라도 클라이언트는 로그아웃 처리
        }
    });
};

// 3. 프로필 체크 훅 (새로고침 시 호출용)
export const useProfileQuery = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const query = useQuery({
        queryKey: ['profile'], // 쿼리 고유 키
        queryFn: async () => {
            const res = await api.get('/profile');
            return res.data;
        },
        // 컴포넌트 마운트 시 한 번만 실행되도록 설정
        retry: 0, 
        staleTime: Infinity, // 유저 정보는 로그아웃 전까지 변하지 않으므로 무한대 설정
    });

    // v5에서는 onSuccess 대신 useEffect를 사용하여 Zustand와 동기화합니다.
    useEffect(() => {
        if (query.isSuccess && query.data?.user) {
            setAuth(query.data.user);
        } else if (query.isError) {
            clearAuth();
        }
    }, [query.isSuccess, query.data, query.isError, setAuth, clearAuth]);

    return query;
};

*/