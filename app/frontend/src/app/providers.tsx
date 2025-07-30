import RouterProvider from '@/provider/RouterProvider';
import ToastProvider from '@/provider/ToastProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RouterProvider>
      <ToastProvider>
         {children}
      </ToastProvider>
    </RouterProvider>
  );
}