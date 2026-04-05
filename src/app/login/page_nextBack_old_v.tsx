/** 바닐라 리액트 Login.jsx */

'use client'; // 클라이언트 컴포넌트로 지정
/*
Next.js App Router는 기본이 서버 컴포넌트. 
'use client'; 클라이언트 컴포넌트로 선언 - useEffect나 useState, Zustand 사용을 위함
*/

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Next.js는 navigation에서 가져옵니다.
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/axios'; // 공통 인터셉터가 포함된 axios 인스턴스


import { useLoginMutation } from '@/hooks/login/useAuthMutation'; // 로그인 훅 임포트


import CustomInput from '../../components/common/CustomInput';

export default function LoginPage() {
    const router = useRouter();
    
    // 1. Zustand에서 필요한 함수 및 상태 추출
    const { user, login, isLoading } = useAuthStore();

    // 2. 폼 상태 관리 (TypeScript 타입 추론)
    const [formData, setFormData] = useState({ userId: '', password: '' });

    // 3. 이미 로그인된 유저가 로그인 후 뒤로가기로 접근 시 홈으로 튕겨내기
    useEffect(() => {
        if (user) {
            router.replace('/');
        }
    }, [user, router]);

    // 4. 입력값 변경 핸들러 (디벨롭: 계산된 속성명 활용)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev, // 이전값
            [name]: value,
        }));
    };

    // TanStack Query Mutation 가져오기
    // mutate: 함수 실행용, isPending: 통신 중인지 확인용(기존 isLoading 대체)
    const { mutate: loginMutate, isPending } = useLoginMutation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 훅에서 가져온 mutate 함수 실행 (비동기 로직 가동!)
        loginMutate(formData);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <div className="login-container" style={{ display: 'inline-block', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div style={{width:'50vw', marginBottom:'3rem'}}>로그인</div>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                    <CustomInput
                            label="아이디"
                            name="userId"
                            placeholder="아이디를 입력하세요"
                            value={formData.userId}
                            onChange={handleChange}
                        />
                        <CustomInput
                            label="비밀번호"
                            name="password"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={formData.password}
                            onChange={handleChange}
                        />

                    <button 
                        type="submit" 
                        disabled={isPending} // 통신 중에는 버튼 비활성화
                        style={{ 
                            padding: '10px', 
                            backgroundColor: isPending ? '#ccc' : '#488ad8', // 로딩 시 회색 처리
                            color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' 
                        }}
                    >
                        {isPending ? '로그인 중...' : '로그인'}
                    </button>
                </form>
            </div>
        </div>
    );




/*

[AS-iS 로그인]

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            console.log("==== LoginPage ==== Login 요청");
            
            // [디벨롭] 1. 전역 api 인스턴스 사용 (baseURL, withCredentials 자동 적용)  백엔드 응답 구조: res.data.data.user
            
            const res = await api.post('/login', formData);
            
            console.log("==== LoginPage ==== Login 성공");
            console.log(res);
            console.log(res.data);
            
            // 데이터 추출 (기존 코드의 구조 반영)
            const userData = res.data.user; 

            if (userData) {
                // Zustand 스토어 업데이트 (isInitialized: true 포함)
                login(userData); 
                
                alert(`${userData.userNm || '사용자'}님, 환영합니다!`);
                router.push('/');
            }
        } catch (err: unknown) {
            let errorMsg = "";
            if (err instanceof Error) {
                console.error("==== LoginPage ==== Login 실패", err.message);
                errorMsg = err.message;
            } 
            // 에러 메시지가 서버에서 온다면 보여주고, 아니면 기본 메시지
            //const errorMsg = err.response?.data?.message || "아이디 또는 비밀번호를 확인해주세요.";
            errorMsg = "아이디 또는 비밀번호를 확인해주세요.";
            alert(errorMsg);
        }
    };


[AS-iS] 로그인    
    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <div className="login-container" style={{ display: 'inline-block', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div style={{width:'50vw', marginTop:'3rem', marginBottom:'3rem'}}>mes</div>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    <div>

                        <CustomInput
                            label="아이디"
                            name="userId"
                            placeholder="아이디를 입력하세요"
                            value={formData.userId}
                            onChange={handleChange}
                        />
                        <CustomInput
                            label="비밀번호"
                            name="password"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={formData.password}
                            onChange={handleChange}
                        />

                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{ 
                            padding: '10px', 
                            backgroundColor: isLoading ? '#ccc' : '#488ad8', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer' 
                        }}
                    >
                        {isLoading ? '인증 중...' : '로그인'}
                    </button>
                </form>
            </div>
        </div>
    );

[as-is] 로그인    */
}