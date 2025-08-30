type navigatorFn = (path: string) => void;

let globalRouter: navigatorFn | null = null;

export const setGlobalRouter = (router: navigatorFn) => {
  globalRouter = router;
};

export const navigateTo = (path: string) => {
  if (globalRouter) {
    globalRouter(path);
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Global router is not initialized!');
    }
  }
};
