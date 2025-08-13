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
    const errorMessage =
      error.response && error.response.data && typeof (error.response.data as any).message === 'string'
        ? (error.response.data as any).message
        : 'An error occurred';
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error(errorMessage);
          return refreshAccessToken(error);
        case 403:
          console.error(errorMessage);
          break;
        case 400:
          console.error(errorMessage);
          break;
        case 500:
          console.error(errorMessage);
          break;
        default:
          console.error('Unhandled error', errorMessage);
      }
    }
    return Promise.reject(error);
  }
);
