// 데이터를 서버에서 가져와(fecth) 보관하는 저장소
import { create } from 'zustand';
import { ApiResponse, DataMap } from '../types/common/api';

interface DataState {
    list: DataMap[]; // 맵이 담긴 배열
    singleMap : DataMap; // 단일 맵
    fetchList: (url: string) => Promise<void>;
}

export const useDataStore = create<DataState>((set) => ({
    list: [],
    singleMap: {},
    fetchList: async (url) => {
        const res = await fetch(url);
        const result: ApiResponse<DataMap[]> = await res.json();

        // List<Map>를 상태에 저장
        set({ list: result.data});
    }
}));