import { api } from "@/utils/api";
import { AxiosError } from "axios";
import { IUserSignup} from "@smartcartai/shared/src/interface/user";

// User signup
const signupUser = async (data: IUserSignup) => {
   try {
      const response = await api.post('/auth/register', data);
      return response.data;
   } catch (error: AxiosError | any) {
      throw new Error(error.response?.data?.message || 'Error during signup');
   }
}

// User login
const loginUser = async (
   data: { email: string; password: string; }
) => {
   try {
      const response = await api.post('/auth/login', data);
      return response.data;
   } catch (error: AxiosError | any) {
      throw new Error(error.response?.data?.message || 'Error during login');
   }
}

// User logout
const logoutUser = async () => {
   try {
      const response = await api.post('/auth/logout');
      return response;
   } catch (error: AxiosError | any) {
      throw new Error(error.response?.data?.message || 'Error during logout');
   }
}

export { signupUser, loginUser, logoutUser };
