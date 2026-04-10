import axios from 'axios';

export const checkInService = {
    // 출근 API
    postCheckIn: async (payload: { lat: number; lng: number; accuracy: number }) => {
        const { data } = await axios.post('/api/checkIn/workProc', payload);
        return data;
    }
};