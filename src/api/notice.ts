import type {
  Notice,
  NoticeListResponse,
  CreateNoticeRequest,
  UpdateNoticeRequest,
  NoticeListParams,
} from '@/types/notice';
import {apiClient} from './client';

// 플랫폼 값 변환 함수 (필요시 플랫폼 값 변환)
const convertToApiPlatform = (platform: string): string => {
  return platform; // MOBILE, WEB 그대로 전달
};

/**
 * 공지사항 목록 조회
 */
export const getNotices = async (params: NoticeListParams): Promise<NoticeListResponse> => {
  const {platform, page, size} = params;
  const queryParams = new URLSearchParams({
    platform: platform === 'ALL' ? 'ALL' : convertToApiPlatform(platform),
    page: page.toString(),
    size: size.toString(),
  });
  const response = await apiClient.get<NoticeListResponse>(`/notices?${queryParams.toString()}`);

  return response.data;
};

/**
 * 공지사항 단건 조회
 */
export const getNotice = async (noticeId: number): Promise<Notice> => {
  const response = await apiClient.get<Notice>(`/notices/${noticeId}`);

  return response.data;
};

/**
 * 공지사항 생성
 */
export const createNotice = async (data: CreateNoticeRequest): Promise<Notice> => {
  const apiData = {
    ...data,
    platform: convertToApiPlatform(data.platform),
  };
  const response = await apiClient.post<Notice>('/notices', apiData);

  return response.data;
};

/**
 * 공지사항 수정
 */
export const updateNotice = async (
  noticeId: number,
  data: UpdateNoticeRequest,
): Promise<Notice> => {
  const apiData = {
    ...data,
    platform: convertToApiPlatform(data.platform),
  };
  const response = await apiClient.put<Notice>(`/notices/${noticeId}`, apiData);

  return response.data;
};

/**
 * 공지사항 삭제
 */
export const deleteNotice = async (noticeId: number): Promise<void> => {
  await apiClient.delete(`/notices/${noticeId}`);
};
