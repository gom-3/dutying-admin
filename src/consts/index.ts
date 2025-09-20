export const ROUTES = {
  HOME: {
    PATH: '/',
    TITLE: 'Home',
  },
  NOTIFICATION: {
    PATH: '/notification',
    TITLE: '알림',
  },
  NOTICE: {
    PATH: '/notice',
    TITLE: '공지사항',
  },
};

export const getRouteTitle = (path: string): string | undefined => {
  return Object.values(ROUTES).find((route) => route.PATH === path)?.TITLE;
};
