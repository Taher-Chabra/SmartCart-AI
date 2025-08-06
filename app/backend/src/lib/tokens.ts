import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { ApiError } from '../utils/ApiError';

// Function to generate access and refresh tokens for a user

export const generateSecretTokens = async (userId: mongoose.Types.ObjectId): Promise<{ accessToken: string; refreshToken: string }> => {
   try {
      const user = await User.findById(userId);
      if (!user) {
         throw new ApiError(404, "User not found");
      }
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };

   } catch (error: any) {
      throw new ApiError(500, "Failed to generate tokens");
   }
}
