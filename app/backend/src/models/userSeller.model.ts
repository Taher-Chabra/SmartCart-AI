import mongoose, { Document } from 'mongoose';
import { addressSchema } from './common.model';
import { ISeller } from '@smartcartai/shared/src/interface/user';

export interface SellerModel extends ISeller, Document {
  userId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSellerSchema = new mongoose.Schema<SellerModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessType: {
      type: String,
      enum: ['individual', 'company'],
    },
    businessName: {
      type: String,
      unique: true,
      lowerCase: true,
      trim: true,
    },
    businessEmail: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    businessLogo: String,
    address: addressSchema,
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
    },
    legalDocuments: [
      {
        docType: String,
        fileUrl: String,
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    paymentHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
      },
    ],
    customerOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  },
  { timestamps: true }
);

userSellerSchema.set('toJSON', {
  transform: (doc, ret) => {
    return {
      ...ret,
      businessName: ret.businessName || '',
      businessType: ret.businessType || '',
      businessEmail: ret.businessEmail || '',
      businessLogo: ret.businessLogo || '',
      address: ret.address || '',
    };
  }
});

export const UserSeller = mongoose.model('UserSeller', userSellerSchema);
