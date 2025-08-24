import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { User, UserModel } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { authResponseData } from '../utils/authTokens';
import jwt from 'jsonwebtoken';
import { IJwtPayload } from '@smartcartai/shared/src/interface/user';
import { getProfileByRole } from '../lib/getProfileByRole';
import mongoose from 'mongoose';
import passport from 'passport';
import { generateOTPAndSave, verifyOTP } from '../utils/otp';
import { sendVerificationEmail } from '../lib/emailVerification';
import { get } from 'http';

const authSuccessCallback = asyncHandler(
  async (req: Request, res: Response) => {
    // This callback is intended to be used after authentication strategies - LocalStrategy, GoogleStrategy have validated the user's credentials and attached the user object to `req.user`.
    const user = req.user as UserModel; // Passport populates req.user

    if (!user) {
      throw new ApiError(401, 'Authentication failed. User not found!');
    }

    const { accessToken, refreshToken, cookieOptions } = await authResponseData(
      user._id
    );
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);

    if (user.authType === 'google' && user.google.id && !user.isActive) {
      return res
        .status(302)
        .redirect(`${process.env.CLIENT_URL}/auth/${user._id}/choose-role`);
    }

    if (user.authType === 'local') {
      const profile = await getProfileByRole(user.role, user._id, 'find');
      if (!profile) {
        throw new ApiError(404, `Profile not found for user: ${user.username}`);
      }

      const safeUser = user.toObject();
      delete safeUser.password;
      delete safeUser.refreshToken;

      const fullUserProfile = {
        ...safeUser,
        ...profile.toJSON(),
      };

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { user: fullUserProfile },
            'User authenticated successfully'
          )
        );
    }

    return res
      .status(302)
      .redirect(`${process.env.CLIENT_URL}/${user.role}/dashboard`);
  }
);

// Send verification code to email for email verification

const sendCodeToEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const getCode = await generateOTPAndSave(email);
  if (!getCode.success) {
    throw new ApiError(500, getCode.reason || 'Wait for 2 minutes before requesting a new code');
  }

  const response = await sendVerificationEmail(email, getCode.token as string);
  if (!response.success) {
    throw new ApiError(500, response.error || 'Failed to send verification email');
  }

  return res
    .status(200)
    .json(new ApiResponse(
      200,
      {},
      'Verification code sent successfully.'
    ))
});

// verify code for completing email verification

const verifyCode = asyncHandler(async (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    throw new ApiError(400, 'Email and code are required');
  }
  
  const isCodeValid = await verifyOTP(email, code);
  if (!isCodeValid.success) {
    throw new ApiError(400, isCodeValid.reason || 'Invalid verification code');
  }

  return res
    .status(200)
    .json(new ApiResponse(
      200,
      {},
      'Email verified successfully'
    ));
});

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

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newUser = new User({
      fullName,
      username: username.toLowerCase(),
      email,
      password,
      role,
      isEmailVerified: true
    });
    await newUser.save({ session });

    if (!newUser) {
      throw new ApiError(500, 'Failed to create user account.');
    }

    const profile = await getProfileByRole(
      newUser.role,
      newUser._id,
      'create',
      session
    );

    if (!profile) {
      throw new ApiError(400, `Unable to create profile`);
    }

    await session.commitTransaction();
    session.endSession();

    const safeUser = newUser.toObject();
    delete safeUser.password;
    delete safeUser.refreshToken;

    const fullUserProfile = {
      ...safeUser,
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
        new ApiResponse(
          201,
          { user: fullUserProfile },
          'User registered successfully'
        )
      );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, 'Failed to register user. Please try again later.');
  }
});

// Login User

const localUserLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'local',
    { session: false },
    (err: any, user: UserModel, info: any) => {
      if (err) return next(err);

      if (!user) {
        return res
          .status(400)
          .json({ message: info?.message || 'Invalid credentials' });
      }

      req.user = user;
      return authSuccessCallback(req, res, next);
    }
  )(req, res, next);
};

const googleUserLogin = authSuccessCallback;

const chooseRole = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as UserModel;
  const { userId } = req.params;

  if (user._id.toString() !== userId) {
    throw new ApiError(404, 'User Id mismatch');
  }

  const role = req.body.role;
  const allowedRoles = ['customer', 'seller'];
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, 'Invalid role selection');
  }

  const profile = await getProfileByRole(role, user._id, 'create');
  if (!profile) {
    throw new ApiError(400, `Unable to create profile`);
  }

  user.role = role;
  user.isActive = true;
  await user.save();

  const fullUserProfile = {
    ...user.toJSON(),
    ...profile.toJSON(),
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: fullUserProfile },
        'User role updated successfully'
      )
    );
};

// Refresh access token

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized access - refresh token is missing');
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as IJwtPayload;

    const user = await User.findById(decodedToken._id).select('+refreshToken');

    if (!user) {
      throw new ApiError(401, 'Invalid Refresh Token - User not found');
    }

    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, 'Invalid Refresh Token - Token mismatch');
    }

    // Generate new access token and refresh token
    const { accessToken, refreshToken, cookieOptions } = await authResponseData(
      user._id
    );

    return res
      .status(200)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .cookie('accessToken', accessToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          'Access token refreshed successfully'
        )
      );
  } catch (error: any) {
    throw new ApiError(401, error.message || 'Invalid refresh token!');
  }
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as UserModel;

  await User.findByIdAndUpdate(
    user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export {
  sendCodeToEmail,
  verifyCode,
  registerUser,
  localUserLogin,
  googleUserLogin,
  chooseRole,
  refreshAccessToken,
  logoutUser
};
