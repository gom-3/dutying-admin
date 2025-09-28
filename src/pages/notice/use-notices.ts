/** 공지사항 관련 react-query 훅들 */

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getNotices, getNotice, createNotice, updateNotice, deleteNotice} from '@/api/notice';
import type {NoticeListParams, CreateNoticeRequest, UpdateNoticeRequest} from '@/types/notice';

// Query Keys
export const noticeKeys = {
  all: ['notices'] as const,
  lists: () => [...noticeKeys.all, 'list'] as const,
  list: (params: NoticeListParams) => [...noticeKeys.lists(), params] as const,
  details: () => [...noticeKeys.all, 'detail'] as const,
  detail: (id: number) => [...noticeKeys.details(), id] as const,
};

/**
 * 공지사항 목록 조회 훅
 */
export const useNotices = (params: NoticeListParams) => {
  return useQuery({
    queryKey: noticeKeys.list(params),
    queryFn: () => getNotices(params),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

/**
 * 공지사항 단건 조회 훅
 */
export const useNotice = (noticeId: number) => {
  return useQuery({
    queryKey: noticeKeys.detail(noticeId),
    queryFn: () => getNotice(noticeId),
    enabled: !!noticeId,
  });
};

/**
 * 공지사항 생성 훅
 */
export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoticeRequest) => createNotice(data),
    onSuccess: () => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({queryKey: noticeKeys.lists()});
    },
  });
};

/**
 * 공지사항 수정 훅
 */
export const useUpdateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({noticeId, data}: {noticeId: number; data: UpdateNoticeRequest}) =>
      updateNotice(noticeId, data),
    onSuccess: (_, {noticeId}) => {
      // 해당 공지사항 상세 캐시 무효화
      queryClient.invalidateQueries({queryKey: noticeKeys.detail(noticeId)});
      // 목록 캐시 무효화
      queryClient.invalidateQueries({queryKey: noticeKeys.lists()});
    },
  });
};

/**
 * 공지사항 삭제 훅
 */
export const useDeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noticeId: number) => deleteNotice(noticeId),
    onSuccess: (_, noticeId) => {
      // 해당 공지사항 상세 캐시 제거
      queryClient.removeQueries({queryKey: noticeKeys.detail(noticeId)});
      // 목록 캐시 무효화
      queryClient.invalidateQueries({queryKey: noticeKeys.lists()});
    },
  });
};
