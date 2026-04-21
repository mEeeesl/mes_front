'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFindStore, FindType } from '@/stores/auth/find/useFindStore';
import { useFindAccount } from '@/hooks/login/find/useFindAccount';

//type FindType = 'ID' | 'PW';

export default function FindAccountPage() {
    const { activeTab, setActiveTab, resetTab } = useFindStore();
    const { findId, isFindingId, findPw, isFindingPw } = useFindAccount();

    const brandColor = "#488ad8";
    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const userId = formData.get('userId') as string;

    if (activeTab === 'ID') {
      findId({ name, email });
    } else {
      findPw({ name, userId, email });
    }
  };

  const isLoading = isFindingId || isFindingPw;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">계정 찾기</h2>
          <p className="text-gray-500 mt-2 text-sm">정보를 입력하여 본인 인증을 진행해 주세요.</p>
        </div>

        {/* Tab Menu */}
        <div className="flex border-b">
          {(['ID', 'PW'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === tab ? 'border-b-2' : 'text-gray-400'
              }`}
              style={activeTab === tab ? { borderColor: brandColor, color: brandColor } : {}}
            >
              {tab === 'ID' ? '아이디 찾기' : '비밀번호 찾기'}
            </button>
          ))}
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                name="name"
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': brandColor } as any}
                placeholder="가입한 이름을 입력하세요"
              />
            </div>

            {activeTab === 'PW' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
                <input
                  name="userId"
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': brandColor } as any}
                  placeholder="아이디를 입력하세요"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': brandColor } as any}
                placeholder="example@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-lg text-white font-bold shadow-md hover:opacity-90 transition-opacity disabled:bg-gray-300"
              style={{ backgroundColor: brandColor }}
            >
              {isLoading ? '요청 처리 중...' : `${activeTab === 'ID' ? '아이디' : '비밀번호'} 메일 발송`}
            </button>
          </form>

          <div className="mt-8 flex justify-between text-sm">
            <Link href="/login" className="text-gray-400 hover:text-gray-600 transition-colors">로그인으로 돌아가기</Link>
            <Link href="/signup" style={{ color: brandColor }} className="font-bold">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
}