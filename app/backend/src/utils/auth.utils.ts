import { User, UserDocument } from "../models/user.model";
import { generateSecretTokens } from "../utils/tokens.utils";

export const authResponseData = async (user: UserDocument) => {
   const { accessToken, refreshToken } = await generateSecretTokens(user._id);

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   const cookieOptions  = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const
   }

   return {
      accessToken,
      refreshToken,
      loggedInUser,
      cookieOptions
   }
}