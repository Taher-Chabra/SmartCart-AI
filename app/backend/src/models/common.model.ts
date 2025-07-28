import mongoose from 'mongoose';
import { IUserAddress } from '@smartcartai/shared/src/interface/user';

const addressSchema = new mongoose.Schema<IUserAddress>(
  {
    line1: { type: String, trim: true },
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: String,
    country: String,
    zip: String,
    landmark: String
  },
  { _id: false }
);

export { addressSchema };