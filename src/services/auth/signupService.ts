import api from '@/lib/axios';
import { ApiResponse } from '@/types/common/api';

export interface SignupPayload {
  userNm: string;
  userId: string;
  userPw: string;
  telNo: string;
  birthDate: string;
  email: string;
  kakaoCode: string | null;
}

export const signupService = {
  /**
   * 회원가입 요청 (POST)
   * ApiResponse<string>은 성공 시 데이터가 문자열(메시지 등)일 경우입니다.
   */
  registerUser: async (payload: SignupPayload): Promise<ApiResponse<any>> => {
    const { data } = await api.post<ApiResponse<any>>('/auth/signup/register', payload);
    return data;
  },

  /**
   * 아이디 중복 체크
   */
  checkDuplicateId: async (userId: string): Promise<ApiResponse<any>> => {
    const { data } = await api.post<ApiResponse<any>>('/auth/signup/chk', {userId: userId});
    return data;
  },
};