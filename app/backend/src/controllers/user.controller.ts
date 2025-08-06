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

   return res
      .status(200)
      .json(new ApiResponse(
         200,
         { user: currentUser },
         "User fetched successfully"
      ))
});

export { getUser };