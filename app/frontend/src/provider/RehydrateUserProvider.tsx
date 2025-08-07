import { useEffect } from 'react';
import { cacheUser, getCachedUser, clearUserCache } from '@/utils/userCache';
import { useAuthStore } from '@/store/auth.store';
import { getUser } from '@/services/user.service';
import axios from 'axios';
import { ICombinedUser } from '@smartcartai/shared/src/interface/user';

async function rehydrateUser(
  setUser: (user: ICombinedUser) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string) => void
) {
  setLoading(true);
  const cachedUser = getCachedUser();
  if (cachedUser) {
    setLoading(false);
    setUser(cachedUser);
    return;
  }

  try {
    const response = await getUser();
    if (response.success) {
      setUser(response.data.user);
      cacheUser(response.data.user);
    } else {
      console.error('Failed to fetch user:', response.message);
      clearUserCache();
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.log('No active session found. Clearing user state.');
      clearUserCache();
    } else {
      console.error('Error rehydrating user:', error);
      setError('Failed to fetch user data due to an unexpected error.');
      clearUserCache();
    }
  } finally {
    setLoading(false);
  }
}

export default function RehydrateUserProvider() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      rehydrateUser(setUser, setLoading, setError);
    }
  }, [setUser, setLoading, setError, isAuthenticated]);

  return null;
}
