/** 공지사항 페이지, 공지사항 목록 조회 및 작성 가능 */

import {Plus, FileText, Eye, Calendar} from 'lucide-react';
import {useState, memo, useCallback, useMemo} from 'react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {useNotices} from '@/pages/notice/use-notices';
import type {Notice, PlatformFilter} from '@/types/notice';
import {NoticeForm} from './components/notice-form';
import {NoticeTable} from './components/notice-table';
import {PlatformFilterComponent} from './components/platform-filter';

const NoticePage = memo(() => {
  const [currentPage, setCurrentPage] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>('ALL');
  const pageSize = 10;
  const {data, isLoading, error} = useNotices({
    platform: selectedPlatform,
    page: currentPage,
    size: pageSize,
  });
  const handleCreateClick = useCallback(() => {
    setFormMode('create');
    setSelectedNotice(null);
    setFormOpen(true);
  }, []);
  const handleEditClick = useCallback((notice: Notice) => {
    setFormMode('edit');
    setSelectedNotice(notice);
    setFormOpen(true);
  }, []);
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  const handlePlatformChange = useCallback((platform: PlatformFilter) => {
    setSelectedPlatform(platform);
    setCurrentPage(0); // 플랫폼 변경 시 첫 페이지로 리셋
  }, []);
  const totalPages = useMemo(() => data?.totalPages ?? 0, [data?.totalPages]);
  const totalElements = useMemo(() => data?.totalElements ?? 0, [data?.totalElements]);
  const notices = useMemo(() => data?.content ?? [], [data?.content]);
  // 통계 데이터 계산
  const stats = useMemo(
    () => ({
      total: totalElements,
      mobile: notices.filter((n) => n.platform === 'MOBILE').length,
      web: notices.filter((n) => n.platform === 'WEB').length,
      totalViews: notices.reduce((sum, n) => sum + n.viewCount, 0),
    }),
    [totalElements, notices],
  );

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-600">오류 발생</h2>
            <p className="mt-2 text-sm text-gray-500">
              공지사항을 불러오는 중 오류가 발생했습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">공지사항 관리</h1>
          <p className="text-gray-500">공지사항을 조회하고 관리할 수 있습니다.</p>
        </div>
        <Button onClick={handleCreateClick} size="lg">
          <Plus className="mr-2 h-4 w-4" />새 공지사항 작성
        </Button>
      </div>

      {/* 플랫폼 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">플랫폼 필터</CardTitle>
          <CardDescription>보고 싶은 플랫폼을 선택하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <PlatformFilterComponent
            selectedPlatform={selectedPlatform}
            onPlatformChange={handlePlatformChange}
          />
        </CardContent>
      </Card>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 공지사항</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
            <p className="text-muted-foreground text-xs">현재 페이지: {notices.length}개</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">선택된 필터</CardTitle>
            <Badge variant="outline" className="text-xs">
              {selectedPlatform === 'ALL' ? '전체' : selectedPlatform}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedPlatform}</div>
            <p className="text-muted-foreground text-xs">
              {selectedPlatform === 'ALL' ? '모든 플랫폼' : `${selectedPlatform} 플랫폼`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 조회수</CardTitle>
            <Eye className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-muted-foreground text-xs">현재 페이지 기준</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">페이지 정보</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPage + 1}</div>
            <p className="text-muted-foreground text-xs">/ {totalPages} 페이지</p>
          </CardContent>
        </Card>
      </div>

      {/* 공지사항 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>공지사항 목록</CardTitle>
          <CardDescription>등록된 공지사항을 확인하고 관리할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <NoticeTable notices={notices} onEdit={handleEditClick} isLoading={isLoading} />

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                      className={
                        currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                    let pageNum = i;

                    // 현재 페이지를 중심으로 페이지 번호 계산
                    if (totalPages > 5) {
                      const start = Math.max(0, currentPage - 2);
                      const end = Math.min(totalPages - 1, start + 4);

                      pageNum = start + i;

                      if (pageNum > end) return null;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 3 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(totalPages - 1)}
                          className="cursor-pointer"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                      className={
                        currentPage === totalPages - 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 공지사항 작성/수정 폼 */}
      <NoticeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        notice={selectedNotice}
        mode={formMode}
      />
    </div>
  );
});

export default NoticePage;
