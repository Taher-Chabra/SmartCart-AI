import { Toaster } from 'sonner';

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'bg-gray-800 text-white',
          style: {
            borderRadius: '8px',
            padding: '16px',
          },
        }}
        richColors
        closeButton
      />
      {children}
    </>
  );
}
