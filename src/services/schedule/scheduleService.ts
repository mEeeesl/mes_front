import axios from 'axios';

export const scheduleService = {
    // 근무 신청 서비스 호출
    applyAttendance: async (payload: any) => {
        // 서버 로직 준비 전이므로 임시 URL 설정
        const response = await axios.post('/api/schedule/apply', payload);
        return response.data;
    },

    // 이미 신청된 날짜 조회
    getAppliedDates: async () => {
        const response = await axios.get('/api/schedule/applied-dates');
        return response.data; // 예: { data: ['2026-05-20', '2026-05-21'] }
    }
};