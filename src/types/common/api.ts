/**
 * [ 공통 규격 ]
 * 서버 응답 데이터에 맞는 공통 구조 정의 - List<Map> or Map 대응
 *  */ 


/**
 * [ 공통 맵 정의 ]
 * 모든 데이터는 Key-Value 형태
 * DEFAULT string + 다양한 타입 허용 
 */
export type DataMap = Record<string, string | any>;


/**
 * [ 서버 응답 규격 ]
 * 백엔드 ApiResponse<T> 규격과 1:1 매칭
 */
export interface ApiResponse<T> {
    cd: string;       // 비즈니스 상태 코드 (ex: "0000")
    msg: string;    
    data: T;            // resData(Map 또는 List<Map>)
}


// 3. 공통 페이지 규격
export interface Pagination {
    page: number; // 현재페이지
    totalElements: number;
    totalPages: number;
    size: number;
}