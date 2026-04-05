// 1. 공통 규격 import
import { ApiResponse, Pagination } from '../common/api';

// 2. 공지사항 단건(Entity) 타입
export interface NoticeItem {
    id: number;
    title: string;
    content: string;
    createdAt: string;

}

// 3. 공지사항 목록 응답 규격 
// 리스트 응답일 경우 (백엔드가 List<Map>을 보낼 때) + (공통 규격)
export type NoticeListResponse = ApiResponse<NoticeItem[]>;


// 3-1. 공지사항 목록 응답 규격 (리스트 + 페이징) + (공통 규격)
export type NoticeListResponsePage = ApiResponse<{
    content: NoticeItem[];
    pagination: Pagination;
}>;

// 4. 공지사항 상세 응답 규격 (단건)
export type NoticeDetailResponse = ApiResponse<NoticeItem>;








// 2. 공지사항 단건(Entity) 타입
export interface NoticeItem2 extends api{
    id: number;
    title: string;
    content: string;
    createdAt: string;
    notice? DataMap;
}