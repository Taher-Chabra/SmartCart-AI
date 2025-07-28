export interface IUserBase {
  username: string;
  email: string;
  role: 'customer' | 'admin' | 'seller';
}
