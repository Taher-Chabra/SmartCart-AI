import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { User, UserModel } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { authResponseData } from '../utils/authTokens';
import jwt from 'jsonwebtoken';
import { IJwtPayload } from '@smartcartai/shared/src/interface/user';
import { getProfileByRole } from '../lib/getProfileByRole';

const authSuccessCallback = asyncHandler(
  async (req: Request, res: Response) => {
    // This callback is intended to be used after authentication strategies - LocalStrategy, GoogleStrategy have validated the user's credentials and attached the user object to `req.user`.
    const user = req.user as UserModel; // Passport populates req.user

    if (!user) {
      throw new ApiError(401, 'Authentication failed. User not found!');
    }

    const profile = await getProfileByRole(user.role, user._id);

    if (!profile) {
      throw new ApiError(400, `Profile not found for role: ${user.role}`);
    }

    const { accessToken, refreshToken, cookieOptions } = await authResponseData(
      user._id
    );

    const fullUserProfile = {
      ...user.toJSON(),
      ...profile.toJSON(),
    };

    return res
      .status(200)
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { user: fullUserProfile },
          'User logged in successfully'
        )
      );
  }
);

// Register a new User

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, username, email, password, role } = req.body;

  if (!fullName || !username || !email || !password) {
    throw new ApiError(400, 'All fields are required!');
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, 'User with this credentials already exists!');
  }

  const newUser = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    role,
  });

  if (!newUser) {
    throw new ApiError(500, 'Failed to create user account.');
  }

  const profile = await getProfileByRole(newUser.role, newUser._id);

  if (!profile) {
    throw new ApiError(400, `Unable to create profile`);
  }

  
  const fullUserProfile = {
    ...newUser.toJSON(),
    ...profile.toJSON(),
  };
  
  const { accessToken, refreshToken, cookieOptions } = await authResponseData(
    newUser._id
  );

  return res
    .status(201)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(201, fullUserProfile, 'User registered successfully')
    );
});

// Login User

const localUserLogin = authSuccessCallback;

const googleUserLogin = authSuccessCallback;

// Refresh access token

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
   const incomingRefreshToken = req.cookies?.refreshToken;

   if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized access - refresh token is missing");
   }

   try {
      const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET as string
      ) as IJwtPayload;

      const user = await User.findById(decodedToken._id);

      if (!user) {
         throw new ApiError(401, "Invalid Refresh Token - User not found");
      }

      if (user.refreshToken !== incomingRefreshToken) {
         throw new ApiError(401, "Invalid Refresh Token - Token mismatch");
      }

      // Generate new access token and refresh token
      const { accessToken, refreshToken, cookieOptions } = await authResponseData(
         user._id
      );

      return res
         .status(200)
         .cookie("refreshToken", refreshToken, cookieOptions)
         .cookie("accessToken", accessToken, cookieOptions)
         .json(new ApiResponse(
            200,
            { accessToken, refreshToken },
            "Access token refreshed successfully"
         ));

   } catch (error: any) {
      throw new ApiError(401, error.message || "Invalid refresh token!");
   }
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as UserModel;

  await User.findByIdAndUpdate(
    user._id,
    { 
      $unset: { refreshToken: 1 }
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  }

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export { registerUser, localUserLogin, googleUserLogin, refreshAccessToken, logoutUser };
