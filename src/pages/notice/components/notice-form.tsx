/** 공지사항 작성/수정 폼 컴포넌트 */

import {useState, memo, useCallback, useMemo, useEffect} from 'react';
import {useForm} from 'react-hook-form';
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
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useCreateNotice, useUpdateNotice} from '@/pages/notice/use-notices';
import type {Notice, Platform, CreateNoticeRequest} from '@/types/notice';

interface NoticeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice?: Notice | null;
  mode: 'create' | 'edit';
}

interface FormData {
  title: string;
  content: string;
  platform: Platform;
  version: string;
}

const PLATFORMS: Platform[] = ['MOBILE', 'WEB'];

export const NoticeForm = memo(({open, onOpenChange, notice, mode}: NoticeFormProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(notice?.platform ?? 'MOBILE');
  const defaultValues = useMemo(
    () => ({
      title: notice?.title ?? '',
      content: notice?.content ?? '',
      platform: notice?.platform ?? 'MOBILE',
      version: notice?.version ?? '',
    }),
    [notice],
  );
  const form = useForm<FormData>({
    defaultValues,
  });
  const createNotice = useCreateNotice();
  const updateNotice = useUpdateNotice();
  const isLoading = useMemo(
    () => createNotice.isPending || updateNotice.isPending,
    [createNotice.isPending, updateNotice.isPending],
  );

  // form 초기값 업데이트
  useEffect(() => {
    if (notice) {
      setSelectedPlatform(notice.platform);
      form.reset({
        title: notice.title,
        content: notice.content,
        platform: notice.platform,
        version: notice.version,
      });
    }
  }, [notice, form]);

  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        const requestData: CreateNoticeRequest = {
          title: data.title,
          content: data.content,
          platform: selectedPlatform,
          version: data.version,
        };

        if (mode === 'create') {
          await createNotice.mutateAsync(requestData);
        } else if (notice) {
          await updateNotice.mutateAsync({
            noticeId: notice.id,
            data: requestData,
          });
        }

        onOpenChange(false);
        form.reset();
      } catch (error) {
        console.error('공지사항 저장 실패:', error);
      }
    },
    [mode, selectedPlatform, createNotice, updateNotice, notice, onOpenChange, form],
  );
  const handlePlatformClick = useCallback((platform: Platform) => {
    setSelectedPlatform(platform);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? '새 공지사항 작성' : '공지사항 수정'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? '새로운 공지사항을 작성하세요.' : '공지사항 내용을 수정하세요.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{required: '제목을 입력해주세요.'}}
              render={({field}) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="공지사항 제목을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>플랫폼</FormLabel>
              <div className="flex gap-2">
                {PLATFORMS.map((platform) => (
                  <Badge
                    key={platform}
                    variant={selectedPlatform === platform ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handlePlatformClick(platform)}
                  >
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="version"
              rules={{required: '버전을 입력해주세요.'}}
              render={({field}) => (
                <FormItem>
                  <FormLabel>버전</FormLabel>
                  <FormControl>
                    <Input placeholder="예: 1.0.26" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              rules={{required: '내용을 입력해주세요.'}}
              render={({field}) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Textarea placeholder="공지사항 내용을 입력하세요" rows={8} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '저장 중...' : mode === 'create' ? '작성' : '수정'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
