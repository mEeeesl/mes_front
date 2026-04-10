// 회원가입 페이지"use client";

import React from 'react';

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white rounded-[2rem] shadow-lg">
                <h2 className="text-3xl font-black text-gray-800 mb-6 tracking-tighter">회원가입</h2>
                <p className="text-gray-500 mb-8">우리 서비스의 새로운 멤버가 되어보세요.</p>
                
                {/* 여기에 회원가입 폼을 만들 예정입니다 */}
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium">
                        회원가입 폼이 들어올 자리입니다.
                    </div>
                </div>
            </div>
        </div>
    );
}