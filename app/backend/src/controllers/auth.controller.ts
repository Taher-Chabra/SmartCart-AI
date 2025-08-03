import { asyncHandler } from '../utils/asyncHandler';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { User, UserModel } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { authResponseData } from '../utils/auth.utils';
import { CustomerModel, UserCustomer } from '../models/userCustomer.model';
import { SellerModel, UserSeller } from '../models/userSeller.model';
import { AdminModel, UserAdmin } from '../models/userAdmin.model';
import jwt from 'jsonwebtoken';
import { IJwtPayload } from '@smartcartai/shared/src/interface/user';

const authSuccessCallback = asyncHandler(
  async (req: Request, res: Response) => {
    // This callback is intended to be used after authentication strategies - LocalStrategy, GoogleStrategy have validated the user's credentials and attached the user object to `req.user`.
    const user = req.user as UserModel; // Passport populates req.user

    if (!user) {
      throw new ApiError(401, 'Authentication failed. User not found!');
    }

    let roleProfile: CustomerModel | SellerModel | AdminModel | null = null;
    let ProfileModel: Model<any>;

    switch (user.role) {
      case 'customer':
        ProfileModel = UserCustomer;
        break;
      case 'seller':
        ProfileModel = UserSeller;
        break;
      case 'admin':
        ProfileModel = UserAdmin;
        break;
      default:
        throw new ApiError(500, 'Invalid user role.');
    }

    roleProfile = await ProfileModel.findOne({ userId: user._id });

    if (!roleProfile) {
      throw new ApiError(
        500,
        `User profile for role:'${user.role}' not found.`
      );
    }

    const { accessToken, refreshToken, cookieOptions } = await authResponseData(
      user._id
    );

    const fullUserProfile = {
      ...user.toJSON(),
      profile: roleProfile.toJSON(),
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

  let roleProfile: CustomerModel | SellerModel | null = null;
  let ProfileModel: Model<any>;

  switch (role) {
    case 'customer':
      ProfileModel = UserCustomer;
      break;
    case 'seller':
      ProfileModel = UserSeller;
      break;
    default:
      throw new ApiError(400, 'Invalid user role.');
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

  roleProfile = await ProfileModel.create({
    userId: newUser._id,
  });

  const { accessToken, refreshToken, cookieOptions } = await authResponseData(
    newUser._id
  );

  const fullUserProfile = {
    ...newUser.toJSON(),
    profile: roleProfile?.toJSON(),
  };

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
