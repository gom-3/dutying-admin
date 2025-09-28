import {lazy, Suspense, memo} from 'react';
import {Route, Routes} from 'react-router';
import MainLayout from '@/layouts/main-layout';
import {ROUTES} from '@/consts';

const HomePage = lazy(() => import('./home'));
const NoticePage = lazy(() => import('./notice'));
const NotificationPage = lazy(() => import('./notification'));

export const Router = memo(() => {
  return (
    <Suspense>
      <Routes>
        <Route path={ROUTES.HOME.PATH} element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTES.NOTICE.PATH} element={<NoticePage />} />
          <Route path={ROUTES.NOTIFICATION.PATH} element={<NotificationPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
});
