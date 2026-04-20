/** Next.js - middleware.ts - 서버 사이드 동작 */
/** 로그인 베이스 페이지설정 (접근 권한 설정) */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    
    const token = request.cookies.get('accessToken')?.value; // 쿠키에서 인증 토큰 여부 확인 
    const { pathname, search } = request.nextUrl; // 현재 Path + 리다이렉트용 prevUri
    
    // 2. 로그인이 필요한 경로 정의
    const authRequiredPaths = [
        '/mypage',
        '/dashboardaaaaaa',
        '/settingsaaaaaa',
        '/adminaaaaaaaa'
    ];
    //const isAuthPage = pathname.startsWith('/mypage');
    const isAuthPage = authRequiredPaths.some(path => pathname.startsWith(path));
    const isLoginPage = pathname.startsWith('/login');
    
    console.log(`[Middleware] 경로: ${pathname} | 보호대상: ${isAuthPage} | 토큰유무: ${!!token}`);
    
    // 3. 권한 체크 로직
    // 로그인이 안 됐는데 마이페이지 가려고 하면 -> 로그인으로 보내기
    // 보호된 페이지인데 토큰이 없다? 로그인으로 보내기
    if (isAuthPage && !token) {
        
        // prevUri(쿼리스트링-search)를 로그인 페이지 같이 보냄
        const prevUri = encodeURIComponent(`${pathname}${search}`);
        const loginUrl = new URL(`/login?redirect=${prevUri}`, request.url);

        //return NextResponse.redirect(new URL('/login', request.url));
        return NextResponse.redirect(loginUrl);
    }

    // 이미 로그인 됐는데 로그인 페이지 가려고 하면 -> 홈으로 보내기
    if (isLoginPage && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    

    return NextResponse.next();
}

// 미들웨어가 작동할 경로 설정
// matcher에도 authRequiredPaths 경로들을 등록해줘야 미들웨어가 작동합니다.
export const config = {
    //matcher: ['/mypage/:path*', '/login'],
    matcher: [
        '/mypage/:path*',
        '/login',
        '/dashboardaaaaaa/:path*',
        '/settingsaaaaaa/:path*',
        '/adminaaaaaaaa/:path*'
    ],
};