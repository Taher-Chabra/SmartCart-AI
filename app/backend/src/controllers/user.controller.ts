import { getProfileByRole } from '../lib/getProfileByRole';
import { User, UserModel } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { Request, Response } from 'express';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary';

// Get user profile

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as UserModel;

  const currentUser = await User.findById(user.id);

  if (!currentUser) {
    throw new ApiError(404, 'User not found');
  }

  const profile = await getProfileByRole(
    currentUser.role,
    currentUser._id,
    'find'
  );

  if (!profile) {
    throw new ApiError(
      400,
      `Profile not found for User: ${currentUser.username}`
    );
  }

  const fullUserProfile = {
    ...currentUser.toJSON(),
    ...profile.toJSON(),
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: fullUserProfile },
        'User fetched successfully'
      )
    );
});

// Upload user profile picture on Cloudinary

const uploadUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
      throw new ApiError(400, 'No file uploaded');
    }

    const user = req.user as UserModel;

    const uploadedAvatar = await uploadOnCloudinary('avatar', avatarLocalPath);
    if (!uploadedAvatar?.url) {
      throw new ApiError(500, 'Failed to upload avatar');
    }
    
    if (user.avatar) {
      const publicId = user.avatar.split('/').slice(-3).join('/').split('.')[0];
      await deleteFromCloudinary(publicId);
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          avatar: uploadedAvatar.url,
        }
      },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: updatedUser },
          'Avatar uploaded successfully'
        )
      );
  }
);

// Remove user profile picture from Cloudinary

const removeUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as UserModel;

  if (!user.avatar) {
    throw new ApiError(404, 'User avatar not found');
  }

  const publicId = user.avatar.split('/').slice(-3).join('/').split('.')[0];
  const removedAvatar = await deleteFromCloudinary(publicId);

  if (removedAvatar?.result !== 'ok') {
    throw new ApiError(500, 'Failed to remove avatar');
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $unset: {
        avatar: '',
      }
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        'User avatar removed successfully'
      )
    );
});

export { getUser, uploadUserProfile, removeUserProfile };
