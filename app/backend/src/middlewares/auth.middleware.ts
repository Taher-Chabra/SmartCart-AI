import { Request, Response, NextFunction } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import { User } from '../models/user.model'

export const verifyJWTAuth = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
   try {
      const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
      if (!token) {
         throw new ApiError(401, 'Unauthorized Request: No token provided');
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret);
      if (!decodedToken || typeof decodedToken === 'string') {
         throw new ApiError(401, 'Unauthorized Request: Invalid token');
      }

      const user = await User.findById(decodedToken._id).select('-password -refreshToken');
      if (!user) {
         throw new ApiError(401, 'Unauthorized Request: Invalid token');
      }

      req.user = user;
      next();

   } catch (error: any) {
      throw new ApiError(401, error?.message || "Invalid Access Token");
   }
})
