import mongoose, { Document } from 'mongoose';
import { addressSchema } from './common.model';
import { ICustomer } from '@smartcartai/shared/src/interface/user';

export interface CustomerModel extends ICustomer, Document {
   userId: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userCustomerSchema = new mongoose.Schema<CustomerModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    address: addressSchema,
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    orderHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          min: 1,
        }
      },
    ],
  },
  { timestamps: true }
);

export const UserCustomer = mongoose.model('UserCustomer', userCustomerSchema);
