import { User } from '../models/user.model';

declare global {
   namespace Express {
      interface Request {
         user?: User;
         cookies?: { [key: string]: string };
      }
   }
}