import mongoose, { Document } from 'mongoose';
import { IUserFull as IUser, IUserJwtPayload } from '@smartcartai/shared/interface/user';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface IUserMethods {
  comparePassword(newPassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface UserDocument extends IUser, Document, IUserMethods {
  _id: mongoose.Types.ObjectId;
}

const phoneSchema = new mongoose.Schema(
  {
    countryCode: String,
    number: { type: String, trim: true },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, trim: true },
    city: { type: String, trim: true },
    state: String,
    country: String,
    zip: String,
    landmark: String,
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: false,
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    google: { 
      id: {
        type: String,
        unique: true,
        sparse: true,
        required: false,
        select: false
      }
    },
    authType: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
      required: true,
      select: false
    },
    phone: phoneSchema,
    address: addressSchema,
    role: {
      type: String,
      enum: ['customer', 'admin', 'seller'],
      default: 'customer',
    },
    avatar: {
      type: String,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        unique: true,
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        variants: {
          type: Map,
          of: String,
        },
      },
    ],
    orderHistory: [
      {
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order',
          required: true,
        },
        orderDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  const user = this;

  try {
    if (!user.isModified('password') && !this.password && this.authType !== 'local') {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error as mongoose.CallbackError);
  }
});

UserSchema.methods.comparePassword = async function (
  newPassowrd: string
): Promise<boolean> {
  if (!this.password) {
    throw new Error('Password not set for this user');
  }
  return await bcrypt.compare(newPassowrd, this.password);
};

UserSchema.methods.generateAccessToken = function (): string {
  const payload: IUserJwtPayload = {
    _id: this._id,
    username: this.username,
    email: this.email,
    role: this.role,
  };

  const tokenSecret = process.env.ACCESS_TOKEN_SECRET!;
 
  const options = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn']
  };

  return jwt.sign(
    payload,
    tokenSecret,
    options
  );
};

UserSchema.methods.generateRefreshToken = function (): string {
  const payload = {
    _id: this._id,
  };

  const tokenSecret: Secret = process.env.REFRESH_TOKEN_SECRET!;

  const options = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions['expiresIn']
  };

  return jwt.sign(
    payload,
    tokenSecret,
    options
  );
};

export const User = mongoose.model('User', UserSchema);
