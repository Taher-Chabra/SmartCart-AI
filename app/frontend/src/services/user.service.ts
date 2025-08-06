import { api } from '@/lib/api';

// Fetch user

const getUser = async () => {
   const response = await api.get('/user/getUser');
   return response.data;
};

export { getUser };
