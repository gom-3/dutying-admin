/** 공지사항 관련 타입 정의 */

export type Platform = 'MOBILE' | 'WEB';
export type PlatformFilter = Platform | 'ALL';

export interface Notice {
  id: number;
  platform: Platform;
  version: string;
  title: string;
  content: string;
  viewCount: number;
  createdAt: string;
  modifiedAt: string;
}

export interface NoticeListResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: Notice[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface CreateNoticeRequest {
  platform: Platform;
  version: string;
  title: string;
  content: string;
}

export interface UpdateNoticeRequest {
  platform: Platform;
  version: string;
  title: string;
  content: string;
}

export interface NoticeListParams {
  platform: PlatformFilter;
  page: number;
  size: number;
}
