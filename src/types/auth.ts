/** /src/types/auts.ts
 *  Only 로그인/권한용
 *  나머지 서비스는 각 디렉토리 별도 규격 관리
 */

// [ 공통 규격 import ]
import { ApiResponse } from './common/api';

// 응답 규격 Map
export type UserMap = Record<string, string | any>;
export type dataMap = Record<string, string | any>;

/**********************************************/
// 내가 작성한 코드 [S]

// 공통 응답 규격 (단건)
export type ApiResData = ApiResponse<dataMap>;

// 유저정보 응답 규격 (단건)
export type LoginResponse = ApiResponse<UserMap>;
export type UserProfile = ApiResponse<UserMap>;


/** 리스트 형태의 응답 (단건 혹은 복수건) (리스트 안에는 맵이 있음) */
//export type ListMapResponse<T = DataMap> = T[];
// 내가 작성한 코드 [E]
/**********************************************/







/** 로그인 요청 데이터 (아이디, 비번) */
export interface LoginRequest {
    userId: string;
    password: string;
}

/** 유저 프로필 정보 (Map 형태) */
export interface UserProfile2 extends UserMap {
    user?: UserMap;
    //dept?: DataMap; // 추후 부서 포함예정 대비
}

/** 로그인 응답 데이터 (서버에서 Map 형태로 내려옴) */
export interface LoginResponse2 extends UserMap {
    user?: UserMap;
}











