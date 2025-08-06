import axios, { AxiosResponse, AxiosError } from 'axios';
import { toast } from 'sonner';
import { refreshAccessToken } from './auth/refreshAccessToken';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const isDevEnv = process.env.NODE_ENV === 'development';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (isDevEnv) console.error(error.response.data);
          return refreshAccessToken(error);
        case 403:
          if (isDevEnv) console.error(error.response.data);
          toast.error(
            'You do not have permission to view this resource.'
          );
          break;
        case 500:
          if (isDevEnv) console.error(error.response.data);
          toast.error(
            'An unexpected error occurred. Please try again later.'
          );
          break;
        default:
          if (isDevEnv) console.error('Unhandled error', error.response.data);
          toast.error('An error occurred. Please try again.');
      }
    }
    return Promise.reject(error);
  }
);
