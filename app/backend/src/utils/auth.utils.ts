import mongoose from "mongoose";
import { generateSecretTokens } from "../utils/tokens.utils";

export const authResponseData = async (userId: mongoose.Types.ObjectId) => {
   const { accessToken, refreshToken } = await generateSecretTokens(userId);

   const cookieOptions  = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const
   }

   return {
      accessToken,
      refreshToken,
      cookieOptions
   }
}