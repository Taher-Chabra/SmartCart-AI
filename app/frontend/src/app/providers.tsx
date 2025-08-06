'use client';

import RehydrateUserProvider from '@/provider/RehydrateUserProvider';
import RouterProvider from '@/provider/RouterProvider';
import ToastProvider from '@/provider/ToastProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <RouterProvider />
      <RehydrateUserProvider />
      {children}
    </ToastProvider>
  );
}
