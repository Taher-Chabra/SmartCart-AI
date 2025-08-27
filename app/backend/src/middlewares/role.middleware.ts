import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model';
import { ApiError } from '../utils/ApiError';

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserModel;

    if (!user) {
      throw new ApiError(401, 'Unauthorized Request!');
    }

    if (!user.isEmailVerified) {
      throw new ApiError(403, 'Email not verified');
    }

    if (user.role !== role) {
      throw new ApiError(
        403,
        `Access denied. You need to be a ${role} to access this resource.`
      );
    }

    next();
  };
};
