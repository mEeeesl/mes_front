// 커스텀 모달의 열림 상태와 메시지를 관리할 스토어
import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  message: string;
  onConfirm?: () => void; // 확인 버튼 눌렀을 때 실행할 함수 추가
  showAlert: (message: string, onConfirm?: () => void) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  message: '',
  showAlert: (message, onConfirm) => set({ isOpen: true, message, onConfirm }),
  closeModal: () => set((state) => {
    if (state.onConfirm) state.onConfirm(); // 콜백 있으면 실행
    return { isOpen: false, message: '', onConfirm: undefined };
  }),
}));