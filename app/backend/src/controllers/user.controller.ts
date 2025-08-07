import { getProfileByRole } from "../lib/getProfileByRole";
import { User, UserModel } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

// Get user profile

const getUser = asyncHandler(async (req: Request, res: Response) => {
   const user = req.user as UserModel;

   const currentUser = await User
      .findById(user.id)
      .select("-password -refreshToken");

   if (!currentUser) {
      throw new ApiError(404, "User not found");
   }

   const profile = await getProfileByRole(currentUser.role, currentUser._id);

   if (!profile) {
      throw new ApiError(400, `Profile not found for User: ${currentUser.username}`);
   }

   const fullUserProfile = {
      ...currentUser.toJSON(),
      ...profile.toJSON(),
   };

   return res
      .status(200)
      .json(new ApiResponse(
         200,
         { user: fullUserProfile },
         "User fetched successfully"
      ))
});

export { getUser };