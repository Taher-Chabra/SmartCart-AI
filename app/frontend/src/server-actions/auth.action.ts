'use server';

import { api } from '@/utils/api';
import { AxiosError } from 'axios';
import zod, { success } from 'zod';

const signupSchema = zod.object({
  fullName: zod.string().min(5, 'Full name is required'),
  username: zod.string().min(3, 'Username is required'),
  email: zod.email('Invalid email format'),
  password: zod.string().min(8, 'Password must be at least 8 characters long'),
  role: zod.enum(['customer', 'seller', 'admin'], 'Invalid role'),
});

const loginSchema = zod.object({
  email: zod.email('Invalid email format'),
  password: zod.string().min(8, 'Password must be at least 8 characters long'),
});

// user signup

const signupUser = async (data: FormData): Promise<any> => {
  const validation = signupSchema.safeParse(Object.fromEntries(data));

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: zod.treeifyError(validation.error),
    };
  }

  try {
    const fullName = data.get('fullName');
    const username = data.get('username');
    const email = data.get('email');
    const role = data.get('role');
    const password = data.get('password');

    const response = await api.post('/auth/signup', {
      fullName,
      username,
      email,
      role,
      password,
    });
    return {success: true, data: response.data.data, message: response.data.message};
  } catch (error: AxiosError | any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error during signup',
    };
  }
};

// user login

const loginUser = async (data: FormData): Promise<any> => {
  const validation = loginSchema.safeParse(Object.fromEntries(data));

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: zod.treeifyError(validation.error),
    };
  }

  try {
    const email = data.get('email');
    const password = data.get('password');

    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return {success: true, data: response.data.data, message: response.data.message};
  } catch (error: AxiosError | any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error during login',
    };
  }
};

// Logout user

const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout');
    return {success: true, message: response.data.message};
  } catch (error: AxiosError | any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error during logout',
    };
  }
};

export { signupUser, loginUser, logoutUser };
