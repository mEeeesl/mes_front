import api from '@/lib/axios'; // [ 공통 서버 통신 axios ]
import { ApiResData } from '@/types/auth'; // [ 전용 로그인 데이터 규격 ]

export const mypageService = {

    getDetailProfile: async () => {
        // 토큰만 실어보냄.. reqData 아예 없는..?
        const res = await api.post<any, ApiResData>('/auth/mypage');
        
        if (res.cd !== "0000") {
            throw new Error(res.msg || "상세 정보를 가져오지 못했습니다.");
        }

        return res.data;
    },
}