import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";

// Generate secret tokens for user authentication

const generateSecretTokens = async (userId: mongoose.Types.ObjectId) => {
   const user = await User.findById(userId);
   if (!user) {
      throw new ApiError(404, "User not found");
   }
   const accessToken = user.generateAccessToken();
   const refreshToken = user.generateRefreshToken();

   user.refreshToken = refreshToken;
   await user.save({ validateBeforeSave: false });

   return { accessToken, refreshToken };
}

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

const loginUser = asyncHandler(async (req: Request, res: Response) => {
   const { email, password } = req.body;

   if (!email || !password) {
      throw new ApiError(400, "Email and password are required!");
   }

   const user = await User.findOne({email})

   if (!user) {
      throw new ApiError(401, "Invalid email or password!");
   }

   const checkPassword = await user.comparePassword(password);

   if (!checkPassword) {
      throw new ApiError(401, "Incorrect password!");
   }

   const { accessToken, refreshToken } = await generateSecretTokens(user._id);
});

export { registerUser, loginUser };