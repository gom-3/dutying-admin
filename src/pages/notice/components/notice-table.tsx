/** 공지사항 목록 테이블 컴포넌트 */

import {format} from 'date-fns';
import {ko} from 'date-fns/locale';
import {useState, memo, useCallback} from 'react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {useDeleteNotice} from '@/pages/notice/use-notices';
import type {Notice} from '@/types/notice';

interface NoticeTableProps {
  notices: Notice[];
  onEdit: (notice: Notice) => void;
  isLoading?: boolean;
}

export const NoticeTable = memo(({notices, onEdit, isLoading}: NoticeTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);
  const deleteNotice = useDeleteNotice();
  const handleDeleteClick = useCallback((notice: Notice) => {
    setNoticeToDelete(notice);
    setDeleteDialogOpen(true);
  }, []);
  const handleDeleteConfirm = useCallback(async () => {
    if (noticeToDelete) {
      try {
        await deleteNotice.mutateAsync(noticeToDelete.id);
        setDeleteDialogOpen(false);
        setNoticeToDelete(null);
      } catch (error) {
        console.error('공지사항 삭제 실패:', error);
      }
    }
  }, [noticeToDelete, deleteNotice]);
  const handleDialogClose = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);
  const getPlatformColor = useCallback((platform: string) => {
    switch (platform) {
      case 'MOBILE':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'WEB':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  }, []);
  const formatDate = useCallback((dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy.MM.dd HH:mm', {locale: ko});
    } catch {
      return dateString;
    }
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>제목</TableHead>
              <TableHead>플랫폼</TableHead>
              <TableHead>버전</TableHead>
              <TableHead>조회수</TableHead>
              <TableHead>생성일</TableHead>
              <TableHead>수정일</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({length: 5}).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 animate-pulse rounded bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="h-4 animate-pulse rounded bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="h-4 animate-pulse rounded bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="h-4 animate-pulse rounded bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="h-4 animate-pulse rounded bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="h-4 animate-pulse rounded bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="h-4 animate-pulse rounded bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="h-4 animate-pulse rounded bg-gray-200" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-24">플랫폼</TableHead>
              <TableHead className="w-24">버전</TableHead>
              <TableHead className="w-20">조회수</TableHead>
              <TableHead className="w-36">생성일</TableHead>
              <TableHead className="w-36">수정일</TableHead>
              <TableHead className="w-32">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  공지사항이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell className="font-medium">{notice.id}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="truncate font-medium">{notice.title}</div>
                      <div className="truncate text-sm text-gray-500">{notice.content}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlatformColor(notice.platform)}>{notice.platform}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{notice.version}</TableCell>
                  <TableCell>{notice.viewCount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{formatDate(notice.createdAt)}</TableCell>
                  <TableCell className="text-sm">{formatDate(notice.modifiedAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(notice)}>
                        수정
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(notice)}
                      >
                        삭제
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>공지사항 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 공지사항을 삭제하시겠습니까?
              <br />
              <strong>{noticeToDelete?.title}</strong>
              <br />이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose} disabled={deleteNotice.isPending}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteNotice.isPending}
            >
              {deleteNotice.isPending ? '삭제 중...' : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});
