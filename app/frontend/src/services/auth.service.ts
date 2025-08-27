import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { IUserSignup } from '@smartcartai/shared/src/interface/user';

// Send Verification code to email
const sendCodeToEmail = async (email: string) => {
  try {
    const response = await api.post('/auth/send-verification-code', { email });
    return response.data;
  } catch (error: AxiosError | any) {
    throw new Error(
      error.response?.data?.message || 'Error sending verification code'
    );
  }
};

// Verify code
const verifyCode = async (email: string, code: string) => {
  try {
    const response = await api.post('/auth/verify-code', { email, code });
    return response.data;
  } catch (error: AxiosError | any) {
    throw new Error(error.response?.data?.message || 'Error verifying code');
  }
};

// Complete profile creation
const completeProfileCreation = async () => {
  try {
    const response = await api.post('/auth/complete-profile');
    return response.data;
  } catch (error: AxiosError | any) {
    throw new Error(
      error.response?.data?.message || 'Error completing profile creation'
    );
  }
};

// User signup
const signupUser = async (data: IUserSignup) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error: AxiosError | any) {
    throw new Error(error.response?.data?.message || 'Error during signup');
  }
};

// User login
const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error: AxiosError | any) {
    throw new Error(error.response?.data?.message || 'Error during login');
  }
};

// choose role after google login
const chooseRoleAfterGoogleLogin = async (userId: string, role: string) => {
  try {
    const response = await api.post(`/auth/${userId}/choose-role`, { role });
    return response.data;
  } catch (error: AxiosError | any) {
    throw new Error(
      error.response?.data?.message || 'Error during role selection'
    );
  }
};

// User logout
const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error: AxiosError | any) {
    throw new Error(error.response?.data?.message || 'Error during logout');
  }
};

export {
  sendCodeToEmail,
  verifyCode,
  signupUser,
  loginUser,
  chooseRoleAfterGoogleLogin,
  logoutUser,
  completeProfileCreation,
};
