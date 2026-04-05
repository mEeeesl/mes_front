'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/login/useAuth'; // 리팩토링된 훅
import CustomInput from '@/components/common/CustomInput';

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoggingIn, user } = useAuth(); // 로직 집약적 추출
    const [formData, setFormData] = useState({ userId: '', password: '' });

    // 로그인 상태라면 접근 차단
    //이미 로그인된 유저가 로그인 후 뒤로가기로 접근 시 홈으로 튕겨내기
    useEffect(() => {
        if (user) router.replace('/');
    }, [user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ 
            ...prev, // 이전 값
            [name]: value 
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(formData); // 깔끔한 호출
    };

    return (
        <div style={containerStyle}>
        <div className="login-box" style={boxStyle}>
            <h2 style={{ marginBottom: '2rem' }}>로그인</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
            <CustomInput
                label="아이디"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
            />
            <CustomInput
                label="비밀번호"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
            />
            <button 
                type="submit" 
                disabled={isLoggingIn}
                style={{ 
                ...buttonStyle, 
                backgroundColor: isLoggingIn ? 'ccc' : '#488ad8' 
                }}
            >
                {isLoggingIn ? '로그인 중...' : '로그인'}
            </button>
            </form>
        </div>
        </div>
    );
}

// 스타일 생략 (가독성을 위해 분리 권장)
const containerStyle: React.CSSProperties = { textAlign: 'center', marginTop: '100px' };
const boxStyle: React.CSSProperties = { display: 'inline-block', padding: '20px', border: '1px solid #ddd', borderRadius: '8px'/*, width: '400px'*/ };
const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '15px' };
const buttonStyle: React.CSSProperties = { padding: '12px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };