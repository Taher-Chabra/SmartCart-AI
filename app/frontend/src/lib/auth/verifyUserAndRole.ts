import { cookies } from 'next/headers';
import jwt, {Secret} from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import { IJwtPayload } from '@smartcartai/shared/src/interface/user';

type RoleType = 'admin' | 'seller' | 'customer';

export const verifyUserAndRole = async ({requiredRole}: {requiredRole: RoleType}) => {
   const cookieStroe = cookies();
   const accessToken = cookieStroe.get('accessToken')?.value;

   if (!accessToken) {
      console.error('Unauthorized access. Please log in.');
      redirect('/auth/login');
   }

   try {
      const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET as Secret;
      const decodedToken = jwt.verify(accessToken, jwtSecret) as IJwtPayload;

      if (requiredRole && requiredRole !== decodedToken.role) {
         console.error(`Access denied. You need to be a ${requiredRole} to access this page.`);
         redirect('/auth/login');
      }

   } catch (error: any) {
      console.error(error || 'Unauthorized access. Please log in again.');
      redirect('/auth/login');
   }
}