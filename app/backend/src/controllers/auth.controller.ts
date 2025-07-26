import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { User, UserDocument } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { authResponseData } from "../utils/auth.utils";

const authSuccessCallback = asyncHandler(async (req: Request, res: Response) => {
   // This callback is intended to be used after authentication strategies - LocalStrategy, GoogleStrategy have validated the user's credentials and attached the user object to `req.user`.
   const user = req.user as UserDocument; // Passport populates req.user

   if (!user) {
      throw new ApiError(401, "Authentication failed. User not found!");
   }

   const {accessToken, refreshToken, loggedInUser, cookieOptions} = await authResponseData(user);

   return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(200, { user: loggedInUser }, "User logged in successfully"));
});

// Register a new User

const registerUser = asyncHandler(async (req: Request, res: Response) => {
   const { fullName, username, email, password, role } = req.body;

   if (!fullName || !username || !email || !password) {
      throw new ApiError(400, "All fields are required!");
   }

   const existingUser = await User.findOne({
      $or: [{ username }, { email }]
   });

   if (existingUser) {
      throw new ApiError(400, "User with this credentials already exists!");
   }

   const newUser = await User.create({
      fullName,
      username: username.toLowerCase(),
      email,
      password,
      role
   });

   const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

   if (!createdUser) {
      throw new ApiError(500, "Failed to create user!");
   }

   return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"))
});

// Login User

const localUserLogin = authSuccessCallback

const googleUserLogin = authSuccessCallback

export { registerUser, localUserLogin, googleUserLogin };