import { cacheUser } from '@/utils/userCache';
import { navigateTo } from '@/utils/router';
import { ICombinedUser } from '@smartcartai/shared/src/interface/user';
import { useAuthStore } from '@/store/auth.store';

const setUser = useAuthStore.getState().setUser;

const setAndNavigateUser = (user: ICombinedUser) => {
  setUser(user);
  cacheUser(user);

  if (user.role === 'seller') {
    return navigateTo('/seller/dashboard');
  } else if (user.role === 'customer') {
    return navigateTo('/customer/dashboard');
  } else if (user.role === 'admin') {
    return navigateTo('/admin/dashboard');
  } else {
    return navigateTo('/');
  }
};

export default setAndNavigateUser;
