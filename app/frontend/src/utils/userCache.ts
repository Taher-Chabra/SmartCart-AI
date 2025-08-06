import { ICombinedUser } from "@smartcartai/shared/src/interface/user";

const USER_CACHE_KEY = 'cachedUsers';
const USER_CACHE_TTL = 1000 * 60 * 15;

export const cacheUser = (user: ICombinedUser) => {
   const data = {
      user,
      timestamp: Date.now()
   }

   sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify(data));
}

export const getCachedUser = (): ICombinedUser | null => {
   const cached = sessionStorage.getItem(USER_CACHE_KEY);
   if (!cached) return null;

   const { user, timestamp } = JSON.parse(cached);
   if (Date.now() - timestamp > USER_CACHE_TTL) {
      sessionStorage.removeItem(USER_CACHE_KEY);
      return null;
   }

   return user;
}

export const clearUserCache = () => {
   sessionStorage.removeItem(USER_CACHE_KEY);
}