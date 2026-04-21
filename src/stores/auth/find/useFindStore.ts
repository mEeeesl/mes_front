import { create } from 'zustand';

// 탭 타입 정의
export type FindType = 'ID' | 'PW';

interface FindState {
  activeTab: FindType;
  // 액션: 탭 변경
  setActiveTab: (tab: FindType) => void;
  // 액션: 초기화 (페이지를 나갈 때 등)
  resetTab: () => void;
}

export const useFindStore = create<FindState>((set) => ({
  activeTab: 'ID', // 기본값
  setActiveTab: (tab) => set({ activeTab: tab }),
  resetTab: () => set({ activeTab: 'ID' }),
}));