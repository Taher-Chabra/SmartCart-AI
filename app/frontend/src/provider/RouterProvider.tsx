import { setGlobalRouter } from '@/utils/router';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RouterProvider() {
  const router = useRouter();

  useEffect(() => {
    if (router) setGlobalRouter(router.push);
  }, [router]);

  return null;
}
