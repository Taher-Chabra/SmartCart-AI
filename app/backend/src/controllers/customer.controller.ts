import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { UserCustomer } from "../models/userCustomer.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// update customer address

const updateCustomerAddress = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as UserModel;
  const { address } = req.body;

  if (!address) {
    throw new ApiError(400, 'Address is required');
  }

  const updatedUser = await UserCustomer.findByIdAndUpdate(
    user._id,
    {
      $set: {
        address,
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
        'Address updated successfully'
      )
    );
});

export { updateCustomerAddress }