import { AxiosError } from 'axios';
import { navigateTo } from '@/utils/router';
import { api } from '../api';

let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (value: unknown) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  pendingRequests.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(undefined);
    }
  });

  pendingRequests = [];
};

export const refreshAccessToken = async (error: AxiosError) => {
  const originalRequest = error.config as any;
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      await api.post('/auth/refresh-token');
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        return Promise.reject(error);
      }

      processQueue(null);
      return api(originalRequest);
    } catch (error) {
      processQueue(error as AxiosError);

      if (process.env.NODE_ENV === 'development') console.error('Unauthorized');
      if (window.location.pathname !== '/auth/login') {
        navigateTo('/auth/login');
      }

      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};
